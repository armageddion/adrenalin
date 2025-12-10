import { useTranslation } from '@intlify/hono'
import type { Context } from 'hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { hashPassword } from '../middleware/auth'
import { customLocaleDetector } from '../middleware/i18n'
import { createUser, deleteUser, getUsers, updateUser, usernameExists } from '../queries'
import { PageLayout } from '../views/layouts'

const usersRouter = new Hono()

function getUserFromCookie(c: Context) {
	const cookieHeader = c.req.raw.headers.get('cookie')
	if (!cookieHeader) return null
	const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie: string) => {
		const [name, value] = cookie.trim().split('=')
		acc[name] = decodeURIComponent(value)
		return acc
	}, {})
	if (cookies.user) {
		try {
			return JSON.parse(cookies.user)
		} catch {}
	}
	return null
}

usersRouter.use('*', async (c, next) => {
	const user = getUserFromCookie(c)
	if (!user || user.role !== 'admin') {
		return c.text('Forbidden', 403)
	}
	await next()
})

usersRouter.get('/', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const user = getUserFromCookie(c)
	const users = await getUsers()
	const content = html`
		<div class="container mx-auto px-4 py-8">
			<div class="flex justify-between items-center mb-6">
				<h1 class="text-3xl font-bold">Users</h1>
				<a href="/users/new" class="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded">Add User</a>
			</div>
			<div class="bg-card rounded-lg shadow overflow-hidden">
				<table class="min-w-full divide-y divide-border">
					<thead class="bg-muted">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-card divide-y divide-border">
						${users.map(
							(user) => html`
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${user.username}</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm">${user.role}</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm">${new Date(user.created_at).toLocaleDateString()}</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<a href="/users/${user.id}/edit" class="text-primary hover:text-primary/80 mr-4">Edit</a>
									${user.username !== 'admin' ? html`<button hx-delete="/users/${user.id}" hx-confirm="Are you sure?" class="text-red-600 hover:text-red-800">Delete</button>` : ''}
								</td>
							</tr>
						`,
						)}
					</tbody>
				</table>
			</div>
		</div>
	`
	return c.html(PageLayout({ title: 'Users', content, locale, t, user }))
})

usersRouter.get('/new', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const user = getUserFromCookie(c)
	const query = c.req.query()
	const username = query.username || ''
	const password = query.password || ''
	const role = query.role || 'user'
	const content = html`
		<div class="container mx-auto px-4 py-8">
			<h1 class="text-3xl font-bold mb-6">Add User</h1>
			<form hx-post="/users" class="bg-card p-6 rounded-lg shadow">
				<div class="mb-4">
					<label for="username" class="block text-sm font-medium mb-2">Username</label>
					<input type="text" id="username" name="username" value="${username}" required class="w-full px-3 py-2 border border-input rounded-md">
				</div>
				<div class="mb-4">
					<label for="password" class="block text-sm font-medium mb-2">Password</label>
					<input type="password" id="password" name="password" value="${password}" required class="w-full px-3 py-2 border border-input rounded-md">
				</div>
				<div class="mb-4">
					<label for="role" class="block text-sm font-medium mb-2">Role</label>
					<select id="role" name="role" class="w-full px-3 py-2 border border-input rounded-md">
						<option value="user" ${role === 'user' ? 'selected' : ''}>User</option>
						<option value="admin" ${role === 'admin' ? 'selected' : ''}>Admin</option>
					</select>
				</div>
				<div class="flex justify-end space-x-4">
					<a href="/users" class="px-4 py-2 border border-border rounded-md">Cancel</a>
					<button type="submit" class="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded">Create</button>
				</div>
			</form>
		</div>
	`
	return c.html(PageLayout({ title: 'Add User', content, locale, t, user }))
})

usersRouter.post('/', async (c) => {
	const body = await c.req.parseBody()
	const username = body.username as string
	const password = body.password as string
	const role = body.role as string

	if (!username || !password) {
		return c.text('Username and password required', 400)
	}

	if (await usernameExists(username)) {
		return c.text('Username already exists', 400)
	}

	const passwordHash = await hashPassword(password)
	await createUser({ username, password_hash: passwordHash, role: role || 'user' })

	c.header('HX-Redirect', '/users')
	return c.text('', 200)
})

usersRouter.get('/:id/edit', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const currentUser = getUserFromCookie(c)
	const id = parseInt(c.req.param('id'), 10)
	const users = await getUsers()
	const user = users.find((u) => u.id === id)
	if (!user) return c.text('User not found', 404)

	const content = html`
		<div class="container mx-auto px-4 py-8">
			<h1 class="text-3xl font-bold mb-6">Edit User</h1>
			<form hx-put="/users/${id}" class="bg-card p-6 rounded-lg shadow">
				<div class="mb-4">
					<label for="username" class="block text-sm font-medium mb-2">Username</label>
					<input type="text" id="username" name="username" value="${user.username}" required class="w-full px-3 py-2 border border-input rounded-md">
				</div>
				<div class="mb-4">
					<label for="role" class="block text-sm font-medium mb-2">Role</label>
					<select id="role" name="role" class="w-full px-3 py-2 border border-input rounded-md">
						<option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
						<option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
					</select>
				</div>
				<div class="mb-4">
					<label for="password" class="block text-sm font-medium mb-2">New Password (leave empty to keep current)</label>
					<input type="password" id="password" name="password" class="w-full px-3 py-2 border border-input rounded-md">
				</div>
				<div class="flex justify-end space-x-4">
					<a href="/users" class="px-4 py-2 border border-border rounded-md">Cancel</a>
					<button type="submit" class="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded">Update</button>
				</div>
			</form>
		</div>
	`
	return c.html(PageLayout({ title: 'Edit User', content, locale, t, user: currentUser }))
})

usersRouter.put('/:id', async (c) => {
	const id = parseInt(c.req.param('id'), 10)
	const body = await c.req.parseBody()
	const username = body.username as string
	const role = body.role as string
	const password = body.password as string

	const updateData: Record<string, string> = { username, role }
	if (password) {
		updateData.password_hash = await hashPassword(password)
	}

	await updateUser(id, updateData)
	c.header('HX-Redirect', '/users')
	return c.text('', 200)
})

usersRouter.delete('/:id', async (c) => {
	const id = parseInt(c.req.param('id'), 10)
	await deleteUser(id)
	return c.text('User deleted', 200)
})

export default usersRouter
