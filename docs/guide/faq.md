# Frequently Asked Questions

## I can't use the Open In Editor feature

The feature is based on the [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector) plugin and requires configuration, which you can do by looking at the [configuration documentation](https://github.com/webfansplz/vite-plugin-vue-inspector?tab=readme-ov-file#--configuration-ide--editor).

## How to work with Laravel Vite Plugin?

```ts
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    DevTools({
      appendTo: 'resources/js/app.js'
    }),
    laravel([
      'resources/js/app.js',
    ]),
  ],
})
```

## How to work with Nuxt3? (v7.1.3+)

:::tip Recommendation
We still recommend using [Nuxt DevTools](https://github.com/nuxt/devtools) for a better development experience.
:::

```ts
// nuxt.config.ts

export default defineNuxtConfig({
  vite: {
    plugins: [
      VueDevTools({
        appendTo: /\/entry\.m?js$/,
      })
    ]
  }
})
```
