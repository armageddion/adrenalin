import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import squirrelStartup from 'electron-squirrel-startup'
import Store from 'electron-store'
import { updateElectronApp } from 'update-electron-app'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (squirrelStartup) {
	app.quit()
}

updateElectronApp()

const store = new Store()

let serverProcess
let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	const dbPath = store.get('dbPath')

	if (dbPath) {
		startServerAndLoad(dbPath)
	} else {
		mainWindow.loadFile(path.join(__dirname, 'public', 'setup.html'))
	}

	// Open DevTools in development
	if (process.env.NODE_ENV === 'development') {
		mainWindow.webContents.openDevTools()
	}
}

function startServerAndLoad(dbPath) {
	console.log('Starting server with DB:', dbPath)

	if (serverProcess) {
		serverProcess.kill()
	}

	// Start the Hono server as a child process
	serverProcess = spawn('npx', ['tsx', 'src/server.ts'], {
		stdio: 'inherit',
		env: {
			...process.env,
			ELECTRON_RUN: 'true',
			DB_PATH: dbPath,
		},
	})

	// Wait a bit for server to start
	setTimeout(() => {
		mainWindow.loadURL('http://localhost:3000')
	}, 3000)
}

ipcMain.on('db-select', async () => {
	const result = await dialog.showOpenDialog(mainWindow, {
		properties: ['openFile'],
		filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }],
	})

	if (!result.canceled && result.filePaths.length > 0) {
		const selectedPath = result.filePaths[0]
		store.set('dbPath', selectedPath)
		startServerAndLoad(selectedPath)
	}
})

ipcMain.on('db-create', async () => {
	const result = await dialog.showSaveDialog(mainWindow, {
		title: 'Create New Database',
		defaultPath: 'adrenalin.db',
		filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }],
	})

	if (!result.canceled && result.filePath) {
		store.set('dbPath', result.filePath)
		startServerAndLoad(result.filePath)
	}
})

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('before-quit', () => {
	if (serverProcess) {
		serverProcess.kill()
	}
})
