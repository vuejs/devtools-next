import { initDevTools as _initDevTools } from './main'

export { createConnectionApp } from './main'

export function initDevTools(shell) {
  _initDevTools()
  // if (!isBrowser)
  //   return
  // if (isInChromePanel) {
  //   target.chrome.storage.local.get(VIEW_MODE_STORAGE_KEY).then((storage) => {
  //     _initDevTools(shell, {
  //       viewMode: storage[VIEW_MODE_STORAGE_KEY] ?? 'overlay',
  //     })
  //   })
  // }
  // else {
  //   _initDevTools(shell)
  // }
}
