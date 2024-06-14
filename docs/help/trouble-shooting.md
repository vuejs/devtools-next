# Trouble Shooting

## Nesting devtools rendering issue

If you see the devtools rendering issue like this:

![issue image](/screenshots/nested-issue.png)

And you are using `vite-plugin-html`, you can fix this issue by adding `vite-plugin-vue-devtools` before `vite-plugin-html` in the plugins array.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    VueDevTools(),
    // Ensure that `vite-plugin-vue-devtools` is before `vite-plugin-html`
    createHtmlPlugin({})
  ]
})
```
