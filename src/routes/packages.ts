import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import type { Package } from '../types'
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

packagesRouter.get('/', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const packages = q.getPackages()
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

packagesRouter.get('/new', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	return c.html(
		PageLayout({
			title: t('components.packageForm.addTitle'),
			content: PackageForm({ package: null, t }),
			locale,
			t,
		}),
	)
})

packagesRouter.get('/:id/edit', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const packages = q.getPackages()
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

packagesRouter.post('/', async (c) => {
	const body = await c.req.parseBody()
	const pkg = parsePackageData(body)
	q.addPackage(pkg)
	c.header('HX-Redirect', '/packages')
	return c.text('', 200)
})

packagesRouter.post('/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'), 10)
	const body = await c.req.parseBody()
	const updates = parsePackageData(body, true)
	q.updatePackage(id, updates)
	c.header('HX-Redirect', '/packages')
	return c.text('', 200)
})

packagesRouter.delete('/:id', (c) => {
	const t = useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	q.deletePackage(id)
	const packages = q.getPackages()
	return c.html(PackageList({ packages, t }))
})

export default packagesRouter
