import { initDevTools } from '../client/devtools-panel'
import { Bridge } from '../../core/src/bridge'

initDevTools({
  connect(cb) {
    const bridge = new Bridge({
      tracker(fn: any) {
      },
      trigger(data) {
      },
    })

    cb(bridge)
  },
  reload(fn) {
  },
})

console.log('????')
