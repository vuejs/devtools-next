import { execaSync } from 'execa'
import electron from 'electron'

const appPath = new URL('./app.cjs', import.meta.url).pathname
const argv = process.argv.slice(2)

const result = execaSync(electron as unknown as string, [appPath].concat(argv), {
  stdio: 'inherit',
})

process.exit(result.exitCode)
