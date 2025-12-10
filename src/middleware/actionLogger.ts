import type { Context, Next } from 'hono'
import { db } from '../queries'
import type { AppContext } from '../types'

export const logAction = (
	action: string,
	resource?: string,
	resourceId?: number,
	details?: Record<string, unknown>,
) => {
	return async (c: Context<AppContext>, next: Next) => {
		await next()
		const user = c.get('user')
		if (user) {
			await db.execute({
				sql: 'INSERT INTO user_actions (user_id, action, resource, resource_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
				args: [
					user.id,
					action,
					resource,
					resourceId,
					details ? JSON.stringify(details) : null,
					c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown',
					c.req.header('User-Agent') || 'unknown',
				],
			})
		}
	}
}
