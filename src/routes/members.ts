import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import type { Member } from '../types'
import { MemberForm, MemberList, VisitList } from '../views/components'
import { MemberCard, renderLoadMoreSentinel, renderMemberRows } from '../views/components/members'
import { PageLayout } from '../views/layouts'
import { notFoundResponse } from './utils'

export function parseMemberData(
	body: Record<string, unknown>,
	_isUpdate = false,
): Omit<Member, 'id' | 'created_at' | 'updated_at'> {
	const member = {
		first_name: body.first_name as string,
		last_name: body.last_name as string,
		email: (body.email as string) || undefined,
		phone: (body.phone as string) || undefined,
		card_id: body.card_id as string,
		gov_id: (body.gov_id as string) || undefined,
		package_id: body.package_id
			? (() => {
					const p = Number.parseInt(body.package_id as string, 10)
					return Number.isNaN(p) ? undefined : p
				})()
			: undefined,
		expires_at: (body.expires_at as string) || undefined,
		image: (body.image as string) || undefined,
		notes: (body.notes as string) || undefined,
		address_street: (body.address_street as string) || undefined,
		address_number: (body.address_number as string) || undefined,
		address_city: (body.address_city as string) || undefined,
		guardian: body.guardian === 'on' ? 1 : 0,
		guardian_first_name: (body.guardian_first_name as string) || undefined,
		guardian_last_name: (body.guardian_last_name as string) || undefined,
		guardian_gov_id: (body.guardian_gov_id as string) || undefined,
		notify: body.notify !== 'off' ? 1 : 0,
		year_of_birth: (() => {
			const y = Number.parseInt(body.year_of_birth as string, 10)
			return Number.isNaN(y) ? undefined : y
		})(),
	}
	return member
}

const membersRouter = new Hono()

membersRouter.get('/', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)

	const page = Number.parseInt(c.req.query('page') || '1', 10)
	const limit = Number.parseInt(c.req.query('limit') || '100', 10)
	const search = c.req.query('search') || ''
	const append = c.req.query('append') === '1'

	const members = search
		? await q.searchMembersPaginated(search, page, limit)
		: await q.getMembersPaginated(page, limit)
	const totalMembers = search ? await q.searchMembersCount(search) : await q.getMembersCount()

	const pagination = {
		currentPage: page,
		totalPages: Math.ceil(totalMembers / limit),
		limit,
		totalItems: totalMembers,
		hasNext: page < Math.ceil(totalMembers / limit),
		hasPrev: page > 1,
	}

	// If append mode, return only the table rows and next sentinel
	if (append) {
		return c.html(
			html`${renderMemberRows(members, t)}${pagination.hasNext ? renderLoadMoreSentinel(pagination, search) : ''}`,
		)
	}

	const { content: _content, script } = MemberList({ members, t, pagination, search })

	const searchInput = html`
		<div class="p-6">
			<input
				type="text"
				placeholder="${t('components.members.searchPlaceholder')}"
				class="w-full p-2 border rounded"
				hx-get="?page=1&limit=${pagination.limit}"
				hx-target="#member-list-wrapper"
				hx-swap="outerHTML"
				hx-trigger="input changed delay:300ms"
				name="search"
				value="${search || ''}"
			/>
		</div>
	`

	const content = html`
		<div id="member-form"></div>
		${c.req.header('HX-Request') ? '' : searchInput}
		<div id="member-list-wrapper">
			${_content}
		</div>
	`

	if (c.req.header('HX-Request')) {
		return c.html(content)
	}
	return c.html(
		PageLayout({
			title: t('components.members.title'),
			content,
			script,
			locale,
			t,
		}),
	)
})

membersRouter.get('/new', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const packages = await q.getPackages()
	const { content, script } = MemberForm({ packages, member: null, t })
	return c.html(
		PageLayout({
			title: t('components.memberForm.addTitle'),
			content,
			script,
			locale,
			t,
		}),
	)
})

membersRouter.get('/:id', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const member = await q.getMember(id)
	if (member) {
		const visits = await q.getVisitsByMemberId(id)
		const packages = await q.getPackages()
		const memberPackage = packages.find((p) => p.id === member.package_id)
		const memberContent = html`
			<div class="flex max-w-6xl mx-auto my-6">
				${MemberCard({ member, memberPackage, t })}
				${VisitList({ visits, t })}
			</div>
		`
		if (c.req.header('HX-Request')) {
			return c.html(memberContent)
		}
		return c.html(
			PageLayout({
				title: `${member.first_name} ${member.last_name}`,
				content: memberContent,
				locale,
				t,
			}),
		)
	}
	return notFoundResponse(c, t, 'member')
})

membersRouter.get('/:id/edit', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const member = await q.getMember(id)
	const packages = await q.getPackages()

	if (member) {
		const { content: _content, script } = MemberForm({ packages, member, t })

		const content = html`
			<div id="member-form">
				${_content}
			</div>
		`
		if (c.req.header('HX-Request')) {
			return c.html(content)
		}

		return c.html(
			PageLayout({
				title: t('components.memberForm.editTitle'),
				content,
				script,
				locale,
				t,
			}),
		)
	}
	return notFoundResponse(c, t, 'member')
})

membersRouter.post('/', async (c) => {
	const t = useTranslation(c)
	const body = await c.req.parseBody()
	const member = parseMemberData(body)
	await q.addMember(member)
	const members = await q.getMembers()
	return c.html(MemberList({ members, t }).content as string)
})

membersRouter.post('/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'), 10)
	const body = await c.req.parseBody()
	const updates = parseMemberData(body, true)
	await q.updateMember(id, updates)
	c.header('HX-Redirect', '/members')
	return c.text('', 200)
})

membersRouter.delete('/:id', async (c) => {
	const t = useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	await q.deleteMember(id)
	const members = await q.getMembers()
	return c.html(MemberList({ members, t }).content as string)
})

export default membersRouter
