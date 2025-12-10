import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { getUserByUsername, verifyPassword } from '../middleware/auth'
import { customLocaleDetector } from '../middleware/i18n'
import { PageLayout } from '../views/layouts'

const authRouter = new Hono()

authRouter.get('/login', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const content = html`
		<div class="flex items-center justify-center min-h-screen">
			<div class="bg-card p-8 rounded-lg shadow-md max-w-md w-full">
				<h1 class="text-2xl font-bold text-center mb-6">${t('buttons.login')}</h1>
				<form hx-post="/login" hx-swap="innerHTML" hx-target="#error" class="space-y-4">
					<div>
						<label for="username" class="block text-sm font-medium">Username</label>
						<input type="text" id="username" name="username" required class="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
					</div>
					<div>
						<label for="password" class="block text-sm font-medium">Password</label>
						<input type="password" id="password" name="password" required class="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
					</div>
					<button type="submit" class="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-medium py-2 px-4 rounded">${t('buttons.login')}</button>
				</form>
				<div id="error" class="mt-4 text-red-600 text-center"></div>
			</div>
		</div>
	`
	return c.html(PageLayout({ title: t('buttons.login'), content, locale, t, hideNav: true }))
})

authRouter.post('/login', async (c) => {
	const body = await c.req.parseBody()
	const username = body.username as string
	const password = body.password as string

	if (!username || !password) {
		return c.html('<p class="text-red-600">Username and password are required</p>')
	}

	const user = await getUserByUsername(username)
	if (!user || !(await verifyPassword(password, user.password_hash))) {
		return c.html('<p class="text-red-600">Invalid credentials</p>')
	}

	c.header(
		'Set-Cookie',
		`user=${encodeURIComponent(JSON.stringify({ id: user.id, username: user.username, role: user.role }))}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''} SameSite=Strict; Max-Age=604800`,
	)
	c.header('HX-Redirect', '/')
	return c.text('')
})

authRouter.post('/logout', (c) => {
	c.header('Set-Cookie', 'user=; HttpOnly; SameSite=Strict; Max-Age=0')
	return c.redirect('/login')
})

export default authRouter
