import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { normalizePath } from 'vite'
import type { PluginOption, ResolvedConfig, ViteDevServer } from 'vite'
import sirv from 'sirv'
import Inspect from 'vite-plugin-inspect'
import { setViteServerContext } from '@vue/devtools-kit'
import VueInspector from 'vite-plugin-vue-inspector'
import { createViteServerRpc } from '@vue/devtools-core'
import { bold, cyan, dim, green, yellow } from 'kolorist'
import type { VitePluginInspectorOptions } from 'vite-plugin-vue-inspector'
import { DIR_CLIENT } from './dir'
import { getRpcFunctions } from './rpc'

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
   * Enable vue component inspector
   *
   * @default true
   */
  componentInspector?: boolean | VitePluginInspectorOptions

  /**
   * Target editor when open in editor (v7.2.0+)
   *
   * @default code (Visual Studio Code)
   */
  launchEditor?: 'appcode' | 'atom' | 'atom-beta' | 'brackets' | 'clion' | 'code' | 'code-insiders' | 'codium' | 'emacs' | 'idea' | 'notepad++' | 'pycharm' | 'phpstorm' | 'rubymine' | 'sublime' | 'vim' | 'visualstudio' | 'webstorm' | 'rider' | string

  /**
   * Customize openInEditor host
   * @default false
   * @deprecated This option is deprecated and removed in 7.1.0. The plugin now automatically detects the correct host.
   */
  openInEditorHost?: string | false

  /**
   * DevTools client host
   * useful for projects that use a reverse proxy
   * @default false
   * @deprecated This option is deprecated and removed in 7.1.0. The plugin now automatically detects the correct host.
   */
  clientHost?: string | false
}

const defaultOptions: VitePluginVueDevToolsOptions = {
  appendTo: '',
  componentInspector: true,
  launchEditor: process.env.LAUNCH_EDITOR ?? 'code',
}

function mergeOptions(options: VitePluginVueDevToolsOptions): VitePluginVueDevToolsOptions {
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

    // vite client <-> server messaging
    setViteServerContext(server)

    const rpcFunctions = getRpcFunctions({
      rpc: inspect.api.rpc,
      server,
      config,
    })
    createViteServerRpc(rpcFunctions)

    const _printUrls = server.printUrls
    const colorUrl = (url: string) =>
      cyan(url.replace(/:(\d+)\//, (_, port) => `:${bold(port)}/`))

    server.printUrls = () => {
      const urls = server.resolvedUrls!
      const keys = normalizeComboKeyPrint('option-shift-d')
      _printUrls()
      for (const url of urls.local)
        console.log(`  ${green('➜')}  ${bold('Vue DevTools')}: ${green(`Open ${colorUrl(`${url}__devtools__/`)} as a separate window`)}`)
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
        return `export default ${JSON.stringify({ base: config.base, componentInspector: pluginOptions.componentInspector })}`
    },
    transform(code, id, options) {
      if (options?.ssr)
        return

      const { appendTo } = pluginOptions
      const [filename] = id.split('?', 2)

      if (appendTo
        && (
          (typeof appendTo === 'string' && filename.endsWith(appendTo))
          || (appendTo instanceof RegExp && appendTo.test(filename)))) {
        code = `import 'virtual:vue-devtools-path:overlay.js';\n${code}`
      }

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
            injectTo: 'head-prepend',
            attrs: {
              type: 'module',
              src: `${config.base || '/'}@id/virtual:vue-devtools-path:overlay.js`,
            },
          },
          // inject inspector script manually to ensure it's loaded after vue-devtools
          pluginOptions.componentInspector && {
            tag: 'script',
            injectTo: 'head-prepend',
            launchEditor: pluginOptions.launchEditor,
            attrs: {
              type: 'module',
              src: `${config.base || '/'}@id/virtual:vue-inspector-path:load.js`,
            },
          },
        ].filter(Boolean),
      }
    },
    async buildEnd() {
    },
  }

  return [
    inspect as PluginOption,
    pluginOptions.componentInspector && VueInspector({
      toggleComboKey: '',
      toggleButtonVisibility: 'never',
      launchEditor: pluginOptions.launchEditor,
      ...typeof pluginOptions.componentInspector === 'boolean'
        ? {}
        : pluginOptions.componentInspector,
      appendTo: pluginOptions.appendTo || 'manually',
    }) as PluginOption,
    plugin,
  ].filter(Boolean)
}
