import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import app from './routes'

app.use('/public/*', serveStatic({ root: './' }))

const port = process.env.NODE_ENV === 'test' ? 3001 : 3000
console.log(`Server running on http://localhost:${port}`)
serve({ fetch: app.fetch, port })
