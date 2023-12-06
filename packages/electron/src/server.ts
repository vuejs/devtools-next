import { createServer } from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { Server } from 'socket.io'

export function init() {
  const app = createApp()
  app.use(
    '/',
    eventHandler((event) => {
      const userAppContent = fs.readFileSync(path.join(__dirname, './user-app.js'), 'utf-8')
      return userAppContent
    }),
  )

  const httpServer = createServer(toNodeListener(app))
  const io = new Server(httpServer, {
    cors: {
      origin: true,
    },
  })

  io.on('connection', (socket) => {
    // Disconnect any previously connected apps
    // socket.broadcast.emit('vue-devtools-disconnect-backend')

    socket.on('vue-devtools-init', () => {
      socket.broadcast.emit('vue-devtools-init')
    })

    socket.on('disconnect', (reason) => {
      if (reason.indexOf('client'))
        socket.broadcast.emit('vue-devtools-disconnect-devtools')
    })

    socket.on('vue-message', (data) => {
      socket.broadcast.emit('vue-message', data)
    })
  })

  httpServer.listen(8098, () => {
    console.log(`listening on 0.0.0.0:${8098}`)
  })
}
