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
