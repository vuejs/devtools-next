import { computed, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { state } from './position'

export function usePanelVisible() {
  const visible = computed({
    get() {
      return state.value.open
    },
    set(value) {
      state.value.open = value
    },
  })

  const toggleVisible = () => {
    visible.value = !visible.value
  }

  const closePanel = () => {
    if (!visible.value)
      return
    visible.value = false
    // if (popupWindow.value) {
    //   try {
    //     popupWindow.value.close()
    //   }
    //   catch { }
    //   popupWindow.value = null
    // }
  }

  onMounted(() => {
    useEventListener(window, 'keydown', (e) => {
      // cmd + shift + D in <macOS>
      // alt + shift + D in <Windows>
      if (e.code === 'KeyD' && e.altKey && e.shiftKey)
        toggleVisible()
    })
  })

  return {
    panelVisible: visible,
    togglePanelVisible: toggleVisible,
    closePanel,
  }
}
