import { VIEW_MODE_STORAGE_KEY, isBrowser, isInChromePanel, target } from '@vue-devtools-next/shared'

import { initDevTools as _initDevTools } from './main'

export function initDevTools(shell) {
  if (!isBrowser)
    return
  if (isInChromePanel) {
    target.chrome.storage.local.get(VIEW_MODE_STORAGE_KEY).then((storage) => {
      _initDevTools(shell, {
        viewMode: storage[VIEW_MODE_STORAGE_KEY] ?? 'overlay',
      })
    })
  }
  else {
    _initDevTools(shell)
  }
}
