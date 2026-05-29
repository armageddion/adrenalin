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
exports.renderMemberRows = renderMemberRows
exports.renderLoadMoreSentinel = renderLoadMoreSentinel
exports.MemberList = MemberList
exports.MemberCard = MemberCard
exports.MembersSection = MembersSection
exports.MemberForm = MemberForm
var html_1 = require('hono/html')
var utils_1 = require('../../utils')
function renderMemberRows(members, _t) {
	return members.map((member) =>
		(0, html_1.html)(
			templateObject_1 ||
				(templateObject_1 = __makeTemplateObject(
					[
						'\n\t\t\t<tr class="hover:bg-muted cursor-pointer" onclick="window.location.href=\'/members/',
						'\'">\n\t\t\t\t<td class="py-2 px-4 truncate">\n\t\t\t\t',
						' ',
						'\n\t\t\t\t</td>\n\t\t\t\t<td class="py-2 px-4">',
						'</td>\n\t\t\t</tr>\n\t\t',
					],
					[
						'\n\t\t\t<tr class="hover:bg-muted cursor-pointer" onclick="window.location.href=\'/members/',
						'\'">\n\t\t\t\t<td class="py-2 px-4 truncate">\n\t\t\t\t',
						' ',
						'\n\t\t\t\t</td>\n\t\t\t\t<td class="py-2 px-4">',
						'</td>\n\t\t\t</tr>\n\t\t',
					],
				)),
			member.id,
			member.first_name,
			member.last_name,
			member.email || 'N/A',
		),
	)
}
function renderLoadMoreSentinel(pagination, search, paramPrefix) {
	if (paramPrefix === void 0) {
		paramPrefix = ''
	}
	return (0, html_1.html)(
		templateObject_2 ||
			(templateObject_2 = __makeTemplateObject(
				[
					'\n\t\t<div\n\t\t\thx-get="?',
					'page=',
					'&',
					'limit=',
					'',
					'&append=1"\n\t\t\thx-trigger="revealed"\n\t\t\thx-target="#members-table-body"\n\t\t\thx-swap="beforeend"\n\t\t\tstyle="visibility: hidden;"\n\t\t></div>\n\t',
				],
				[
					'\n\t\t<div\n\t\t\thx-get="?',
					'page=',
					'&',
					'limit=',
					'',
					'&append=1"\n\t\t\thx-trigger="revealed"\n\t\t\thx-target="#members-table-body"\n\t\t\thx-swap="beforeend"\n\t\t\tstyle="visibility: hidden;"\n\t\t></div>\n\t',
				],
			)),
		paramPrefix,
		pagination.currentPage + 1,
		paramPrefix,
		pagination.limit,
		search ? '&'.concat(paramPrefix, 'search=').concat(encodeURIComponent(search)) : '',
	)
}
function MemberList(_a) {
	var members = _a.members,
		t = _a.t,
		pagination = _a.pagination,
		search = _a.search,
		_b = _a.paramPrefix,
		paramPrefix = _b === void 0 ? '' : _b
	var script = (0, html_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject([''], [''])))
	var content = (0, html_1.html)(
		templateObject_4 ||
			(templateObject_4 = __makeTemplateObject(
				[
					'\n\t\t<div\n\t\t\tid="member-list-wrapper"\n\t\t\tclass="bg-card py-6 rounded-lg shadow-md"\n\t\t>\n\t\t\t<div class="h-10 px-6 flex justify-between items-center mb-4">\n\t\t\t\t<h2 class="text-2xl font-bold">',
					'</h2>\n\t\t\t\t<a href="/members/new" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t',
					'\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t<table class="w-full border-collapse">\n\t\t\t\t<thead class="bg-background">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody id="members-table-body">\n\t\t\t\t\t',
					'\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t\t',
					'\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div\n\t\t\tid="member-list-wrapper"\n\t\t\tclass="bg-card py-6 rounded-lg shadow-md"\n\t\t>\n\t\t\t<div class="h-10 px-6 flex justify-between items-center mb-4">\n\t\t\t\t<h2 class="text-2xl font-bold">',
					'</h2>\n\t\t\t\t<a href="/members/new" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t',
					'\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t<table class="w-full border-collapse">\n\t\t\t\t<thead class="bg-background">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t\t<th class="py-2 px-4 text-left">',
					'</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody id="members-table-body">\n\t\t\t\t\t',
					'\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t\t',
					'\n\t\t</div>\n\t',
				],
			)),
		t('components.members.title'),
		t('buttons.addMember'),
		t('components.members.name'),
		t('components.members.email'),
		renderMemberRows(members, t),
		(pagination === null || pagination === void 0 ? void 0 : pagination.hasNext)
			? renderLoadMoreSentinel(pagination, search, paramPrefix)
			: '',
	)
	return { content: content, script: script }
}
function MemberCard(_a) {
	var member = _a.member,
		memberPackage = _a.memberPackage,
		t = _a.t
	return (0, html_1.html)(
		templateObject_8 ||
			(templateObject_8 = __makeTemplateObject(
				[
					'\n\t\t<div class="bg-card max-w-lg w-full p-6 rounded-lg shadow-md self-start">\n\t\t\t<h2 class="text-2xl font-bold mb-4">',
					' ',
					'</h2>\n\t\t\t',
					'\n\t\t\t',
					'\n\t\t\t<div class="flex flex-col md:flex-row gap-6">\n\t\t\t\t<div class="flex-1">\n\t\t\t\t\t<dl class="space-y-2">\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</dl>\n\t\t\t\t\t<div class="flex flex-wrap gap-2 mt-4">\n\t\t\t\t\t\t<button hx-post="/visits" hx-vals=\'{"card_id": "',
					'"}\' hx-target="#visits-list" hx-swap="outerHTML" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- <a href="/members" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">',
					'</a> -->\n\t\t\t\t\t\t<a href="/members/',
					'/edit" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">',
					'</a>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div class="bg-card max-w-lg w-full p-6 rounded-lg shadow-md self-start">\n\t\t\t<h2 class="text-2xl font-bold mb-4">',
					' ',
					'</h2>\n\t\t\t',
					'\n\t\t\t',
					'\n\t\t\t<div class="flex flex-col md:flex-row gap-6">\n\t\t\t\t<div class="flex-1">\n\t\t\t\t\t<dl class="space-y-2">\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="flex justify-between">\n\t\t\t\t\t\t\t<dt class="font-medium">',
					'</dt>\n\t\t\t\t\t\t\t<dd>',
					'</dd>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</dl>\n\t\t\t\t\t<div class="flex flex-wrap gap-2 mt-4">\n\t\t\t\t\t\t<button hx-post="/visits" hx-vals=\'{"card_id": "',
					'"}\' hx-target="#visits-list" hx-swap="outerHTML" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- <a href="/members" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">',
					'</a> -->\n\t\t\t\t\t\t<a href="/members/',
					'/edit" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">',
					'</a>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
			)),
		member.first_name,
		member.last_name,
		member.image
			? (0, html_1.html)(
					templateObject_5 ||
						(templateObject_5 = __makeTemplateObject(
							[
								'<div class="my-8">\n\t\t\t\t\t\t<img src="',
								'" alt="Member Image" class="w-full aspect-square object-cover rounded shadow-md">\n\t\t\t\t\t</div>',
							],
							[
								'<div class="my-8">\n\t\t\t\t\t\t<img src="',
								'" alt="Member Image" class="w-full aspect-square object-cover rounded shadow-md">\n\t\t\t\t\t</div>',
							],
						)),
					member.image,
				)
			: '',
		member.signature
			? (0, html_1.html)(
					templateObject_6 ||
						(templateObject_6 = __makeTemplateObject(
							[
								'<div class="my-8">\n\t\t\t\t\t\t<h3 class="text-lg font-semibold mb-4">Signature</h3>\n\t\t\t\t\t\t<img src="',
								'" alt="Member Signature" class="border rounded shadow-md">\n\t\t\t\t\t</div>',
							],
							[
								'<div class="my-8">\n\t\t\t\t\t\t<h3 class="text-lg font-semibold mb-4">Signature</h3>\n\t\t\t\t\t\t<img src="',
								'" alt="Member Signature" class="border rounded shadow-md">\n\t\t\t\t\t</div>',
							],
						)),
					member.signature,
				)
			: '',
		t('labels.cardId'),
		member.card_id,
		t('labels.email'),
		member.email || 'N/A',
		t('labels.phone'),
		member.phone || 'N/A',
		t('labels.govId'),
		member.gov_id || 'N/A',
		t('labels.package'),
		memberPackage ? ''.concat(memberPackage.name, ' - ').concat(memberPackage.price, ' RSD') : 'None',
		t('labels.expiryDate'),
		(0, utils_1.formatDate)(member.expires_at),
		t('components.memberForm.yearOfBirth'),
		member.year_of_birth || 'N/A',
		t('address.label'),
		member.address_street
			? ''.concat(member.address_street, ' ').concat(member.address_number, ', ').concat(member.address_city)
			: 'N/A',
		t('components.memberForm.guardian'),
		member.guardian
			? 'Yes - '
					.concat(member.guardian_first_name, ' ')
					.concat(member.guardian_last_name, ' (Gov ID: ')
					.concat(member.guardian_gov_id, ')')
			: 'N/A',
		t('components.memberForm.sendNotifications'),
		member.notify ? t('enabled') : t('disabled'),
		t('labels.notes'),
		member.notes || 'N/A',
		t('labels.lastUpdated'),
		(0, utils_1.formatDate)(member.updated_at),
		member.card_id,
		t('buttons.logVisit'),
		t('buttons.backToMembers'),
		member.id,
		t('buttons.editMember'),
		member.signature
			? (0, html_1.html)(
					templateObject_7 ||
						(templateObject_7 = __makeTemplateObject(
							[
								'\t\t\t\t\t\t<a href="/members/',
								'/consent" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded">',
								'</a>',
							],
							[
								'\t\t\t\t\t\t<a href="/members/',
								'/consent" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded">',
								'</a>',
							],
						)),
					member.id,
					t('buttons.printConsent'),
				)
			: '',
	)
}
function MembersSection(_a) {
	var members = _a.members,
		t = _a.t,
		pagination = _a.pagination,
		search = _a.search,
		_b = _a.paramPrefix,
		paramPrefix = _b === void 0 ? '' : _b
	var searchInput = (0, html_1.html)(
		templateObject_9 ||
			(templateObject_9 = __makeTemplateObject(
				[
					'\n\t\t<div class="mb-6">\n\t\t\t<input\n\t\t\t\ttype="text"\n\t\t\t\tplaceholder="',
					'"\n\t\t\t\tclass="w-full p-2 border rounded"\n\t\t\t\thx-get="?',
					'page=1&',
					'limit=',
					'"\n\t\t\t\thx-target="#member-list-wrapper"\n\t\t\t\thx-swap="outerHTML"\n\t\t\t\thx-trigger="input changed delay:300ms"\n\t\t\t\tname="',
					'search"\n\t\t\t\tvalue="',
					'"\n\t\t\t/>\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div class="mb-6">\n\t\t\t<input\n\t\t\t\ttype="text"\n\t\t\t\tplaceholder="',
					'"\n\t\t\t\tclass="w-full p-2 border rounded"\n\t\t\t\thx-get="?',
					'page=1&',
					'limit=',
					'"\n\t\t\t\thx-target="#member-list-wrapper"\n\t\t\t\thx-swap="outerHTML"\n\t\t\t\thx-trigger="input changed delay:300ms"\n\t\t\t\tname="',
					'search"\n\t\t\t\tvalue="',
					'"\n\t\t\t/>\n\t\t</div>\n\t',
				],
			)),
		t('components.members.searchPlaceholder'),
		paramPrefix,
		paramPrefix,
		pagination.limit,
		paramPrefix,
		search || '',
	)
	var listContent = MemberList({
		members: members,
		t: t,
		pagination: pagination,
		search: search,
		paramPrefix: paramPrefix,
	}).content
	return (0, html_1.html)(
		templateObject_10 ||
			(templateObject_10 = __makeTemplateObject(
				['\n\t\t<div id="members-section" class="flex-1">\n\t\t\t', '\n\t\t\t', '\n\t\t</div>\n\t'],
				['\n\t\t<div id="members-section" class="flex-1">\n\t\t\t', '\n\t\t\t', '\n\t\t</div>\n\t'],
			)),
		searchInput,
		listContent,
	)
}
function MemberForm(_a) {
	var packages = _a.packages,
		member = _a.member,
		t = _a.t
	var isEdit = !!member
	var action = isEdit ? '/members/'.concat(member.id) : '/members'
	var initialGuardian = !!(member === null || member === void 0 ? void 0 : member.guardian)
	var script = (0, html_1.html)(
		templateObject_11 ||
			(templateObject_11 = __makeTemplateObject(
				[
					"\n\t\t<script>\n\t\t\tdocument.addEventListener('alpine:init', () => {\n\t\t\tAlpine.data('cameraCapture', () => ({\n\t\t\t\tstream: null,\n\t\t\t\tdisplayMode: 'existing', // 'existing', 'camera', 'captured'\n\t\t\t\toriginalImage: '',\n\t\t\t\tinit() {\n\t\t\t\t\tconsole.log('Camera component initialized')\n\t\t\t\t\tthis.originalImage = document.getElementById('image-input').value\n\t\t\t\t},\n\t\t\t\tasync startCamera() {\n\t\t\t\t\tif (this.displayMode === 'camera') return\n\t\t\t\t\tthis.displayMode = 'camera'\n\t\t\t\t\tthis.$nextTick(async () => {\n\t\t\t\t\t\tconst video = document.getElementById('video')\n\t\t\t\t\t\tif (!video) {\n\t\t\t\t\t\t\tconsole.error('Video element not found')\n\t\t\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t\t\t\treturn\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {\n\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\tthis.stream = await navigator.mediaDevices.getUserMedia({ video: true })\n\t\t\t\t\t\t\t\tvideo.srcObject = this.stream\n\t\t\t\t\t\t\t\tvideo.play()\n\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\tconsole.error(\"Error accessing camera: \", err)\n\t\t\t\t\t\t\t\talert('Could not access the camera. Please ensure you have given permission.')\n\t\t\t\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t})\n\t\t\t\t},\n\t\t\t\tcaptureImage() {\n\t\t\t\t\tif (this.displayMode !== 'camera') return\n\t\t\t\t\tconst video = document.getElementById('video')\n\t\t\t\t\tif (!video) {\n\t\t\t\t\t\tconsole.error('Video element not found for capture')\n\t\t\t\t\t\treturn\n\t\t\t\t\t}\n\t\t\t\t\tconst canvas = document.getElementById('canvas')\n\t\t\t\t\tconst capturedImage = document.getElementById('captured-image')\n\t\t\t\t\tconst imageInput = document.getElementById('image-input')\n\n\t\t\t\t\t// Set canvas dimensions to match video\n\t\t\t\t\tcanvas.width = video.videoWidth\n\t\t\t\t\tcanvas.height = video.videoHeight\n\n\t\t\t\t\t// Draw the current video frame to the canvas\n\t\t\t\t\tconst context = canvas.getContext('2d')\n\t\t\t\t\tcontext.drawImage(video, 0, 0, canvas.width, canvas.height)\n\n\t\t\t\t\t// Get the image data from the canvas as a base64 string\n\t\t\t\t\tconst dataUrl = canvas.toDataURL('image/png')\n\n\t\t\t\t\t// Show the captured image and set the hidden input value\n\t\t\t\t\tif (imageInput) imageInput.value = dataUrl\n\t\t\t\t\tthis.displayMode = 'captured'\n\t\t\t\t\tthis.$nextTick(() => {\n\t\t\t\t\t\tconst capturedImg = document.getElementById('captured-image')\n\t\t\t\t\t\tif (capturedImg) capturedImg.src = dataUrl\n\t\t\t\t\t})\n\t\t\t\t\tthis.stopCamera()\n\t\t\t\t},\n\t\t\t\tkillCamera() {\n\t\t\t\t\tthis.stopCamera()\n\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t},\n\t\t\t\tstopCamera() {\n\t\t\t\t\tif (this.stream) {\n\t\t\t\t\t\tthis.stream.getTracks().forEach(track => track.stop())\n\t\t\t\t\t\tconst video = document.getElementById('video')\n\t\t\t\t\t\tif (video) {\n\t\t\t\t\t\t\tvideo.srcObject = null\n\t\t\t\t\t\t}\n\t\t\t\t\t\tthis.stream = null\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tkeepImage() {\n\t\t\t\t\t// Update originalImage to the new captured image so it displays in existing mode\n\t\t\t\t\tthis.originalImage = document.getElementById('image-input').value\n\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t},\n\t\t\t\trevertImage() {\n\t\t\t\t\tthis.$nextTick(() => {\n\t\t\t\t\t\tconst imageInput = document.getElementById('image-input')\n\t\t\t\t\t\tconst capturedImage = document.getElementById('captured-image')\n\t\t\t\t\t\tif (imageInput) imageInput.value = this.originalImage\n\t\t\t\t\t\tif (capturedImage) capturedImage.src = this.originalImage\n\t\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t\t})\n\t\t\t\t}\n\t\t\t}))\n\t\t\tAlpine.data('formHelper', (initialGuardian) => ({\n\t\t\t\tsetExpiryDate(months) {\n\t\t\t\t\tconst date = new Date()\n\t\t\t\t\tdate.setMonth(date.getMonth() + months)\n\t\t\t\t\tconst input = document.getElementById('expiry-date')\n\t\t\t\t\tif (input) {\n\t\t\t\t\t\tinput.value = date.toISOString().split('T')[0]\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tisGuardian: initialGuardian\n\t\t\t}))\n\t\t})\n\t\t</script>\n\t",
				],
				[
					"\n\t\t<script>\n\t\t\tdocument.addEventListener('alpine:init', () => {\n\t\t\tAlpine.data('cameraCapture', () => ({\n\t\t\t\tstream: null,\n\t\t\t\tdisplayMode: 'existing', // 'existing', 'camera', 'captured'\n\t\t\t\toriginalImage: '',\n\t\t\t\tinit() {\n\t\t\t\t\tconsole.log('Camera component initialized')\n\t\t\t\t\tthis.originalImage = document.getElementById('image-input').value\n\t\t\t\t},\n\t\t\t\tasync startCamera() {\n\t\t\t\t\tif (this.displayMode === 'camera') return\n\t\t\t\t\tthis.displayMode = 'camera'\n\t\t\t\t\tthis.$nextTick(async () => {\n\t\t\t\t\t\tconst video = document.getElementById('video')\n\t\t\t\t\t\tif (!video) {\n\t\t\t\t\t\t\tconsole.error('Video element not found')\n\t\t\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t\t\t\treturn\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {\n\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\tthis.stream = await navigator.mediaDevices.getUserMedia({ video: true })\n\t\t\t\t\t\t\t\tvideo.srcObject = this.stream\n\t\t\t\t\t\t\t\tvideo.play()\n\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\tconsole.error(\"Error accessing camera: \", err)\n\t\t\t\t\t\t\t\talert('Could not access the camera. Please ensure you have given permission.')\n\t\t\t\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t})\n\t\t\t\t},\n\t\t\t\tcaptureImage() {\n\t\t\t\t\tif (this.displayMode !== 'camera') return\n\t\t\t\t\tconst video = document.getElementById('video')\n\t\t\t\t\tif (!video) {\n\t\t\t\t\t\tconsole.error('Video element not found for capture')\n\t\t\t\t\t\treturn\n\t\t\t\t\t}\n\t\t\t\t\tconst canvas = document.getElementById('canvas')\n\t\t\t\t\tconst capturedImage = document.getElementById('captured-image')\n\t\t\t\t\tconst imageInput = document.getElementById('image-input')\n\n\t\t\t\t\t// Set canvas dimensions to match video\n\t\t\t\t\tcanvas.width = video.videoWidth\n\t\t\t\t\tcanvas.height = video.videoHeight\n\n\t\t\t\t\t// Draw the current video frame to the canvas\n\t\t\t\t\tconst context = canvas.getContext('2d')\n\t\t\t\t\tcontext.drawImage(video, 0, 0, canvas.width, canvas.height)\n\n\t\t\t\t\t// Get the image data from the canvas as a base64 string\n\t\t\t\t\tconst dataUrl = canvas.toDataURL('image/png')\n\n\t\t\t\t\t// Show the captured image and set the hidden input value\n\t\t\t\t\tif (imageInput) imageInput.value = dataUrl\n\t\t\t\t\tthis.displayMode = 'captured'\n\t\t\t\t\tthis.$nextTick(() => {\n\t\t\t\t\t\tconst capturedImg = document.getElementById('captured-image')\n\t\t\t\t\t\tif (capturedImg) capturedImg.src = dataUrl\n\t\t\t\t\t})\n\t\t\t\t\tthis.stopCamera()\n\t\t\t\t},\n\t\t\t\tkillCamera() {\n\t\t\t\t\tthis.stopCamera()\n\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t},\n\t\t\t\tstopCamera() {\n\t\t\t\t\tif (this.stream) {\n\t\t\t\t\t\tthis.stream.getTracks().forEach(track => track.stop())\n\t\t\t\t\t\tconst video = document.getElementById('video')\n\t\t\t\t\t\tif (video) {\n\t\t\t\t\t\t\tvideo.srcObject = null\n\t\t\t\t\t\t}\n\t\t\t\t\t\tthis.stream = null\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tkeepImage() {\n\t\t\t\t\t// Update originalImage to the new captured image so it displays in existing mode\n\t\t\t\t\tthis.originalImage = document.getElementById('image-input').value\n\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t},\n\t\t\t\trevertImage() {\n\t\t\t\t\tthis.$nextTick(() => {\n\t\t\t\t\t\tconst imageInput = document.getElementById('image-input')\n\t\t\t\t\t\tconst capturedImage = document.getElementById('captured-image')\n\t\t\t\t\t\tif (imageInput) imageInput.value = this.originalImage\n\t\t\t\t\t\tif (capturedImage) capturedImage.src = this.originalImage\n\t\t\t\t\t\tthis.displayMode = 'existing'\n\t\t\t\t\t})\n\t\t\t\t}\n\t\t\t}))\n\t\t\tAlpine.data('formHelper', (initialGuardian) => ({\n\t\t\t\tsetExpiryDate(months) {\n\t\t\t\t\tconst date = new Date()\n\t\t\t\t\tdate.setMonth(date.getMonth() + months)\n\t\t\t\t\tconst input = document.getElementById('expiry-date')\n\t\t\t\t\tif (input) {\n\t\t\t\t\t\tinput.value = date.toISOString().split('T')[0]\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tisGuardian: initialGuardian\n\t\t\t}))\n\t\t})\n\t\t</script>\n\t",
				],
			)),
	)
	var content = (0, html_1.html)(
		templateObject_14 ||
			(templateObject_14 = __makeTemplateObject(
				[
					'\n\t\t<div class="bg-card p-6 rounded-xl shadow my-6 max-w-xl mx-auto">\n\t\t\t<h3 class="text-xl font-bold mb-4">\n\t\t\t\t',
					'\n\t\t\t</h3>\n\t\t\t<form\n\t\t\t\thx-post="',
					'"\n\t\t\t\thx-target="body"\n\t\t\t\thx-swap="none"\n\t\t\t\tclass="space-y-4"\n\t\t\t\tx-data="formHelper(',
					')"\n\t\t\t>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="first_name"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="last_name"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="email"\n\t\t\t\t\t\tname="email"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input type="tel" name="phone" value="',
					'" class="mt-1 block w-full p-2 border rounded" />\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="card_id"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="gov_id"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="year_of_birth"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<select\n\t\t\t\t\t\tname="package_id"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded h-10"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option value="">None</option>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</select>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex space-x-2 mb-2">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\tx-on:click="setExpiryDate(1)"\n\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\tx-on:click="setExpiryDate(6)"\n\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\tx-on:click="setExpiryDate(12)"\n\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="date"\n\t\t\t\t\t\tname="expires_at"\n\t\t\t\t\t\tid="expiry-date"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input type="hidden" name="image" id="image-input" value="',
					'" />\n\t\t\t\t\t<div x-data="cameraCapture()">\n\t\t\t\t\t\t<template x-if="displayMode === \'existing\'">\n\t\t\t\t\t\t\t<div class="space-y-2">\n\t\t\t\t\t\t\t\t<div class="w-full aspect-square bg-muted border rounded overflow-hidden">\n\t\t\t\t\t\t\t\t\t<template x-if="originalImage">\n\t\t\t\t\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t\t\t\t\tx-bind:src="originalImage || \'/placeholder-image.png\'"\n\t\t\t\t\t\t\t\t\t\t\talt="Current member image"\n\t\t\t\t\t\t\t\t\t\t\tclass="size-full object-cover"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</template>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="startCamera()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</template>\n\t\t\t\t\t\t<template x-if="displayMode === \'camera\'">\n\t\t\t\t\t\t\t<div class="space-y-2">\n\t\t\t\t\t\t\t\t<div class="w-full aspect-square bg-muted border rounded overflow-hidden">\n\t\t\t\t\t\t\t\t\t<video id="video" class="size-full object-cover" autoplay muted></video>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="captureImage()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="killCamera()"\n\t\t\t\t\t\t\t\t\t\tclass="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</template>\n\t\t\t\t\t\t<template x-if="displayMode === \'captured\'">\n\t\t\t\t\t\t\t<div class="space-y-2">\n\t\t\t\t\t\t\t\t<div class="w-full aspect-square bg-muted border rounded overflow-hidden">\n\t\t\t\t\t\t\t\t\t<img id="captured-image" class="size-full object-cover" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="keepImage()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="revertImage()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</template>\n\t\t\t\t\t\t<canvas id="canvas" class="hidden"></canvas>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<textarea name="notes" class="mt-1 block w-full p-2 border rounded field-sizing-content">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</textarea>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					'</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="address_street"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					'</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="address_number"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					'</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="address_city"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t<input type="checkbox" name="guardian" x-model="isGuardian" class="mr-2" />\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t\t<div x-show="isGuardian">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t\t',
					':\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\t\tname="guardian_first_name"\n\t\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t\t',
					':\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\t\tname="guardian_last_name"\n\t\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t\t',
					':\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\t\tname="guardian_gov_id"\n\t\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t<input type="checkbox" name="notify" ',
					' class="mr-2" />\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</button>\n\t\t\t\t\t<a\n\t\t\t\t\t\thref="',
					'"\n\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded inline-block"\n\t\t\t\t\t>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</a>\n\t\t\t\t\t<span class="flex-auto"></span>\n\t\t\t\t\t',
					'\n \t\t\t\t</div>\n\t\t\t</form>\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div class="bg-card p-6 rounded-xl shadow my-6 max-w-xl mx-auto">\n\t\t\t<h3 class="text-xl font-bold mb-4">\n\t\t\t\t',
					'\n\t\t\t</h3>\n\t\t\t<form\n\t\t\t\thx-post="',
					'"\n\t\t\t\thx-target="body"\n\t\t\t\thx-swap="none"\n\t\t\t\tclass="space-y-4"\n\t\t\t\tx-data="formHelper(',
					')"\n\t\t\t>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="first_name"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="last_name"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="email"\n\t\t\t\t\t\tname="email"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input type="tel" name="phone" value="',
					'" class="mt-1 block w-full p-2 border rounded" />\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="card_id"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="gov_id"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="year_of_birth"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<select\n\t\t\t\t\t\tname="package_id"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded h-10"\n\t\t\t\t\t>\n\t\t\t\t\t\t<option value="">None</option>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</select>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t',
					':\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex space-x-2 mb-2">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\tx-on:click="setExpiryDate(1)"\n\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\tx-on:click="setExpiryDate(6)"\n\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\tx-on:click="setExpiryDate(12)"\n\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="date"\n\t\t\t\t\t\tname="expires_at"\n\t\t\t\t\t\tid="expiry-date"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<input type="hidden" name="image" id="image-input" value="',
					'" />\n\t\t\t\t\t<div x-data="cameraCapture()">\n\t\t\t\t\t\t<template x-if="displayMode === \'existing\'">\n\t\t\t\t\t\t\t<div class="space-y-2">\n\t\t\t\t\t\t\t\t<div class="w-full aspect-square bg-muted border rounded overflow-hidden">\n\t\t\t\t\t\t\t\t\t<template x-if="originalImage">\n\t\t\t\t\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t\t\t\t\tx-bind:src="originalImage || \'/placeholder-image.png\'"\n\t\t\t\t\t\t\t\t\t\t\talt="Current member image"\n\t\t\t\t\t\t\t\t\t\t\tclass="size-full object-cover"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</template>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="startCamera()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</template>\n\t\t\t\t\t\t<template x-if="displayMode === \'camera\'">\n\t\t\t\t\t\t\t<div class="space-y-2">\n\t\t\t\t\t\t\t\t<div class="w-full aspect-square bg-muted border rounded overflow-hidden">\n\t\t\t\t\t\t\t\t\t<video id="video" class="size-full object-cover" autoplay muted></video>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="captureImage()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="killCamera()"\n\t\t\t\t\t\t\t\t\t\tclass="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</template>\n\t\t\t\t\t\t<template x-if="displayMode === \'captured\'">\n\t\t\t\t\t\t\t<div class="space-y-2">\n\t\t\t\t\t\t\t\t<div class="w-full aspect-square bg-muted border rounded overflow-hidden">\n\t\t\t\t\t\t\t\t\t<img id="captured-image" class="size-full object-cover" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="keepImage()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\t\tx-on:click="revertImage()"\n\t\t\t\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</template>\n\t\t\t\t\t\t<canvas id="canvas" class="hidden"></canvas>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n\t\t\t\t\t<textarea name="notes" class="mt-1 block w-full p-2 border rounded field-sizing-content">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</textarea>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					'</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="address_street"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					'</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="address_number"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					'</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\tname="address_city"\n\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t<input type="checkbox" name="guardian" x-model="isGuardian" class="mr-2" />\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t\t<div x-show="isGuardian">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t\t',
					':\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\t\tname="guardian_first_name"\n\t\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t\t',
					':\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\t\tname="guardian_last_name"\n\t\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t\t',
					':\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="text"\n\t\t\t\t\t\t\tname="guardian_gov_id"\n\t\t\t\t\t\t\tvalue="',
					'"\n\t\t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n\t\t\t\t\t\t<input type="checkbox" name="notify" ',
					' class="mr-2" />\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</button>\n\t\t\t\t\t<a\n\t\t\t\t\t\thref="',
					'"\n\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded inline-block"\n\t\t\t\t\t>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</a>\n\t\t\t\t\t<span class="flex-auto"></span>\n\t\t\t\t\t',
					'\n \t\t\t\t</div>\n\t\t\t</form>\n\t\t</div>\n\t',
				],
			)),
		isEdit ? t('components.memberForm.editTitle') : t('components.memberForm.addTitle'),
		action,
		initialGuardian,
		t('components.memberForm.firstName'),
		(member === null || member === void 0 ? void 0 : member.first_name) || '',
		t('components.memberForm.lastName'),
		(member === null || member === void 0 ? void 0 : member.last_name) || '',
		t('components.memberForm.email'),
		(member === null || member === void 0 ? void 0 : member.email) || '',
		t('components.memberForm.phone'),
		(member === null || member === void 0 ? void 0 : member.phone) || '',
		t('components.memberForm.cardId'),
		(member === null || member === void 0 ? void 0 : member.card_id) || '',
		t('components.memberForm.govId'),
		(member === null || member === void 0 ? void 0 : member.gov_id) || '',
		t('components.memberForm.yearOfBirth'),
		(member === null || member === void 0 ? void 0 : member.year_of_birth) || '',
		t('components.memberForm.package'),
		packages.map((p) =>
			(0, html_1.html)(
				templateObject_12 ||
					(templateObject_12 = __makeTemplateObject(
						[
							'\n\t\t\t\t\t\t\t<option value="',
							'" ',
							'>\n\t\t\t\t\t\t\t\t',
							' - ',
							'\n\t\t\t\t\t\t\t\tRSD\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t',
						],
						[
							'\n\t\t\t\t\t\t\t<option value="',
							'" ',
							'>\n\t\t\t\t\t\t\t\t',
							' - ',
							'\n\t\t\t\t\t\t\t\tRSD\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t',
						],
					)),
				p.id,
				(member === null || member === void 0 ? void 0 : member.package_id) === p.id ? 'selected' : '',
				p.name,
				p.price,
			),
		),
		t('components.memberForm.expiryDate'),
		t('components.memberForm.expiry1Month'),
		t('components.memberForm.expiry6Months'),
		t('components.memberForm.expiry1Year'),
		(member === null || member === void 0 ? void 0 : member.expires_at) || '',
		t('image'),
		(member === null || member === void 0 ? void 0 : member.image) || '',
		t('components.memberForm.cameraStart'),
		t('components.memberForm.cameraCapture'),
		t('components.memberForm.cameraStop'),
		t('components.memberForm.cameraKeep'),
		t('components.memberForm.cameraRevert'),
		t('labels.notes'),
		(member === null || member === void 0 ? void 0 : member.notes) || '',
		t('address.street'),
		(member === null || member === void 0 ? void 0 : member.address_street) || '',
		t('address.number'),
		(member === null || member === void 0 ? void 0 : member.address_number) || '',
		t('address.city'),
		(member === null || member === void 0 ? void 0 : member.address_city) || '',
		t('components.memberForm.hasGuardian'),
		t('components.memberForm.guardianFirstName'),
		(member === null || member === void 0 ? void 0 : member.guardian_first_name) || '',
		t('components.memberForm.guardianLastName'),
		(member === null || member === void 0 ? void 0 : member.guardian_last_name) || '',
		t('components.memberForm.guardianGovId'),
		(member === null || member === void 0 ? void 0 : member.guardian_gov_id) || '',
		(member === null || member === void 0 ? void 0 : member.notify) === 1 ? 'checked' : '',
		t('components.memberForm.sendNotifications'),
		isEdit ? t('components.memberForm.update') : t('components.memberForm.create'),
		isEdit ? '/members/'.concat(member.id) : '/members',
		t('buttons.cancel'),
		isEdit
			? (0, html_1.html)(
					templateObject_13 ||
						(templateObject_13 = __makeTemplateObject(
							[
								'\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\thx-delete="/members/',
								'"\n\t\t\t\t\t\t\t\t\thx-confirm="',
								'"\n\t\t\t\t\t\t\t\t\thx-params="none"\n\t\t\t\t\t\t\t\t\tonclick="event.stopPropagation()"\n\t\t\t\t\t\t\t\t\tclass="bg-destructive text-destructive-foreground hover:bg-destructive/80 px-4 py-2 rounded"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t',
							],
							[
								'\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\ttype="button"\n\t\t\t\t\t\t\t\t\thx-delete="/members/',
								'"\n\t\t\t\t\t\t\t\t\thx-confirm="',
								'"\n\t\t\t\t\t\t\t\t\thx-params="none"\n\t\t\t\t\t\t\t\t\tonclick="event.stopPropagation()"\n\t\t\t\t\t\t\t\t\tclass="bg-destructive text-destructive-foreground hover:bg-destructive/80 px-4 py-2 rounded"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t',
							],
						)),
					member.id,
					t('messages.confirmDelete'),
					t('delete'),
				)
			: '',
	)
	return { content: content, script: script }
}
var templateObject_1,
	templateObject_2,
	templateObject_3,
	templateObject_4,
	templateObject_5,
	templateObject_6,
	templateObject_7,
	templateObject_8,
	templateObject_9,
	templateObject_10,
	templateObject_11,
	templateObject_12,
	templateObject_13,
	templateObject_14
