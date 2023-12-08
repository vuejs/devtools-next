import io from 'socket.io-client'
import { initDevTools } from '../client/devtools-panel'
import { Bridge } from '../../core/src/bridge'

const port = window.process.env.PORT || 8098
const socket = io(`http://localhost:${port}`)

let reload: Function | null = null

socket.on('vue-devtools:init', () => {
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
