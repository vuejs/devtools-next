import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { normalizePath } from 'vite'
import type { PluginOption, ResolvedConfig, ViteDevServer } from 'vite'
import sirv from 'sirv'
import Inspect from 'vite-plugin-inspect'
import VueInspector from 'vite-plugin-vue-inspector'
import { setupViteRPCServer } from '@vue-devtools-next/core'
import { setupAssetsRPC, setupGraphRPC } from '@vue-devtools-next/core/server'
import { bold, dim, green, yellow } from 'kolorist'
import { DIR_CLIENT } from './dir'

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : Required<T[P]>;
}

function getVueDevtoolsPath() {
  const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)))
  return pluginPath.replace(/\/dist$/, '/\/src')
}

const toggleComboKeysMap = {
  option: process.platform === 'darwin' ? 'Option(⌥)' : 'Alt(⌥)',
  meta: 'Command(⌘)',
  shift: 'Shift(⇧)',
}
function normalizeComboKeyPrint(toggleComboKey: string) {
  return toggleComboKey.split('-').map(key => toggleComboKeysMap[key] || key[0].toUpperCase() + key.slice(1)).join(dim('+'))
}

export interface VitePluginVueDevToolsOptions {
  /**
   * append an import to the module id ending with `appendTo` instead of adding a script into body
   * useful for projects that do not use html file as an entry
   *
   * WARNING: only set this if you know exactly what it does.
   * @default ''
   */
  appendTo?: string | RegExp

  /**
   * Customize openInEditor host (e.g. http://localhost:3000)
   * @default false
   */
  openInEditorHost?: string | false

  /**
   * DevTools client host (e.g. http://localhost:3000)
   * useful for projects that use a reverse proxy
   * @default false
   */
  clientHost?: string | false
}

const defaultOptions: DeepRequired<VitePluginVueDevToolsOptions> = {
  appendTo: '',
  openInEditorHost: false,
  clientHost: false,
}

function mergeOptions(options: VitePluginVueDevToolsOptions): DeepRequired<VitePluginVueDevToolsOptions> {
  return Object.assign({}, defaultOptions, options)
}

export default function VitePluginVueDevTools(options?: VitePluginVueDevToolsOptions): PluginOption {
  const vueDevtoolsPath = getVueDevtoolsPath()
  const inspect = Inspect({
    silent: true,
  })

  const pluginOptions = mergeOptions(options ?? {})

  let config: ResolvedConfig

  function configureServer(server: ViteDevServer) {
    const base = (server.config.base) || '/'
    server.middlewares.use(`${base}__devtools__`, sirv(DIR_CLIENT, {
      single: true,
      dev: true,
    }))
    setupViteRPCServer(server.ws, {
      root: () => config.root,
      ...setupAssetsRPC({
        root: config.root,
        base,
      }),
      ...setupGraphRPC({
        rpc: inspect.api.rpc,
      }),
    })
    const _printUrls = server.printUrls
    server.printUrls = () => {
      const keys = normalizeComboKeyPrint('option-shift-d')
      _printUrls()
      console.log(`  ${green('➜')}  ${bold('Vue DevTools')}: ${green(`Press ${yellow(keys)} in App to toggle the Vue DevTools`)}\n`)
    }
  }
  const plugin = <PluginOption>{
    name: 'vite-plugin-vue-devtools',
    enforce: 'pre',
    apply: 'serve',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    configureServer(server) {
      configureServer(server)
    },
    async resolveId(importee: string) {
      if (importee.startsWith('virtual:vue-devtools-options')) {
        return importee
      }
      else if (importee.startsWith('virtual:vue-devtools-path:')) {
        const resolved = importee.replace('virtual:vue-devtools-path:', `${vueDevtoolsPath}/`)
        return resolved
      }
    },
    async load(id) {
      if (id === 'virtual:vue-devtools-options')
        return `export default ${JSON.stringify({ base: config.base, clientHost: pluginOptions.clientHost })}`
    },
    transform(code, id) {
      const { root, base } = config

      const projectPath = `${root}${base}`

      if (!id.startsWith(projectPath))
        return

      const { appendTo } = pluginOptions

      const [filename] = id.split('?', 2)
      if (appendTo
        && (
          (typeof appendTo === 'string' && filename.endsWith(appendTo))
          || (appendTo instanceof RegExp && appendTo.test(filename))))
        code = `${code}\nimport 'virtual:vue-devtools-path:overlay.js'`

      return code
    },
    transformIndexHtml(html) {
      if (pluginOptions.appendTo)
        return

      return {
        html,
        tags: [
          {
            tag: 'script',
            injectTo: 'head',
            attrs: {
              type: 'module',
              src: `${config.base || '/'}@id/virtual:vue-devtools-path:overlay.js`,
            },
          },
          // inject inspector script manually to ensure it's loaded after vue-devtools
          {
            tag: 'script',
            injectTo: 'head',
            attrs: {
              type: 'module',
              src: `${config.base || '/'}@id/virtual:vue-inspector-path:load.js`,
            },
          },
        ],
      }
    },
    async buildEnd() {
    },
  }

  return [
    inspect as PluginOption,
    VueInspector({
      toggleComboKey: '',
      toggleButtonVisibility: 'never',
      openInEditorHost: pluginOptions.openInEditorHost,
      appendTo: pluginOptions.appendTo || 'manually',
    }) as PluginOption,
    plugin,
  ]
}
