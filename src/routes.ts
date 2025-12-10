import { Hono } from 'hono'
import { i18nMiddleware } from './middleware/i18n'
import { setUserContext } from './middleware/userContext'
import authRouter from './routes/auth'
import cronRouter from './routes/cron'
import dashboardRouter from './routes/dashboard'
import membersRouter from './routes/members'
import packagesRouter from './routes/packages'
import registerRouter from './routes/register'
import searchRouter from './routes/search'
import settingsRouter from './routes/settings'
import setupRouter from './routes/setup'
import usersRouter from './routes/users'
import visitsRouter from './routes/visits'
import type { AppContext } from './types'

const app = new Hono<AppContext>()
app.use('*', i18nMiddleware)
app.use('*', setUserContext)
if (process.env.NODE_ENV !== 'test') {
	app.use('*', async (c, next) => {
		if (
			c.req.path === '/login' ||
			c.req.path === '/setup' ||
			c.req.path === '/manifest.json' ||
			c.req.path.startsWith('/public/') ||
			c.req.method !== 'GET'
		) {
			return next()
		}
		const cookieHeader = c.req.raw.headers.get('cookie')
		if (!cookieHeader || !cookieHeader.includes('user=')) {
			return c.redirect('/login')
		}
		await next()
	})
}

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
app.route('', authRouter)
app.route('', dashboardRouter)
app.route('', searchRouter)
app.route('', settingsRouter)
app.route('', registerRouter)
app.route('', setupRouter)
app.route('', cronRouter)
app.route('/users', usersRouter)
app.route('/members', membersRouter)
app.route('/packages', packagesRouter)
app.route('/visits', visitsRouter)

export default app
