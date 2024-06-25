import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { icons } from '@iconify-json/ic'
import { devDependencies } from '../package.json'

const VERSION_COMMENT_RE = /\/\/ Generated from @iconify-json\/ic@(.*)\n/

const __dirname = dirname(new URL(import.meta.url).pathname)

const targetPath = resolve(__dirname, '../src/constants/ic-icons.ts')

const targetIcVersion = existsSync(targetPath)
  ? VERSION_COMMENT_RE.exec(readFileSync(targetPath, 'utf-8'))?.[1] ?? null
  : null

const icVersion = devDependencies['@iconify-json/ic'].slice(1) /* remove ^ prefix */

if (targetIcVersion === icVersion) {
  console.log('No need to update ic icons')
  process.exit(0)
}

const withIcVersionComment = (s: string) => `// Generated from @iconify-json/ic@${icVersion}\n\n${s}`

function generateIcIcons() {
  const icIcons: Record<string, { body: string }> = Object.keys(icons.icons).filter(i => i.startsWith('baseline')).reduce((a, b) => ({ ...a, [b]: icons.icons[b].body }), {})
  writeFileSync(resolve(__dirname, '../src/constants/ic-icons.ts'), withIcVersionComment(`export const icIcons: Record<string, string> = ${JSON.stringify(icIcons, null, 2)}`))
  console.log('ic icons updated')
}

generateIcIcons()
