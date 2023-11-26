import { target } from '@vue-devtools-next/shared'

export interface VueInspector {
  enabled: boolean
  position: {
    x: number
    y: number
  }
  linkParams: {
    file: string
    line: number
    column: number
  }

  enable: () => void
  disable: () => void
  toggleEnabled: () => void
  openInEditor: (baseUrl: string, file: string, line: number, column: number) => void
  onUpdated: () => void
}

function waitForInspectorInit(cb: () => void) {
  let total = 0
  const timer = setInterval(() => {
    if (target.__VUE_INSPECTOR__) {
      clearInterval(timer)
      total += 30
      cb()
    }
    if (total >=/* 5s */ 5000)
      clearInterval(timer)
  }, 30)
}

function setupInspector() {
  const inspector = target.__VUE_INSPECTOR__
  const _openInEditor = inspector.openInEditor
  inspector.openInEditor = async (...params: Parameters<VueInspector['openInEditor']>) => {
    inspector.disable()
    _openInEditor(...params)
  }
}

export function getVueInspector(): Promise<VueInspector> {
  return new Promise((resolve) => {
    function setup() {
      setupInspector()
      resolve(target.__VUE_INSPECTOR__)
    }
    if (!target.__VUE_INSPECTOR__) {
      waitForInspectorInit(() => {
        setup()
      })
    }
    else {
      setup()
    }
  })
}
