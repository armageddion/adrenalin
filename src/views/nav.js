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
exports.Button = Button
exports.Nav = Nav
exports.SearchResults = SearchResults
var html_1 = require('hono/html')
function Button(_a) {
	var href = _a.href,
		onClick = _a.onClick,
		_b = _a.className,
		className = _b === void 0 ? '' : _b,
		children = _a.children
	var baseClass = 'flex items-center px-2 py-1 rounded hover:bg-accent '.concat(className)
	if (href) {
		return (0, html_1.html)(
			templateObject_1 ||
				(templateObject_1 = __makeTemplateObject(
					['\n\t\t\t<a href="', '" class="', '">\n\t\t\t\t', '\n\t\t\t</a>\n\t\t'],
					['\n\t\t\t<a href="', '" class="', '">\n\t\t\t\t', '\n\t\t\t</a>\n\t\t'],
				)),
			href,
			baseClass,
			children,
		)
	}
	return (0, html_1.html)(
		templateObject_2 ||
			(templateObject_2 = __makeTemplateObject(
				['\n\t\t<button ', ' class="', '">\n\t\t\t', '\n\t\t</button>\n\t'],
				['\n\t\t<button ', ' class="', '">\n\t\t\t', '\n\t\t</button>\n\t'],
			)),
		onClick ? ' @click="'.concat(onClick, '"') : '',
		baseClass,
		children,
	)
}
function Nav(_a) {
	var t = _a.t,
		user = _a.user
	return (0, html_1.html)(
		templateObject_4 ||
			(templateObject_4 = __makeTemplateObject(
				[
					"\n\t\t<header\n\t\t\tx-data=\"{\n\t\t\t\tkeydownListener: null,\n\t\t\t\tinit() {\n\t\t\t\t\tif (this.keydownListener) {\n\t\t\t\t\t\twindow.removeEventListener('keydown', this.keydownListener);\n\t\t\t\t\t}\n\t\t\t\t\tthis.keydownListener = (e) => {\n\t\t\t\t\t\tif (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {\n\t\t\t\t\t\t\te.preventDefault();\n\t\t\t\t\t\t\tthis.$refs.globalSearch.focus();\n\t\t\t\t\t\t}\n\t\t\t\t\t};\n\t\t\t\t\twindow.addEventListener('keydown', this.keydownListener);\n\t\t\t\t\tAlpine.store('search', { members: [], highlightedIndex: -1 });\n\t\t\t\t},\n\t\t\t\thandleKeydown(e) {\n\t\t\t\t\tconst store = Alpine.store('search');\n\t\t\t\t\tif (e.key === 'ArrowDown') {\n\t\t\t\t\t\te.preventDefault();\n\t\t\t\t\t\tstore.highlightedIndex = Math.min(store.highlightedIndex + 1, store.members.length - 1);\n\t\t\t\t\t} else if (e.key === 'ArrowUp') {\n\t\t\t\t\t\te.preventDefault();\n\t\t\t\t\t\tstore.highlightedIndex = Math.max(store.highlightedIndex - 1, -1);\n\t\t\t\t\t} else if (e.key === 'Enter') {\n\t\t\t\t\t\tif (store.highlightedIndex >= 0) {\n\t\t\t\t\t\t\twindow.location.href = '/members/' + store.members[store.highlightedIndex].id;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\"\n\t\t\tx-init=\"init()\"\n\t\t\tclass=\"w-full text-muted-foreground border border-b shrink-0 sticky top-0 bg-background/50 backdrop-blur-lg\"\n\t\t>\n\t\t\t<nav class=\"h-full flex gap-1 items-center p-2\">\n\t\t\t\t",
					'\n\t\t\t\t<div class="flex-auto">\n\t\t\t\t\t<div class="relative bg-background text-muted-foreground hover:bg-accent rounded border w-full">\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\t\t\t\t\tviewBox="0 0 24 24"\n\t\t\t\t\t\t\tclass="absolute size-5 left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/50"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">\n\t\t\t\t\t\t\t\t<circle cx="11" cy="11" r="8" />\n\t\t\t\t\t\t\t\t<path d="m21 21l-4.3-4.3" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="search"\n\t\t\t\t\t\t\tplaceholder="',
					'"\n\t\t\t\t\t\t\tclass="pl-10 pr-2 py-1 w-full"\n\t\t\t\t\t\t\tx-ref="globalSearch"\n\t\t\t\t\t\t\thx-get="/members-search"\n\t\t\t\t\t\t\thx-target="#search-results"\n\t\t\t\t\t\t\tname="q"\n\t\t\t\t\t\t\thx-trigger="keyup changed delay:300ms"\n\t\t\t\t\t\t\t@keydown="handleKeydown"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<a href="/settings" class="flex items-center justify-center size-8 rounded border hover:bg-accent">\n\t\t\t\t\t<span class="sr-only">',
					'</span>\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5 text-muted-foreground">\n\t\t\t\t\t\t<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">\n\t\t\t\t\t\t\t<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2" />\n\t\t\t\t\t\t\t<circle cx="12" cy="12" r="3" />\n\t\t\t\t\t\t</g>\n\t\t\t\t\t</svg>\n\t\t\t\t</a>\n\t\t\t\t',
					'\n\t\t\t</nav>\n\t\t</header>\n\t',
				],
				[
					"\n\t\t<header\n\t\t\tx-data=\"{\n\t\t\t\tkeydownListener: null,\n\t\t\t\tinit() {\n\t\t\t\t\tif (this.keydownListener) {\n\t\t\t\t\t\twindow.removeEventListener('keydown', this.keydownListener);\n\t\t\t\t\t}\n\t\t\t\t\tthis.keydownListener = (e) => {\n\t\t\t\t\t\tif (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {\n\t\t\t\t\t\t\te.preventDefault();\n\t\t\t\t\t\t\tthis.$refs.globalSearch.focus();\n\t\t\t\t\t\t}\n\t\t\t\t\t};\n\t\t\t\t\twindow.addEventListener('keydown', this.keydownListener);\n\t\t\t\t\tAlpine.store('search', { members: [], highlightedIndex: -1 });\n\t\t\t\t},\n\t\t\t\thandleKeydown(e) {\n\t\t\t\t\tconst store = Alpine.store('search');\n\t\t\t\t\tif (e.key === 'ArrowDown') {\n\t\t\t\t\t\te.preventDefault();\n\t\t\t\t\t\tstore.highlightedIndex = Math.min(store.highlightedIndex + 1, store.members.length - 1);\n\t\t\t\t\t} else if (e.key === 'ArrowUp') {\n\t\t\t\t\t\te.preventDefault();\n\t\t\t\t\t\tstore.highlightedIndex = Math.max(store.highlightedIndex - 1, -1);\n\t\t\t\t\t} else if (e.key === 'Enter') {\n\t\t\t\t\t\tif (store.highlightedIndex >= 0) {\n\t\t\t\t\t\t\twindow.location.href = '/members/' + store.members[store.highlightedIndex].id;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\"\n\t\t\tx-init=\"init()\"\n\t\t\tclass=\"w-full text-muted-foreground border border-b shrink-0 sticky top-0 bg-background/50 backdrop-blur-lg\"\n\t\t>\n\t\t\t<nav class=\"h-full flex gap-1 items-center p-2\">\n\t\t\t\t",
					'\n\t\t\t\t<div class="flex-auto">\n\t\t\t\t\t<div class="relative bg-background text-muted-foreground hover:bg-accent rounded border w-full">\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\t\t\t\t\tviewBox="0 0 24 24"\n\t\t\t\t\t\t\tclass="absolute size-5 left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/50"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">\n\t\t\t\t\t\t\t\t<circle cx="11" cy="11" r="8" />\n\t\t\t\t\t\t\t\t<path d="m21 21l-4.3-4.3" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="search"\n\t\t\t\t\t\t\tplaceholder="',
					'"\n\t\t\t\t\t\t\tclass="pl-10 pr-2 py-1 w-full"\n\t\t\t\t\t\t\tx-ref="globalSearch"\n\t\t\t\t\t\t\thx-get="/members-search"\n\t\t\t\t\t\t\thx-target="#search-results"\n\t\t\t\t\t\t\tname="q"\n\t\t\t\t\t\t\thx-trigger="keyup changed delay:300ms"\n\t\t\t\t\t\t\t@keydown="handleKeydown"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<a href="/settings" class="flex items-center justify-center size-8 rounded border hover:bg-accent">\n\t\t\t\t\t<span class="sr-only">',
					'</span>\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5 text-muted-foreground">\n\t\t\t\t\t\t<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">\n\t\t\t\t\t\t\t<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2" />\n\t\t\t\t\t\t\t<circle cx="12" cy="12" r="3" />\n\t\t\t\t\t\t</g>\n\t\t\t\t\t</svg>\n\t\t\t\t</a>\n\t\t\t\t',
					'\n\t\t\t</nav>\n\t\t</header>\n\t',
				],
			)),
		Button({ href: '/', children: t('nav.home') }),
		t('nav.searchPlaceholder'),
		t('nav.settings.title') || 'Settings',
		user
			? (0, html_1.html)(
					templateObject_3 ||
						(templateObject_3 = __makeTemplateObject(
							[
								'\n\t\t\t\t\t<div class="flex items-center gap-2">\n\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t<span class="text-sm">',
								'</span>\n\t\t\t\t\t\t<form method="post" action="/logout" class="inline">\n\t\t\t\t\t\t\t<button type="submit" class="text-sm text-red-600 hover:text-red-800">Logout</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t',
							],
							[
								'\n\t\t\t\t\t<div class="flex items-center gap-2">\n\t\t\t\t\t\t',
								'\n\t\t\t\t\t\t<span class="text-sm">',
								'</span>\n\t\t\t\t\t\t<form method="post" action="/logout" class="inline">\n\t\t\t\t\t\t\t<button type="submit" class="text-sm text-red-600 hover:text-red-800">Logout</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t',
							],
						)),
					user.role === 'admin' ? Button({ href: '/users', children: 'Users' }) : '',
					user.username,
				)
			: '',
	)
}
// biome-ignore lint/correctness/noUnusedFunctionParameters: stfu
function SearchResults(_a) {
	var members = _a.members,
		_t = _a.t
	return (0, html_1.html)(
		templateObject_6 ||
			(templateObject_6 = __makeTemplateObject(
				['\n\t\t<div id="member-list" class="space-y-2">\n\t\t\t', '\n\t\t</div>\n\t'],
				['\n\t\t<div id="member-list" class="space-y-2">\n\t\t\t', '\n\t\t</div>\n\t'],
			)),
		members.map((m) =>
			(0, html_1.html)(
				templateObject_5 ||
					(templateObject_5 = __makeTemplateObject(
						[
							'\n\t\t\t\t<a href="/members/',
							'" class="flex justify-between items-center p-3 hover:bg-muted-foreground/10">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t',
							' ',
							'\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class="text-muted-foreground ml-2">',
							'</span>\n\t\t\t\t\t</div>\n\t\t\t\t</a>\n\t\t\t',
						],
						[
							'\n\t\t\t\t<a href="/members/',
							'" class="flex justify-between items-center p-3 hover:bg-muted-foreground/10">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t',
							' ',
							'\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class="text-muted-foreground ml-2">',
							'</span>\n\t\t\t\t\t</div>\n\t\t\t\t</a>\n\t\t\t',
						],
					)),
				m.id,
				m.first_name,
				m.last_name,
				m.card_id,
			),
		),
	)
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6
