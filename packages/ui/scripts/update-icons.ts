import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { icons } from '@iconify-json/ic'

const __dirname = dirname(new URL(import.meta.url).pathname)

export const icIcons: Record<string, { body: string }> = Object.keys(icons.icons).filter(i => i.startsWith('baseline')).reduce((a, b) => ({ ...a, [b]: icons.icons[b].body }), {})

function update() {
  writeFileSync(resolve(__dirname, '../src/constants/ic-icons.ts'), `export const icIcons: Record<string, string> = ${JSON.stringify(icIcons, null, 2)}`)
}

update()
