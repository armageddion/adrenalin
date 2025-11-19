import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Hono } from 'hono'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const setupRouter = new Hono()

setupRouter.get('/setup', (c) => {
	return c.html(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Adrenalin - Setup</title>
		</head>
		<body>
			<h1>Select Database File</h1>
			<form action="/setup" method="post" enctype="multipart/form-data">
			<input type="file" name="dbfile" accept=".db,.sqlite,.sqlite3" required>
			<button type="submit">Upload Database File</button>
			</form>
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

	return c.redirect('/')
})

export default setupRouter
