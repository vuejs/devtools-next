import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { normalizePath } from 'vite'
import type { PluginOption, ResolvedConfig, ViteDevServer } from 'vite'
import sirv from 'sirv'
import Inspect from 'vite-plugin-inspect'
import VueInspector from 'vite-plugin-vue-inspector'
import { DIR_CLIENT } from './dir'

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : Required<T[P]>;
}

function getVueDevtoolsPath() {
  const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)))
  return pluginPath.replace(/\/dist$/, '/\/src')
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
}

const defaultOptions: DeepRequired<VitePluginVueDevToolsOptions> = {
  appendTo: '',
  openInEditorHost: false,
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
        return `export default ${JSON.stringify({ base: config.base })}`
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
              src: '/@id/virtual:vue-devtools-path:overlay.js',
            },
          },
          // inject inspector script manually to ensure it's loaded after vue-devtools
          {
            tag: 'script',
            injectTo: 'head',
            attrs: {
              type: 'module',
              src: '/@id/virtual:vue-inspector-path:load.js',
            },
          },
        ],
      }
    },
    async buildEnd() {
    },
  }

  return [
    VueInspector({
      lazyLoad: pluginOptions.appendTo ? 200 : false,
      toggleComboKey: '',
      toggleButtonVisibility: 'never',
      openInEditorHost: pluginOptions.openInEditorHost,
      appendTo: pluginOptions.appendTo || 'manually',
    }),
    plugin,
    inspect,
  ]
}
