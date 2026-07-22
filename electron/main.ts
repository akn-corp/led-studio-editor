import { app, BrowserWindow, net, protocol } from 'electron'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { setupPreviewIpc, teardownPreviewIpc } from './preview-ipc.js'

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

// Renderer runs on http://localhost in dev (and effectively a distinct
// origin even when packaged), so `fetch`/`<audio src>` against raw
// `file://<path>` URLs are blocked by Chromium as cross-origin. Route local
// media (e.g. the attached audio reference track) through a privileged
// custom scheme instead — must be registered before `app.whenReady()`.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-file',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      corsEnabled: true,
    },
  },
])

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#0a0a0b',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(import.meta.dirname, '../dist/index.html'))
  }

  win.on('closed', () => {
    win = null
  })
}

app.on('window-all-closed', () => {
  teardownPreviewIpc()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  protocol.handle('local-file', (request) => {
    const filePath = decodeURIComponent(new URL(request.url).pathname)
    return net.fetch(pathToFileURL(filePath).href, { headers: request.headers })
  })
  setupPreviewIpc()
  createWindow()
})
