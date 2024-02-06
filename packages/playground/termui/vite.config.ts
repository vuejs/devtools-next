import { defineConfig } from 'vite'
import VueTermui from 'vite-plugin-vue-termui'

export default defineConfig({
  plugins: [VueTermui()],
  server: {
    port: 3002,
  },
})
