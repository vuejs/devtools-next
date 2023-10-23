import { target } from '@vue-devtools-next/shared'
import type { BridgeInstanceType } from './bridge'

export enum HandShakeEvents {
  SYN = 'syn',
  SYN_ACK = 'syn-ack',
  ACK = 'ack',
}

class HandShake {
  public connected = false
  public socket: BridgeInstanceType

  constructor(bridge: BridgeInstanceType) {
    this.socket = bridge

    Object.defineProperty(this, 'connected', {
      set(value) {
        target.__VUE_DEVTOOLS_CLIENT_CONNECTED__ = value
      },
      get() {
        return target.__VUE_DEVTOOLS_CLIENT_CONNECTED__
      },
      configurable: true,
    })
  }
}

export class HandShakeClient extends HandShake {
  constructor(bridge: BridgeInstanceType) {
    super(bridge)
  }

  public onnConnect() {
    return new Promise<void>((resolve) => {
      this.socket.emit(HandShakeEvents.SYN)
      const timer = setInterval(() => {
        this.socket.emit(HandShakeEvents.SYN)
      }, 300)
      this.socket.on(HandShakeEvents.SYN_ACK, () => {
        clearTimeout(timer)
        this.socket.emit(HandShakeEvents.ACK)
        this.connected = true
        resolve()
      })
    })
  }
}

export class HandShakeServer extends HandShake {
  constructor(bridge: BridgeInstanceType) {
    super(bridge)
  }

  public onnConnect() {
    return new Promise<void>((resolve) => {
      this.socket.on(HandShakeEvents.SYN, () => {
        this.socket.emit(HandShakeEvents.SYN_ACK)
        const timer = setInterval(() => {
          this.socket.emit(HandShakeEvents.SYN_ACK)
        }, 300)
        this.socket.on(HandShakeEvents.ACK, () => {
          clearTimeout(timer)
          this.connected = true
          resolve()
        })
      })
    })
  }
}
