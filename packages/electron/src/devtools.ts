import io from 'socket.io-client/dist/socket.io.js'
import { createConnectionApp, initDevTools } from '../client/devtools-panel'
import { Bridge } from '../../core/src/bridge'

const port = window.process.env.PORT || 8098

function init() {
  const socket = io(`http://localhost:${port}`)
  let reload: Function | null = null
  const app = createConnectionApp()

  socket.on('vue-devtools:init', () => {
    app.unmount()

    // If new page is opened reload devtools
    if (reload)
      return reload()

    console.log()
    initDevTools({
      connect(cb) {
        const bridge = new Bridge({
          tracker(fn) {
            socket.on('vue-devtools:message', (data) => {
              fn(data)
            })
          },
          trigger(data) {
            socket.emit('vue-devtools:message', data)
          },
        })

        cb(bridge)
      },
      reload(fn) {
        reload = fn
      },
    })
  })

  socket.on('vue-devtools:disconnect', () => {
    app.unmount()
    reload = null
    socket.close()
    init()
  })
}

init()
