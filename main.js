import { spawn } from 'node:child_process'
import { app, BrowserWindow } from 'electron'

let serverProcess

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	})

	// Wait a bit for server to start
	setTimeout(() => {
		win.loadURL('http://localhost:3000')
	}, 2000)

	// Open DevTools in development
	if (process.env.NODE_ENV === 'development') {
		win.webContents.openDevTools()
	}
}

app.whenReady().then(() => {
	// Start the Hono server as a child process
	serverProcess = spawn('pnpm', ['run', 'start'], {
		stdio: 'inherit',
		env: { ...process.env, ELECTRON_RUN: 'true' },
		shell: true,
	})

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
