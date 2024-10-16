import { isBrowser } from '@vue/devtools-shared'

const TIMELINE_LAYERS_STATE_STORAGE_ID = '__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS_STATE__'

export function addTimelineLayersStateToStorage(state: Record<string, boolean | string>) {
  if (!isBrowser) {
    return
  }
  localStorage.setItem(TIMELINE_LAYERS_STATE_STORAGE_ID, JSON.stringify(state))
}

export function getTimelineLayersStateFromStorage() {
  if (!isBrowser) {
    return {
      recordingState: false,
      mouseEventEnabled: false,
      keyboardEventEnabled: false,
      componentEventEnabled: false,
      performanceEventEnabled: false,
      selected: '',
    }
  }
  const state = localStorage.getItem(TIMELINE_LAYERS_STATE_STORAGE_ID)
  return state
    ? JSON.parse(state)
    : {
        recordingState: false,
        mouseEventEnabled: false,
        keyboardEventEnabled: false,
        componentEventEnabled: false,
        performanceEventEnabled: false,
        selected: '',
      }
}
