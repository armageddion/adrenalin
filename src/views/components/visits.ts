import { html } from 'hono/html'
import type { TFn } from '../../middleware/i18n'
import type { Member, Visit } from '../../types'

interface Pagination {
	currentPage: number
	totalPages: number
	limit: number
	totalItems: number
	hasNext: boolean
	hasPrev: boolean
}

function _renderPagination(pagination: Pagination, paramPrefix: string = '') {
	const { hasNext } = pagination

	if (!hasNext) return ''

	return html`
		<div class="flex items-center justify-between mt-4">
			<div class="text-sm text-muted-foreground">
				Showing ${pagination.totalItems} visits
			</div>
			<div class="flex items-center space-x-2">
				<button hx-get="?${paramPrefix}page=${pagination.currentPage + 1}&${paramPrefix}limit=${pagination.limit}&append=1"
				   hx-target="#visits-table-body"
				   hx-swap="beforeend"
				   class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/80">
					Load More
				</button>
			</div>
		</div>
	`
}

export function renderVisitRows(visits: Array<Visit & Pick<Member, 'first_name' | 'last_name'>>, t: TFn) {
	return visits.map(
		(visit) => html`
			<tr class="hover:bg-muted">
				<td class="py-2 px-4">
					${visit.first_name} ${visit.last_name}
				</td>
				<td class="py-2 px-4">${new Date(visit.created_at).toLocaleString()}</td>
				<!-- <td class="py-2 px-4">${visit.notes || 'N/A'}</td> -->
				<td class="py-2 px-4 text-right">
					<button
						hx-delete="/visits/${visit.id}"
						hx-confirm="${t('messages.confirmDelete')}"
						hx-target="closest tr"
						hx-swap="delete"
						class="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"
					>
						${t('buttons.delete')}
					</button>
				</td>
			</tr>
		`,
	)
}

export function renderLoadMoreSentinel(pagination: Pagination, paramPrefix: string = '') {
	return html`
		<div
			hx-get="?${paramPrefix}page=${pagination.currentPage + 1}&${paramPrefix}limit=${pagination.limit}&append=1"
			hx-trigger="revealed"
			hx-target="#visits-table-body"
			hx-swap="beforeend"
			style="visibility: hidden;"
		></div>
	`
}

export function VisitsSection({
	visits,
	t,
	pagination,
	search,
	paramPrefix = '',
}: {
	visits: Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
	t: TFn
	pagination: Pagination
	search?: string
	paramPrefix?: string
}) {
	const searchInput = html`
		<div class="mb-6">
			<input
				type="text"
				placeholder="${t('components.visits.searchPlaceholder')}"
				class="w-full p-2 border rounded"
				hx-get="?${paramPrefix}page=1&${paramPrefix}limit=${pagination.limit}"
				hx-target="#visits-list"
				hx-swap="outerHTML"
				hx-trigger="input changed delay:300ms"
				name="${paramPrefix}search"
				value="${search || ''}"
			/>
		</div>
	`

	const { content: listContent } = VisitList({ visits, t, pagination, paramPrefix })

	return html`
		<div id="visits-section" class="flex-1">
			${searchInput}
			${listContent}
		</div>
	`
}

export function VisitList({
	visits,
	t,
	pagination,
	paramPrefix = '',
	member,
}: {
	visits: Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
	t: TFn
	pagination?: Pagination
	paramPrefix?: string
	member?: Member
}) {
	const visitRows = renderVisitRows(visits, t)

	const content = html`
		<div id="visits-list" class="bg-card py-6 rounded-lg shadow-md w-full">
			<div class="h-10 px-6 flex justify-between items-center mb-4">
				<h2 class="text-2xl font-bold">${t('components.visits.title')}</h2>
				${
					member
						? html`<button hx-post="/visits" hx-vals='{"card_id": "${member.card_id}"}' hx-target="#visits-list" hx-swap="outerHTML" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
							${t('buttons.logVisit')}
						</button>`
						: html`<button @click="$store.visitPopup.showVisitPopup = true" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
							${t('buttons.logVisit')}
						</button>`
				}
			</div>
			<table class="w-full">
				<thead class="bg-background">
					<tr>
						<th class="py-2 px-4 text-left">${t('components.visits.member')}</th>
						<th class="py-2 px-4 text-left">${t('components.visits.date')}</th>
						<!-- <th class="py-2 px-4 text-left">${t('components.visits.notes')}</th> -->
						<th class="py-2 px-4 text-right"><!-- ${t('components.members.actions')} --></th>
					</tr>
				</thead>
				<tbody id="visits-table-body">${visitRows}</tbody>
			</table>
			${pagination ? _renderPagination(pagination, paramPrefix) : ''}
			${pagination?.hasNext ? renderLoadMoreSentinel(pagination, paramPrefix) : ''}
		</div>
	`

	return { content }
}
