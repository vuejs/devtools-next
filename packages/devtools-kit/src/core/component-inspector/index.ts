import { target } from '@vue/devtools-shared'

export interface ComponentInspector {
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

target.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ ??= true
export function toggleComponentInspectorEnabled(enabled: boolean) {
  target.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = enabled
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
  inspector.openInEditor = async (...params: Parameters<ComponentInspector['openInEditor']>) => {
    inspector.disable()
    _openInEditor(...params)
  }
}

export function getComponentInspector(): Promise<ComponentInspector> {
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
