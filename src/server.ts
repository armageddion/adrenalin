import fs from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createSecureServer } from 'node:http2'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'

import { initDb } from './queries'
import app from './routes'
import { getLocalIP } from './utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.get('/public/*', async (c) => {
	const path = c.req.path
	const filePath = path.replace('/public/', './public/')
	try {
		const data = await readFile(filePath)
		const ext = path.split('.').pop()
		const mime = ext === 'css' ? 'text/css' : ext === 'js' ? 'application/javascript' : 'text/plain'
		return c.body(data, 200, { 'Content-Type': mime })
	} catch {
		return c.text('Not found', 404)
	}
})

app.use('*', async (c, next) => {
	if (c.req.path === '/setup' || c.req.method !== 'GET') return next()
	if (!process.env.ELECTRON_RUN && !process.env.DB_PATH) {
		const configPath = path.resolve(__dirname, '../config.json')
		if (!fs.existsSync(configPath)) {
			return c.redirect('/setup')
		}
	}
	await next()
})

async function main() {
	console.log('cwd:', process.cwd())
	await initDb()
	const hostname = '0.0.0.0'
	const ip = getLocalIP()

	// Check if certificates exist for HTTPS
	const certPath = path.resolve(__dirname, '../adrenalin.pem')
	const keyPath = path.resolve(__dirname, '../adrenalin.key')
	const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath)

	if (process.env.NODE_ENV === 'test') {
		const port = 3001
		if (hasCerts) {
			console.log(`Server running on https://${ip}:${port}`)
			serve({
				fetch: app.fetch,
				createServer: createSecureServer,
				serverOptions: {
					key: fs.readFileSync(keyPath),
					cert: fs.readFileSync(certPath),
				},
				port,
				hostname,
			})
		} else {
			console.log(`Server running on http://${ip}:${port}`)
			serve({ fetch: app.fetch, port, hostname })
		}
	} else {
		const httpPort = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 3000
		const httpsPort = process.env.HTTPS_PORT ? parseInt(process.env.HTTPS_PORT, 10) : 3443
		if (hasCerts) {
			// HTTPS server
			console.log(`HTTPS server running on https://${ip}:${httpsPort}`)
			serve({
				fetch: app.fetch,
				createServer: createSecureServer,
				serverOptions: {
					key: fs.readFileSync(keyPath),
					cert: fs.readFileSync(certPath),
				},
				port: httpsPort,
				hostname,
			})
			// HTTP redirect server
			console.log(`HTTP server running on http://${ip}:${httpPort}`)
			serve({ fetch: app.fetch, port: httpPort, hostname })
		} else {
			console.log(`Server running on http://${ip}:${httpPort}`)
			serve({ fetch: app.fetch, port: httpPort, hostname })
		}
	}
}

main()
