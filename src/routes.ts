import { Hono } from 'hono'
import { i18nMiddleware } from './middleware/i18n'
import cronRouter from './routes/cron'
import dashboardRouter from './routes/dashboard'
import membersRouter from './routes/members'
import packagesRouter from './routes/packages'
import registerRouter from './routes/register'
import searchRouter from './routes/search'
import settingsRouter from './routes/settings'
import setupRouter from './routes/setup'
import visitsRouter from './routes/visits'

const app = new Hono()
app.use('*', i18nMiddleware)

app.get('/manifest.json', (c) => {
	return c.json({
		name: 'Adrenalin',
		short_name: 'Adrenalin',
		description: 'Adrenalin App',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/public/logo.svg',
				sizes: 'any',
				type: 'image/svg+xml',
			},
		],
	})
})

// Mount all routers
app.route('', dashboardRouter)
app.route('', searchRouter)
app.route('', settingsRouter)
app.route('', registerRouter)
app.route('', setupRouter)
app.route('', cronRouter)
app.route('/members', membersRouter)
app.route('/packages', packagesRouter)
app.route('/visits', visitsRouter)

export default app
