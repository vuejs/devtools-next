import { VIEW_MODE_STORAGE_KEY, isInChromePanel, target } from '@vue/devtools-next-shared'
import { useDevToolsBridge } from '@vue/devtools-next-core'

export function useToggleViewMode() {
  const bridge = useDevToolsBridge()
  const viewMode = ref('')

  if (isInChromePanel) {
    target.chrome.storage.local.get(VIEW_MODE_STORAGE_KEY).then((storage) => {
      viewMode.value = storage[VIEW_MODE_STORAGE_KEY] ?? 'overlay'
    })
  }

  return {
    viewMode,
    toggle(value: 'overlay' | 'panel') {
      viewMode.value = value
      target.chrome.storage.local.set({ [VIEW_MODE_STORAGE_KEY]: value })
      if (isInChromePanel)
        bridge.value.emit('toggle-view-mode', value)
    },
  }
}
