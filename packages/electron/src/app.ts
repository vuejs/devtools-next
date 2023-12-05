import path from 'node:path'
import { URL } from 'node:url'
import { BrowserWindow, app } from 'electron'

let mainWindow: BrowserWindow | null = null
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../icons/128.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  })
  const appEntryPath = path.join(__dirname, '../app.html')
  const url = new URL(`file://${appEntryPath}`).toString()
  mainWindow.loadURL(new URL(url).toString())

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('activate', () => {
  if (mainWindow === null)
    createWindow()
})
