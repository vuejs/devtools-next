export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export const checkIsSafari = () => navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')

export function pixelToNumber(value: string | number) {
  if (typeof value === 'string')
    return value.endsWith('px') ? +value.slice(0, -2) : +value
  return value
}
