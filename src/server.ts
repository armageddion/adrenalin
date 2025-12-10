import fs from 'node:fs'
import { createSecureServer } from 'node:http2'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { initDb } from './queries'
import app from './routes'
import { getLocalIP } from './utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use('/public/*', serveStatic({ root: './' }))

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
