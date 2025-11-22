import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import app from './routes'
import { initDb } from './queries'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use('/public/*', serveStatic({ root: path.resolve(__dirname, '../') }))

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
	const port = process.env.NODE_ENV === 'test' ? 3001 : 3000
	console.log(`Server running on http://localhost:${port}`)
	serve({ fetch: app.fetch, port })
}

main()
