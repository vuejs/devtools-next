import io from 'socket.io-client/dist/socket.io.js'
import ip from 'ip'
import { createConnectionApp, initDevTools } from '../client/devtools-panel'
import { Bridge } from '../../core/src/bridge'

const port = window.process.env.PORT || 8098

function init() {
  const localhost = `http://localhost:${port}`
  const socket = io(localhost)
  let reload: Function | null = null

  const app = createConnectionApp('#app', {
    local: localhost,
    network: `http://${ip.address()}:${port}`,
  })

  socket.on('vue-devtools:init', () => {
    app.unmount()

    // If new page is opened reload devtools
    if (reload)
      return reload()

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
