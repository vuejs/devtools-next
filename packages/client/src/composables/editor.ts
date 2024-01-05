import { showVueNotification } from '@vue/devtools-ui'

export function useCopy() {
  const { copy: _copy, copied } = useClipboard()

  const copy = (text: string, silent = false, _type?: string) => {
    _copy(text).then(() => {
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

  return {
    copy,
    copied,
  }
}
