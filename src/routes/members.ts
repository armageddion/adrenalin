import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import type { Member } from '../types'
import { MemberForm, MemberList, VisitList } from '../views/components'
import { renderLoadMoreSentinel, renderMemberRows } from '../views/components/members'
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
		package_id: body.package_id ? Number.parseInt(body.package_id as string, 10) : undefined,
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
		year_of_birth: Number.parseInt(body.year_of_birth as string, 10),
	}
	return member
}

const membersRouter = new Hono()

membersRouter.get('/', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)

	const page = Number.parseInt(c.req.query('page') || '1', 10)
	const limit = Number.parseInt(c.req.query('limit') || '100', 10)
	const search = c.req.query('search') || ''
	const append = c.req.query('append') === '1'

	const members = search ? q.searchMembersPaginated(search, page, limit) : q.getMembersPaginated(page, limit)
	const totalMembers = search ? q.searchMembersCount(search) : q.getMembersCount()

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

membersRouter.get('/new', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const packages = q.getPackages()
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

membersRouter.get('/:id', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const member = q.getMember(id)
	if (member) {
		const visits = q.getVisitsByMemberId(id)
		const packages = q.getPackages()
		const memberPackage = packages.find((p) => p.id === member.package_id)
		const memberContent = html`
			<div class="bg-card p-6 rounded-lg shadow-md">
				<h2 class="text-2xl font-bold mb-4">${member.first_name} ${member.last_name}</h2>
				<div class="flex flex-col md:flex-row gap-6">
					<div class="flex-1 space-y-2">
						<p><strong>${t('labels.cardId')}:</strong> ${member.card_id}</p>
						<p><strong>${t('labels.email')}:</strong> ${member.email || 'N/A'}</p>
						<p><strong>${t('labels.phone')}:</strong> ${member.phone || 'N/A'}</p>
						<p><strong>${t('labels.govId')}:</strong> ${member.gov_id || 'N/A'}</p>
						<p><strong>${t('labels.package')}:</strong> ${memberPackage ? `${memberPackage.name} - ${memberPackage.price} RSD` : 'None'}</p>
						<p><strong>${t('labels.expiryDate')}:</strong> ${member.expires_at || 'N/A'}</p>
						<p><strong>Year of Birth:</strong> ${member.year_of_birth || 'N/A'}</p>
						<p><strong>Address:</strong> ${member.address_street ? `${member.address_street} ${member.address_number}, ${member.address_city}` : 'N/A'}</p>
						<p><strong>Guardian:</strong> ${member.guardian ? `Yes - ${member.guardian_first_name} ${member.guardian_last_name} (Gov ID: ${member.guardian_gov_id})` : 'N/A'}</p>
						<p><strong>Notifications:</strong> ${member.notify ? 'Enabled' : 'Disabled'}</p>
						<p><strong>${t('labels.notes')}:</strong> ${member.notes || 'N/A'}</p>
						<p><strong>${t('labels.lastUpdated')}:</strong> ${new Date(member.updated_at).toLocaleString()}</p>
						<div class="flex flex-wrap gap-2 mt-4">
							<button hx-post="/visits" hx-vals='{"card_id": "${member.card_id}"}' hx-target="#visits-list" hx-swap="outerHTML" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
								${t('buttons.logVisit')}
							</button>
							<a href="/members" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">${t('buttons.backToMembers')}</a>
							<a href="/members/${member.id}/edit" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">${t('buttons.editMember')}</a>
						</div>
					</div>
					${
						member.image
							? html`<div class="md:ml-auto md:flex-shrink-0">
						<img src="${member.image}" alt="Member Image" class="w-48 h-48 object-cover rounded shadow-md">
					</div>`
							: ''
					}
				</div>
			</div>
			${VisitList({ visits, t })}
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

membersRouter.get('/:id/edit', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const member = q.getMember(id)
	const packages = q.getPackages()

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
	q.addMember(member)
	const members = q.getMembers()
	return c.html(MemberList({ members, t }).content as string)
})

membersRouter.post('/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'), 10)
	const body = await c.req.parseBody()
	const updates = parseMemberData(body, true)
	q.updateMember(id, updates)
	c.header('HX-Redirect', '/members')
	return c.text('', 200)
})

membersRouter.delete('/:id', (c) => {
	const t = useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	q.deleteMember(id)
	const members = q.getMembers()
	return c.html(MemberList({ members, t }).content as string)
})

export default membersRouter
