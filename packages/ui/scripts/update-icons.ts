import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { icons } from '@iconify-json/ic'
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css'
import { searchForIcon } from '@iconify/utils/lib/loader/modern'
import pLimit from 'p-limit'
import { devDependencies } from '../package.json'

const limit = pLimit(10)

const VERSION_COMMENT_RE = /\/\/ Generated from @iconify-json\/ic@(.*)\n/

const __dirname = dirname(new URL(import.meta.url).pathname)

const targetPath = resolve(__dirname, '../src/constants/ic-icons.ts')

const targetIcVersion = existsSync(targetPath)
  ? VERSION_COMMENT_RE.exec(readFileSync(targetPath, 'utf-8'))?.[1] ?? null
  : null

const icVersion = devDependencies['@iconify-json/ic'].slice(1) /* remove ^ prefix */

if (targetIcVersion === icVersion) {
  console.log('No need to update ic icons')
  // process.exit(0)
}

const withIcVersionComment = (s: string) => `// Generated from @iconify-json/ic@${icVersion}\n\n${s}`

async function getIconSvg(icon: string) {
  const svg = await searchForIcon(icons, 'ic', [icon])
  return svg ?? ''
}

async function generateIcIcons() {
  const iconsMap = new Map<string, string>()
  const tasks = Object.keys(icons.icons).filter(i => i.startsWith('baseline')).map(i => limit(() => getIconSvg(i).then(svg => iconsMap.set(i, svg))))
  await Promise.all(tasks)

  const iconCollection: Record<string, string> = {}
  for (const [iconName, iconSvg] of iconsMap.entries()) {
    iconCollection[iconName] = encodeSvgForCss(iconSvg)
  }

  return iconCollection
}

function writeIconFile(icons: Record<string, any>) {
  writeFileSync(targetPath, withIcVersionComment(`export const icIcons: Record<string, string> = ${JSON.stringify(icons, null, 2)}`))
  console.log('ic icons updated')
}

async function run() {
  const icIcons = await generateIcIcons()
  writeIconFile(icIcons)
}

run().then(() => process.exit(0)).catch((e) => {
  console.error(e)
  process.exit(1)
})
