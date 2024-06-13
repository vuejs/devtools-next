import {
  isInChromePanel,
  isInElectron,
  isInIframe,
} from '@vue/devtools-shared'

export function useHostEnv() {
  if (isInElectron)
    return 'electron'

  else if (isInChromePanel)
    return 'chrome'

  else if (isInIframe)
    return 'iframe'
  else
    return 'separate-window'
}
