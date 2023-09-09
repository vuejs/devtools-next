export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export const checkIsSafari = () => navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')
