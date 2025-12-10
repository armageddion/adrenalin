import bcrypt from 'bcrypt'
import type { MiddlewareHandler } from 'hono'
import { db } from '../queries'
import type { User } from '../types'

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash)
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
	const rs = await db.execute({
		sql: 'SELECT * FROM users WHERE username = ?',
		args: [username],
	})
	return rs.rows[0] as unknown as User | undefined
}

export async function getUserById(id: number): Promise<User | undefined> {
	const rs = await db.execute({
		sql: 'SELECT * FROM users WHERE id = ?',
		args: [id],
	})
	return rs.rows[0] as unknown as User | undefined
}

export function requireAuth(): MiddlewareHandler {
	return async (c, next) => {
		const user = c.get('user')
		if (!user) {
			return c.redirect('/login')
		}
		await next()
	}
}

export function requireAdmin(): MiddlewareHandler {
	return async (c, next) => {
		const user = c.get('user')
		if (!user || user.role !== 'admin') {
			return c.text('Forbidden', 403)
		}
		await next()
	}
}
