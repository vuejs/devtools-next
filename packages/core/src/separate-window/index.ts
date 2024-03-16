import { Bridge } from '../bridge'
import { prepareInjection } from '../injection'

const BROADCAST_CHANNEL_NAME = '__vue-devtools-broadcast-channel__'

const MESSAGING_APP_TARGET = '__VUE_DEVTOOLS_USER_APP__'
const MESSAGING_DEVTOOLS_TARGET = '__VUE_DEVTOOLS_CLIENT__'
const CHECK_CONNECTION_EVENT = '__VUE_DEVTOOLS_CHECK_CONNECTION__'
const CONNECTED_EVENT = '__VUE_DEVTOOLS_CONNECTED__'

// used in user app side
export function initAppSeparateWindow() {
  const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)
  const bridge = new Bridge({
    tracker(fn) {
      channel.onmessage = (event) => {
        if (event.data.target === MESSAGING_DEVTOOLS_TARGET)
          fn(event.data.data)
      }
    },
    trigger(data) {
      channel.postMessage({
        target: MESSAGING_APP_TARGET,
        data,
      })
    },
  })
  prepareInjection(bridge)

  bridge.on(CHECK_CONNECTION_EVENT, () => {
    bridge.emit(CONNECTED_EVENT)
    // force sync to make sure that connect the devtools client
    setTimeout(() => {
      bridge.emit('syn')
    }, 200)

    window.addEventListener('beforeunload', () => {
      bridge.emit('disconnect')
    })
  })
}

export function initDevToolsSeparateWindowBridge(channel: BroadcastChannel) {
  const bridge = new Bridge({
    tracker(fn) {
      channel.onmessage = (event) => {
        if (event.data.target === MESSAGING_APP_TARGET)
          fn(event.data.data)
      }
    },
    trigger(data) {
      channel.postMessage({
        target: MESSAGING_DEVTOOLS_TARGET,
        data,
      })
    },
  })

  return bridge
}

// used in devtools client side
export function initDevToolsSeparateWindow(
  options: {
    onConnected?: (channel: BroadcastChannel) => void
  } = {},
) {
  const { onConnected = () => {} } = options
  let connectionTimer: NodeJS.Timeout | null = null
  const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)

  function connect() {
    connectionTimer = setInterval(() => {
      channel.postMessage({
        target: MESSAGING_DEVTOOLS_TARGET,
        data: {
          event: CHECK_CONNECTION_EVENT,
        },
      })
    }, 2000)
  }

  channel.onmessage = (event) => {
    if (event.data?.data?.event === CONNECTED_EVENT) {
      clearInterval(connectionTimer!)
      onConnected(channel)
    }
  }

  connect()
}
