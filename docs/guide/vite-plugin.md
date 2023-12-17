# Vite Plugin

> We provide a Vite plugin for running Vue DevTools. If your project uses Vite, we highly recommend using it as the preferred option for running DevTools, as it offers more powerful features.

:::tip Compatibility Note
Vue DevTools requires **Vite v3.1 or higher**.
:::

## Installation

::: code-group

```sh [npm]
$ npm add -D vite-plugin-vue-devtools
```

```sh [pnpm]
$ pnpm add -D vite-plugin-vue-devtools
```

```sh [yarn]
$ yarn add -D vite-plugin-vue-devtools
```

```sh [bun]
$ bun add -D vite-plugin-vue-devtools
```

:::

## Usage

```ts
//  Configuration Vite

import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    VueDevTools(),
  ],
})
```

## Options

```ts
interface VitePluginVueDevToolsOptions {
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
```
