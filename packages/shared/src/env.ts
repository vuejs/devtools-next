export const isBrowser = typeof navigator !== 'undefined'
export const target = (typeof globalThis !== 'undefined'
  ? globalThis
  : typeof window !== 'undefined'
    ? window
    // eslint-disable-next-line no-restricted-globals
    : typeof global !== 'undefined'
      // eslint-disable-next-line no-restricted-globals
      ? global
      : {}) as typeof globalThis

export const isInChromePanel = typeof target.chrome !== 'undefined' && !!target.chrome.devtools
export const isInIframe = isBrowser && target.self !== target.top
export const isInElectron = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')

export const checkIsVitepress = () => {
  let t: typeof globalThis | Window = target

  if (isInIframe && target.top)
    t = target.top

  let isVitepress = false

  if (
    // after 1.0.0-rc.45
    !!(t as any)?.__vitepress__
    // all versions
    || t?.document?.getElementById('check-dark-mode')?.textContent?.includes('vitepress-theme-appearance')
  )
    isVitepress = true

  return isVitepress
}
