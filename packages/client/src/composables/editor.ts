import { showVueNotification } from '@vue/devtools-ui'

export function useCopy() {
  const clipboard = useClipboard()

  return (text: string, silent = false) => {
    clipboard.copy(text).then(() => {
      if (!silent) {
        showVueNotification({
          message: 'Copied to clipboard',
          type: 'success',
          duration: 3000,
        })
      }
    }).catch(() => {
      if (!silent) {
        showVueNotification({
          message: 'Failed to copy to clipboard',
          type: 'error',
          duration: 3000,
        })
      }
    })
  }
}
