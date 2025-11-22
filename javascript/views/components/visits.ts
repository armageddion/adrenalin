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

function _renderPagination(pagination: Pagination) {
	const { currentPage, totalPages, hasNext, hasPrev } = pagination

	if (totalPages <= 1) return ''

	const pages = []
	const startPage = Math.max(1, currentPage - 2)
	const endPage = Math.min(totalPages, currentPage + 2)

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i)
	}

	return html`
		<div class="flex items-center justify-between mt-4">
			<div class="text-sm text-muted-foreground">
				Showing ${pagination.totalItems} visits
			</div>
			<div class="flex items-center space-x-2">
				${
					hasPrev
						? html`
					<a href="?page=${currentPage - 1}&limit=${pagination.limit}"
					   hx-get="?page=${currentPage - 1}&limit=${pagination.limit}"
					   hx-target="#visits-list"
					   hx-swap="outerHTML"
					   class="px-3 py-1 text-sm border rounded hover:bg-muted">
						Previous
					</a>
				`
						: ''
				}
				${pages.map(
					(page) => html`
					<a href="?page=${page}&limit=${pagination.limit}"
					   hx-get="?page=${page}&limit=${pagination.limit}"
					   hx-target="#visits-list"
					   hx-swap="outerHTML"
					   class="px-3 py-1 text-sm border rounded hover:bg-muted ${page === currentPage ? 'bg-primary text-primary-foreground' : ''}">
						${page}
					</a>
				`,
				)}
				${
					hasNext
						? html`
					<a href="?page=${currentPage + 1}&limit=${pagination.limit}"
					   hx-get="?page=${currentPage + 1}&limit=${pagination.limit}"
					   hx-target="#visits-list"
					   hx-swap="outerHTML"
					   class="px-3 py-1 text-sm border rounded hover:bg-muted">
						Next
					</a>
				`
						: ''
				}
				${
					hasNext
						? html`
					<button hx-get="?page=${currentPage + 1}&limit=${pagination.limit}&append=1"
					   hx-target="#visits-table-body"
					   hx-swap="beforeend"
					   class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/80 ml-4">
						Load More
					</button>
				`
						: ''
				}
			</div>
		</div>
	`
}

export function renderVisitRows(visits: Array<Visit & Pick<Member, 'first_name' | 'last_name'>>, t: TFn) {
	return visits.map(
		(visit) => html`
		<tr class="border-b hover:bg-muted">
			<td class="py-2 px-4">
				${visit.first_name} ${visit.last_name}
			</td>
			<td class="py-2 px-4">${new Date(visit.created_at).toLocaleDateString()}</td>
			<td class="py-2 px-4">${visit.notes || 'N/A'}</td>
			<td class="py-2 px-4">
				<button
					hx-delete="/visits/${visit.id}"
					hx-confirm="${t('messages.confirmDelete')}"
					hx-target="#visits-list"
					hx-swap="outerHTML"
					class="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"
				>
					${t('buttons.delete')}
				</button>
			</td>
		</tr>
	`,
	)
}

export function renderLoadMoreSentinel(pagination: Pagination) {
	return html`
		<div
			hx-get="?page=${pagination.currentPage + 1}&limit=${pagination.limit}&append=1"
			hx-trigger="revealed"
			hx-target="#visits-table-body"
			hx-swap="beforeend"
			style="visibility: hidden;"
		></div>
	`
}

export function VisitList({
	visits,
	t,
	pagination,
}: {
	visits: Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
	t: TFn
	pagination?: Pagination
}) {
	const visitRows = renderVisitRows(visits, t)

	return html`
		<div id="visits-list" class="bg-background p-6 rounded-lg shadow-md mt-6">
			<h2 class="text-2xl font-bold mb-4">${t('components.visits.title')}</h2>
			<table class="w-full border-collapse border">
				<thead>
					<tr class="bg-card">
						<th class="py-2 px-4 text-left">${t('components.visits.member')}</th>
						<th class="py-2 px-4 text-left">${t('components.visits.date')}</th>
						<th class="py-2 px-4 text-left">${t('components.visits.notes')}</th>
						<th class="py-2 px-4 text-left">${t('components.members.actions')}</th>
					</tr>
				</thead>
				<tbody id="visits-table-body">${visitRows}</tbody>
			</table>
			${pagination?.hasNext ? renderLoadMoreSentinel(pagination) : ''}
		</div>
	`
}
