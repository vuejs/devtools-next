import { execaSync } from 'execa'
import electron from 'electron'

const appPath = new URL('../dist/app.cjs', import.meta.url).pathname
// const appPath = path.resolve(__dirname, '../dist/app.js')
const argv = process.argv.slice(2)

const result = execaSync(electron as unknown as string, [appPath], {
  stdio: 'inherit',
})

process.exit(result.exitCode)
