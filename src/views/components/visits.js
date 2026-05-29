var __makeTemplateObject =
	(this && this.__makeTemplateObject) ||
	((cooked, raw) => {
		if (Object.defineProperty) {
			Object.defineProperty(cooked, 'raw', { value: raw })
		} else {
			cooked.raw = raw
		}
		return cooked
	})
Object.defineProperty(exports, '__esModule', { value: true })
exports.renderVisitRows = renderVisitRows
exports.renderLoadMoreSentinel = renderLoadMoreSentinel
exports.VisitsSection = VisitsSection
exports.VisitList = VisitList
var html_1 = require('hono/html')
var utils_1 = require('../../utils')
function _renderPagination(pagination, paramPrefix) {
	if (paramPrefix === void 0) {
		paramPrefix = ''
	}
	var hasNext = pagination.hasNext
	if (!hasNext) return ''
	return (0, html_1.html)(
		templateObject_1 ||
			(templateObject_1 = __makeTemplateObject(
				[
					'\n\t\t<div class="flex items-center justify-between mt-4">\n\t\t\t<div class="text-sm text-muted-foreground">\n\t\t\t\tShowing ',
					' visits\n\t\t\t</div>\n\t\t\t<div class="flex items-center space-x-2">\n\t\t\t\t<button hx-get="?',
					'page=',
					'&',
					'limit=',
					'&append=1"\n\t\t\t\t   hx-target="#visits-table-body"\n\t\t\t\t   hx-swap="beforeend"\n\t\t\t\t   class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/80">\n\t\t\t\t\tLoad More\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div class="flex items-center justify-between mt-4">\n\t\t\t<div class="text-sm text-muted-foreground">\n\t\t\t\tShowing ',
					' visits\n\t\t\t</div>\n\t\t\t<div class="flex items-center space-x-2">\n\t\t\t\t<button hx-get="?',
					'page=',
					'&',
					'limit=',
					'&append=1"\n\t\t\t\t   hx-target="#visits-table-body"\n\t\t\t\t   hx-swap="beforeend"\n\t\t\t\t   class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/80">\n\t\t\t\t\tLoad More\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
			)),
		pagination.totalItems,
		paramPrefix,
		pagination.currentPage + 1,
		paramPrefix,
		pagination.limit,
	)
}
function renderVisitRows(visits, t) {
	return visits.map((visit) =>
		(0, html_1.html)(
			templateObject_2 ||
				(templateObject_2 = __makeTemplateObject(
					[
						'\n\t\t\t<tr class="hover:bg-muted">\n\t\t\t\t<td class="py-2 px-4">\n\t\t\t\t\t',
						' ',
						'\n\t\t\t\t</td>\n\t\t\t\t<td class="py-2 px-4">',
						'</td>\n\t\t\t\t<!-- <td class="py-2 px-4">',
						'</td> -->\n\t\t\t\t<td class="py-2 px-4 text-right">\n\t\t\t\t\t<button\n\t\t\t\t\t\thx-delete="/visits/',
						'"\n\t\t\t\t\t\thx-confirm="',
						'"\n\t\t\t\t\thx-target="#visits-list"\n\t\t\t\t\t\thx-swap="outerHTML"\n\t\t\t\t\t\tclass="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"\n\t\t\t\t\t>\n\t\t\t\t\t\t',
						'\n\t\t\t\t\t</button>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t',
					],
					[
						'\n\t\t\t<tr class="hover:bg-muted">\n\t\t\t\t<td class="py-2 px-4">\n\t\t\t\t\t',
						' ',
						'\n\t\t\t\t</td>\n\t\t\t\t<td class="py-2 px-4">',
						'</td>\n\t\t\t\t<!-- <td class="py-2 px-4">',
						'</td> -->\n\t\t\t\t<td class="py-2 px-4 text-right">\n\t\t\t\t\t<button\n\t\t\t\t\t\thx-delete="/visits/',
						'"\n\t\t\t\t\t\thx-confirm="',
						'"\n\t\t\t\t\thx-target="#visits-list"\n\t\t\t\t\t\thx-swap="outerHTML"\n\t\t\t\t\t\tclass="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"\n\t\t\t\t\t>\n\t\t\t\t\t\t',
						'\n\t\t\t\t\t</button>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t',
					],
				)),
			visit.first_name,
			visit.last_name,
			(0, utils_1.formatDate)(visit.created_at),
			visit.notes || 'N/A',
			visit.id,
			t('messages.confirmDelete'),
			t('buttons.delete'),
		),
	)
}
function renderLoadMoreSentinel(pagination, paramPrefix) {
	if (paramPrefix === void 0) {
		paramPrefix = ''
	}
	return (0, html_1.html)(
		templateObject_3 ||
			(templateObject_3 = __makeTemplateObject(
				[
					'\n\t\t<div\n\t\t\thx-get="?',
					'page=',
					'&',
					'limit=',
					'&append=1"\n\t\t\thx-trigger="revealed"\n\t\t\thx-target="#visits-table-body"\n\t\t\thx-swap="beforeend"\n\t\t\tstyle="visibility: hidden;"\n\t\t></div>\n\t',
				],
				[
					'\n\t\t<div\n\t\t\thx-get="?',
					'page=',
					'&',
					'limit=',
					'&append=1"\n\t\t\thx-trigger="revealed"\n\t\t\thx-target="#visits-table-body"\n\t\t\thx-swap="beforeend"\n\t\t\tstyle="visibility: hidden;"\n\t\t></div>\n\t',
				],
			)),
		paramPrefix,
		pagination.currentPage + 1,
		paramPrefix,
		pagination.limit,
	)
}
function VisitsSection(_a) {
	var visits = _a.visits,
		t = _a.t,
		pagination = _a.pagination,
		search = _a.search,
		_b = _a.paramPrefix,
		paramPrefix = _b === void 0 ? '' : _b
	var searchInput = (0, html_1.html)(
		templateObject_4 ||
			(templateObject_4 = __makeTemplateObject(
				[
					'\n\t\t<div class="mb-6">\n\t\t\t<input\n\t\t\t\ttype="text"\n\t\t\t\tplaceholder="',
					'"\n\t\t\t\tclass="w-full p-2 border rounded"\n\t\t\t\thx-get="?',
					'page=1&',
					'limit=',
					'"\n\t\t\t\thx-target="#visits-list"\n\t\t\t\thx-swap="outerHTML"\n\t\t\t\thx-trigger="input changed delay:300ms"\n\t\t\t\tname="',
					'search"\n\t\t\t\tvalue="',
					'"\n\t\t\t/>\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div class="mb-6">\n\t\t\t<input\n\t\t\t\ttype="text"\n\t\t\t\tplaceholder="',
					'"\n\t\t\t\tclass="w-full p-2 border rounded"\n\t\t\t\thx-get="?',
					'page=1&',
					'limit=',
					'"\n\t\t\t\thx-target="#visits-list"\n\t\t\t\thx-swap="outerHTML"\n\t\t\t\thx-trigger="input changed delay:300ms"\n\t\t\t\tname="',
					'search"\n\t\t\t\tvalue="',
					'"\n\t\t\t/>\n\t\t</div>\n\t',
				],
			)),
		t('components.visits.searchPlaceholder'),
		paramPrefix,
		paramPrefix,
		pagination.limit,
		paramPrefix,
		search || '',
	)
	var listContent = VisitList({ visits: visits, t: t, pagination: pagination, paramPrefix: paramPrefix }).content
	return (0, html_1.html)(
		templateObject_5 ||
			(templateObject_5 = __makeTemplateObject(
				['\n\t\t<div id="visits-section" class="flex-1">\n\t\t\t', '\n\t\t\t', '\n\t\t</div>\n\t'],
				['\n\t\t<div id="visits-section" class="flex-1">\n\t\t\t', '\n\t\t\t', '\n\t\t</div>\n\t'],
			)),
		searchInput,
		listContent,
	)
}
function VisitList(_a) {
	var visits = _a.visits,
		t = _a.t,
		pagination = _a.pagination,
		_b = _a.paramPrefix,
		paramPrefix = _b === void 0 ? '' : _b,
		member = _a.member
	var visitRows = renderVisitRows(visits, t)
	var content = (0, html_1.html)(
		templateObject_8 ||
			(templateObject_8 = __makeTemplateObject(
				[
					'\n\t\t<div id="visits-list" class="bg-card py-6 rounded-lg shadow-md w-full">\n\t\t\t<div class="h-10 px-6 flex justify-between items-center mb-4">\n\t\t\t\t<h2 class="text-2xl font-bold">',
					'</h2>\n\t\t\t\t',
					'\n\t\t\t</div>\n\t\t\t<table class="w-full">\n\t\t\t\t<thead class="bg-background">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t\t<!-- <th class="py-2 px-4 text-left">',
					'</th> -->\n\t\t\t\t\t\t<th class="py-2 px-4 text-right"><!-- ',
					' --></th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody id="visits-table-body">',
					'</tbody>\n\t\t\t</table>\n\t\t\t',
					'\n\t\t\t',
					'\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div id="visits-list" class="bg-card py-6 rounded-lg shadow-md w-full">\n\t\t\t<div class="h-10 px-6 flex justify-between items-center mb-4">\n\t\t\t\t<h2 class="text-2xl font-bold">',
					'</h2>\n\t\t\t\t',
					'\n\t\t\t</div>\n\t\t\t<table class="w-full">\n\t\t\t\t<thead class="bg-background">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t\t<!-- <th class="py-2 px-4 text-left">',
					'</th> -->\n\t\t\t\t\t\t<th class="py-2 px-4 text-right"><!-- ',
					' --></th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody id="visits-table-body">',
					'</tbody>\n\t\t\t</table>\n\t\t\t',
					'\n\t\t\t',
					'\n\t\t</div>\n\t',
				],
			)),
		t('components.visits.title'),
		member
			? (0, html_1.html)(
					templateObject_6 ||
						(templateObject_6 = __makeTemplateObject(
							[
								'<button hx-post="/visits" hx-vals=\'{"card_id": "',
								'"}\' hx-target="#visits-list" hx-swap="outerHTML" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t</button>',
							],
							[
								'<button hx-post="/visits" hx-vals=\'{"card_id": "',
								'"}\' hx-target="#visits-list" hx-swap="outerHTML" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t</button>',
							],
						)),
					member.card_id,
					t('buttons.logVisit'),
				)
			: (0, html_1.html)(
					templateObject_7 ||
						(templateObject_7 = __makeTemplateObject(
							[
								'<button @click="$store.visitPopup.showVisitPopup = true" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t</button>',
							],
							[
								'<button @click="$store.visitPopup.showVisitPopup = true" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t</button>',
							],
						)),
					t('buttons.logVisit'),
				),
		t('components.visits.member'),
		t('components.visits.date'),
		t('components.visits.notes'),
		t('components.members.actions'),
		visitRows,
		pagination ? _renderPagination(pagination, paramPrefix) : '',
		(pagination === null || pagination === void 0 ? void 0 : pagination.hasNext)
			? renderLoadMoreSentinel(pagination, paramPrefix)
			: '',
	)
	return { content: content }
}
var templateObject_1,
	templateObject_2,
	templateObject_3,
	templateObject_4,
	templateObject_5,
	templateObject_6,
	templateObject_7,
	templateObject_8
