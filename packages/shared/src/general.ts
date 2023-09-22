export const NOOP = () => { }
export const isNumeric = (str: string | number) => `${+str}` === str
export const isMacOS = () => navigator?.platform ? navigator?.platform.toLowerCase().includes('mac') : /Macintosh/.test(navigator.userAgent)
