import { useTranslation } from '@intlify/hono'
import { type Context, Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import type { AppContext, Package } from '../types'
import { PackageForm, PackageList } from '../views/components'
import { PageLayout } from '../views/layouts'
import { notFoundResponse } from './utils'

export function parsePackageData(body: Record<string, unknown>, _isUpdate = false): Omit<Package, 'id' | 'created_at'> {
	const pkg = {
		name: body.name as string,
		price: body.price ? Number.parseFloat(body.price as string) : undefined,
		description: (body.description as string) || undefined,
		display_order: body.display_order ? Number.parseInt(body.display_order as string, 10) : undefined,
	}
	return pkg
}

const packagesRouter = new Hono()

packagesRouter.get('/', async (c) => {
	const t = await useTranslation(c)
	const locale = customLocaleDetector(c)
	const packages = await q.getPackages()
	const content = html`
		<div id="package-form">
			${PackageForm({ t })}
		</div>
		${PackageList({ packages, t })}
	`
	if (c.req.header('HX-Request')) return c.html(content)
	return c.html(
		PageLayout({
			title: t('components.packageList.title'),
			content,
			locale,
			t,
		}),
	)
})

packagesRouter.get('/new', async (c) => {
	const t = await useTranslation(c)
	const locale = customLocaleDetector(c)
	return c.html(
		PageLayout({
			title: t('components.packageForm.addTitle'),
			content: PackageForm({ package: undefined, t }),
			locale,
			t,
		}),
	)
})

packagesRouter.get('/:id/edit', async (c) => {
	const t = await useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const packages = await q.getPackages()
	const pkg = packages.find((p) => p.id === id)
	if (pkg) {
		const content = PackageForm({ package: pkg, t })
		if (c.req.header('HX-Request')) {
			return c.html(content)
		}
		return c.html(
			PageLayout({
				title: t('components.packageForm.editTitle'),
				content,
				locale,
				t,
			}),
		)
	}
	return notFoundResponse(c, t, 'package')
})

packagesRouter.post('/', async (c: Context<AppContext>) => {
	const body = await c.req.parseBody()
	const pkg = parsePackageData(body)
	const newId = await q.addPackage(pkg)
	const user = c.get('user')
	if (user) {
		await q.logUserAction(
			user.id,
			'create_package',
			'package',
			newId,
			undefined,
			c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown',
			c.req.header('User-Agent') || 'unknown',
		)
	}
	c.header('HX-Redirect', '/packages')
	return c.text('', 200)
})

packagesRouter.post('/:id', async (c: Context<AppContext>) => {
	const id = Number.parseInt(c.req.param('id'), 10)
	const body = await c.req.parseBody()
	const updates = parsePackageData(body, true)
	const oldPackage = await q.getPackage(id)
	await q.updatePackage(id, updates)
	const newPackage = await q.getPackage(id)
	const user = c.get('user')
	if (user) {
		await q.logUserAction(
			user.id,
			'update_package',
			'package',
			id,
			{ before: oldPackage, after: newPackage },
			c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown',
			c.req.header('User-Agent') || 'unknown',
		)
	}
	c.header('HX-Redirect', '/packages')
	return c.text('', 200)
})

packagesRouter.delete('/:id', async (c: Context<AppContext>) => {
	const t = await useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const user = c.get('user')
	if (user) {
		await q.logUserAction(
			user.id,
			'delete_package',
			'package',
			id,
			undefined,
			c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown',
			c.req.header('User-Agent') || 'unknown',
		)
	}
	await q.deletePackage(id)
	const packages = await q.getPackages()
	return c.html(PackageList({ packages, t }))
})

export default packagesRouter
