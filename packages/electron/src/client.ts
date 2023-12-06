import io from 'socket.io-client'
import { initDevTools } from '../client/devtools-panel'
import { Bridge } from '../../core/src/bridge'

const port = 8098
const socket = io(`http://localhost:${port}`)

socket.on('vue-devtools-init', () => {
  initDevTools({
    connect(cb) {
      const bridge = new Bridge({
        tracker(fn: any) {
          socket.on('vue-message', (data) => {
            fn(data)
          })
        },
        trigger(data) {
          socket.emit('vue-message', data)
        },
      })

      cb(bridge)
    },
    reload(fn) {
    },
  })
})
