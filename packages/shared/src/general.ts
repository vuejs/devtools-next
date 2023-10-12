export const NOOP = () => { }
export const isNumeric = (str: string | number) => `${+str}` === str
export const isMacOS = () => navigator?.platform ? navigator?.platform.toLowerCase().includes('mac') : /Macintosh/.test(navigator.userAgent)
const classifyRE = /(?:^|[-_/])(\w)/g
const camelizeRE = /-(\w)/g
const kebabizeRE = /([a-z0-9])([A-Z])/g

function toUpper(_: string, c: string) {
  return c ? c.toUpperCase() : ''
}

export const classify = (str: string) => {
  return str && (`${str}`).replace(classifyRE, toUpper)
}

export const camelize = (str: string) => {
  return str && str.replace(camelizeRE, toUpper)
}

export const kebabize = (str: string) => {
  return str && str
    .replace(kebabizeRE, (_, lowerCaseCharacter: string, upperCaseLetter: string) => {
      return `${lowerCaseCharacter}-${upperCaseLetter}`
    })
    .toLowerCase()
}

export function basename(filename: string, ext: string): string {
  const normalizedFilename = filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/')
  const lastSlashIndex = normalizedFilename.lastIndexOf('/')
  const baseNameWithExt = normalizedFilename.substring(lastSlashIndex + 1)

  if (ext) {
    const extIndex = baseNameWithExt.lastIndexOf(ext)
    return baseNameWithExt.substring(0, extIndex)
  }
  return ''
}

export function sortByKey(state: unknown[]) {
  return state && (state.slice() as Record<'key', number>[]).sort((a, b) => {
    if (a.key < b.key)
      return -1
    if (a.key > b.key)
      return 1
    return 0
  })
}
