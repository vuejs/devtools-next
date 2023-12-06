import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from 'h3'

export function init() {
  const app = createApp()
  app.use(
    '/',
    eventHandler((event) => {
      return 'Hello World!'
    }),
  )

  const httpServer = createServer(toNodeListener(app))

  httpServer.listen(8098, () => {
    console.log(`listening on 0.0.0.0:${8098}`)
  })
}
