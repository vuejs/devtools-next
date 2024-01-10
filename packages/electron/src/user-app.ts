// import io from 'socket.io-client/dist/socket.io.js'
import io from 'socket.io-client'
import { isBrowser, target } from '@vue/devtools-shared'
import { Bridge } from '../../core/src/bridge'
import { prepareInjection } from '../../core/src/injection'
import { devtools } from '../../devtools-kit/src/index'

const createSocket = io
const host = target.__VUE_DEVTOOLS_HOST__ || 'http://localhost'
const port = target.__VUE_DEVTOOLS_PORT__ !== undefined ? target.__VUE_DEVTOOLS_PORT__ : 8098
const fullHost = port ? `${host}:${port}` : host
const socket = createSocket(fullHost)

// @TODO: de-duplicate
devtools.init()

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

socket.on('connect', () => {
  prepareInjection(bridge)
  socket.emit('vue-devtools:init')
})

// Global disconnect handler. Fires in two cases:
// - after calling above socket.disconnect()
// - once devtools is closed (that's why we need socket.disconnect() here too, to prevent further polling)
socket.on('disconnect', () => {
  socket.disconnect()
})

// Disconnect socket once other client is connected
socket.on('vue-devtools:disconnect-user-app', () => {
  socket.disconnect()
})

if (isBrowser) {
  window.addEventListener('beforeunload', () => {
    socket.emit('vue-devtools:disconnect')
  })
}
