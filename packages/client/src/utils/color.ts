import { colord } from 'colord'

export function toHex(color: number) {
  return color.toString(16).padStart(6, '0')
}

export function dimColor(color: number, isDark: boolean, amount = 20) {
  let c = colord(toHex(color))
  if (isDark)
    c = c.darken(amount)

  else
    c = c.lighten(amount)

  return Number.parseInt(`0x${c.toHex().slice(1)}`)
}

export function boostColor(color: number, isDark: boolean, amount = 10) {
  let c = colord(toHex(color))
  if (isDark)
    c = c.lighten(amount)

  else
    c = c.darken(amount)

  return Number.parseInt(`0x${c.toHex().slice(1)}`)
}
