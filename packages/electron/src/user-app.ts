import io from 'socket.io-client/dist/socket.io.js'
import { Bridge } from '../../core/src/bridge'
import { prepareInjection } from '../../core/src/injection'
import { devtools } from '../../devtools-kit/src/index'

const createSocket = io
const host = 'http://localhost'
const port = 8098
const fullHost = `${host}:${port}`
const socket = createSocket(fullHost)

// @TODO: de-duplicate
devtools.init()

const bridge = new Bridge({
  tracker(fn) {
    socket.on('vue-message', (data) => {
      fn(data)
    })
  },
  trigger(data) {
    socket.emit('vue-message', data)
  },
})

socket.on('connect', () => {
  prepareInjection(bridge)
  socket.emit('vue-devtools-init')
})
