import { spawn } from 'node:child_process'
import path from 'node:path'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Store from 'electron-store'
import { updateElectronApp } from 'update-electron-app'

// Handle Squirrel events on Windows
if (process.platform === 'win32') {
	const squirrelStartup = await import('electron-squirrel-startup')
	if (squirrelStartup) {
		app.quit()
	}
}

if (process.platform !== 'linux') {
	updateElectronApp()
}

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

	mainWindow.setMenuBarVisibility(false)

	const forceSetup = process.argv.includes('--setup') || process.argv.includes('--force-setup')
	const clearDb = process.argv.includes('--clear-db')

	if (clearDb) {
		store.delete('dbPath')
		console.log('Cleared stored database path')
	}

	const dbPath = store.get('dbPath')

	if (dbPath && !forceSetup && !clearDb) {
		startServerAndLoad(dbPath)
	} else {
		startServerAndLoad()
	}

	if (process.env.NODE_ENV === 'development') {
		mainWindow.webContents.openDevTools()
	}
}

function startServerAndLoad(dbPath) {
	console.log('Starting server with DB:', dbPath)

	if (serverProcess) {
		serverProcess.kill()
	}

	const env = {
		...process.env,
		ELECTRON_RUN: 'true',
	}

	if (dbPath) {
		env.DB_PATH = dbPath
	}

	const resendApiKey = store.get('RESEND_API_KEY')
	if (resendApiKey) {
		env.RESEND_API_KEY = resendApiKey
	}

	const isDev = process.env.NODE_ENV === 'development'

	let command
	let args

	if (isDev) {
		command = 'npx'
		args = ['tsx', '--watch', '--watch-path', './src', './src/server.ts']
	} else {
		command = process.execPath
		const serverPath = path.join(process.resourcesPath, 'dist', 'server.js')
		args = [serverPath]
		env.ELECTRON_RUN_AS_NODE = '1'
	}

	console.log('Spawning server:', command, args)

	serverProcess = spawn(command, args, {
		stdio: 'inherit',
		env,
	})

	setTimeout(() => {
		if (dbPath) {
			mainWindow.loadURL('http://localhost:3000')
		} else {
			mainWindow.loadURL('http://localhost:3000/setup')
		}
	}, 1500)
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

ipcMain.handle('get-resend-api-key', () => store.get('RESEND_API_KEY'))
ipcMain.handle('set-resend-api-key', (_event, key) => store.set('RESEND_API_KEY', key))

ipcMain.on('restart-server', () => startServerAndLoad(store.get('dbPath')))

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
