import type { Context, Next } from 'hono'
import type { AppContext } from '../types'

export const setUserContext = async (c: Context<AppContext>, next: Next) => {
	const cookieHeader = c.req.raw.headers.get('cookie')
	if (cookieHeader?.includes('user=')) {
		const userCookie = cookieHeader.split('user=')[1].split(';')[0]
		try {
			const user = JSON.parse(decodeURIComponent(userCookie))
			c.set('user', user)
		} catch (_e) {
			// Invalid cookie; proceed without user
		}
	}
	await next()
}
