import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { hashPassword, getUserByUsername } from '../middleware/auth'
import { db } from '../queries'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const setupRouter = new Hono()

setupRouter.get('/setup', (c) => {
	return c.html(html`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Adrenalin - Setup</title>
			<link rel="stylesheet" href="/public/styles.css">
			<link rel="icon" href="/public/favicon.ico">
		</head>
		<body class="bg-background flex items-center justify-center min-h-screen">
			<div class="bg-card p-8 rounded-lg shadow-md max-w-md w-full">
				<h1 class="text-2xl font-bold text-center mb-6">Adrenalin CRM Setup</h1>
				<p class="text-gray-600 mb-6 text-center">Select or create a database to get started.</p>
				<div class="space-y-4">
					<button id="select-db" class="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-medium py-2 px-4 rounded">
						Select Database File
					</button>
					<button id="create-db" class="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded">
						Create New Database
					</button>
				</div>
			</div>
			<script>
				const { ipcRenderer } = require('electron')

				document.getElementById('select-db').addEventListener('click', () => {
					ipcRenderer.send('db-select')
				})

				document.getElementById('create-db').addEventListener('click', () => {
					ipcRenderer.send('db-create')
				})
			</script>
		</body>
		</html>
	`)
})

setupRouter.post('/setup', async (c) => {
	const body = await c.req.parseBody()
	const file = body.dbfile as File
	if (!file || !(file instanceof File)) return c.text('No file uploaded')

	const dbPath = path.resolve(__dirname, '../../db/adrenalin.db')
	const buffer = await file.arrayBuffer()
	fs.writeFileSync(dbPath, Buffer.from(buffer))

	const configPath = path.resolve(__dirname, '../../config.json')
	fs.writeFileSync(configPath, JSON.stringify({ dbPath }))

	// Create admin user if not exists
	try {
		const existingAdmin = await getUserByUsername('admin')
		if (!existingAdmin) {
			const passwordHash = await hashPassword('admin')
			await db.execute({
				sql: 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
				args: ['admin', passwordHash, 'admin'],
			})
		}
	} catch (error) {
		// Ignore if table doesn't exist yet or other errors
	}

	return c.redirect('/')
})

export default setupRouter
