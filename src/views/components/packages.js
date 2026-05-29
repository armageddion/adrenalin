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
exports.PackageList = PackageList
exports.PackageForm = PackageForm
var html_1 = require('hono/html')
function PackageList(_a) {
	var packages = _a.packages,
		t = _a.t
	return (0, html_1.html)(
		templateObject_2 ||
			(templateObject_2 = __makeTemplateObject(
				[
					'\n \t\t<div id="package-list-container" class="bg-background p-6 rounded-lg shadow-md">\n \t\t\t<h2 class="text-2xl font-bold mb-4">',
					'</h2>\n \t\t\t<div id="packages-list" class="space-y-2">\n \t\t\t\t',
					'\n \t\t\t</div>\n \t\t</div>\n \t',
				],
				[
					'\n \t\t<div id="package-list-container" class="bg-background p-6 rounded-lg shadow-md">\n \t\t\t<h2 class="text-2xl font-bold mb-4">',
					'</h2>\n \t\t\t<div id="packages-list" class="space-y-2">\n \t\t\t\t',
					'\n \t\t\t</div>\n \t\t</div>\n \t',
				],
			)),
		t('components.packageList.title'),
		packages.map((p) =>
			(0, html_1.html)(
				templateObject_1 ||
					(templateObject_1 = __makeTemplateObject(
						[
							'\n \t\t\t\t\t<div class="flex justify-between items-center p-3 bg-card rounded">\n \t\t\t\t\t\t<div class="space-y-2">\n \t\t\t\t\t\t\t<h4 class="font-semibold">\n \t\t\t\t\t\t\t\t',
							' - ',
							'\n \t\t\t\t\t\t\t\t&nbsp;RSD\n \t\t\t\t\t\t\t</h4>\n \t\t\t\t\t\t\t<p class="text-sm text-muted-foreground">',
							'</p>\n \t\t\t\t\t\t</div>\n \t\t\t\t\t\t<div class="space-x-2">\n \t\t\t\t\t\t\t<button\n \t\t\t\t\t\t\t\thx-get="/packages/',
							'/edit"\n \t\t\t\t\t\t\t\thx-target="#package-form"\n \t\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n \t\t\t\t\t\t\t>\n \t\t\t\t\t\t\t\t',
							'\n \t\t\t\t\t\t\t</button>\n \t\t\t\t\t\t\t<button\n \t\t\t\t\t\t\t\thx-delete="/packages/',
							'"\n \t\t\t\t\t\t\t\thx-confirm="',
							'"\n \t\t\t\t\t\t\t\thx-target="#package-list-container"\n \t\t\t\t\t\t\t\thx-swap="outerHTML"\n \t\t\t\t\t\t\t\tclass="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"\n \t\t\t\t\t\t\t>\n \t\t\t\t\t\t\t\t',
							'\n \t\t\t\t\t\t\t</button>\n \t\t\t\t\t\t</div>\n \t\t\t\t\t</div>\n \t\t\t\t',
						],
						[
							'\n \t\t\t\t\t<div class="flex justify-between items-center p-3 bg-card rounded">\n \t\t\t\t\t\t<div class="space-y-2">\n \t\t\t\t\t\t\t<h4 class="font-semibold">\n \t\t\t\t\t\t\t\t',
							' - ',
							'\n \t\t\t\t\t\t\t\t&nbsp;RSD\n \t\t\t\t\t\t\t</h4>\n \t\t\t\t\t\t\t<p class="text-sm text-muted-foreground">',
							'</p>\n \t\t\t\t\t\t</div>\n \t\t\t\t\t\t<div class="space-x-2">\n \t\t\t\t\t\t\t<button\n \t\t\t\t\t\t\t\thx-get="/packages/',
							'/edit"\n \t\t\t\t\t\t\t\thx-target="#package-form"\n \t\t\t\t\t\t\t\tclass="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"\n \t\t\t\t\t\t\t>\n \t\t\t\t\t\t\t\t',
							'\n \t\t\t\t\t\t\t</button>\n \t\t\t\t\t\t\t<button\n \t\t\t\t\t\t\t\thx-delete="/packages/',
							'"\n \t\t\t\t\t\t\t\thx-confirm="',
							'"\n \t\t\t\t\t\t\t\thx-target="#package-list-container"\n \t\t\t\t\t\t\t\thx-swap="outerHTML"\n \t\t\t\t\t\t\t\tclass="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"\n \t\t\t\t\t\t\t>\n \t\t\t\t\t\t\t\t',
							'\n \t\t\t\t\t\t\t</button>\n \t\t\t\t\t\t</div>\n \t\t\t\t\t</div>\n \t\t\t\t',
						],
					)),
				p.name,
				p.price,
				p.description,
				p.id,
				t('components.packageList.edit'),
				p.id,
				t('messages.confirmDelete'),
				t('components.packageList.delete'),
			),
		),
	)
}
function PackageForm(_a) {
	var pkg = _a.package,
		t = _a.t
	var isEdit = !!pkg
	var action = isEdit ? '/packages/'.concat(pkg.id) : '/packages'
	return (0, html_1.html)(
		templateObject_3 ||
			(templateObject_3 = __makeTemplateObject(
				[
					'\n \t\t<div class="bg-background p-6 rounded-lg shadow-md mb-6">\n \t\t\t<h3 class="text-xl font-bold mb-4">\n \t\t\t\t',
					'\n \t\t\t</h3>\n \t\t\t<form hx-post="',
					'" hx-target="body" hx-swap="none" class="space-y-4">\n \t\t\t\t<div>\n \t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n \t\t\t\t\t<input\n \t\t\t\t\t\ttype="text"\n \t\t\t\t\t\tname="name"\n \t\t\t\t\t\tvalue="',
					'"\n \t\t\t\t\t\trequired\n \t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n \t\t\t\t\t/>\n \t\t\t\t</div>\n \t\t\t\t<div>\n \t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n \t\t\t\t\t\t',
					':\n \t\t\t\t\t</label>\n \t\t\t\t\t<textarea name="description" required class="mt-1 block w-full p-2 border rounded field-sizing-content">\n \t\t\t\t\t\t',
					'\n \t\t\t\t\t</textarea>\n \t\t\t\t</div>\n \t\t\t\t<div>\n \t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n \t\t\t\t\t\t',
					':\n \t\t\t\t\t</label>\n \t\t\t\t\t<input\n \t\t\t\t\t\ttype="number"\n \t\t\t\t\t\tstep="0.01"\n \t\t\t\t\t\tname="price"\n \t\t\t\t\t\tvalue="',
					'"\n \t\t\t\t\t\trequired\n \t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n \t\t\t\t\t/>\n \t\t\t\t</div>\n \t\t\t\t<div class="flex space-x-2">\n \t\t\t\t\t<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n \t\t\t\t\t\t',
					'\n \t\t\t\t\t</button>\n \t\t\t\t\t<button\n \t\t\t\t\t\ttype="button"\n \t\t\t\t\t\thx-get="/packages"\n \t\t\t\t\t\thx-target="#package-form"\n \t\t\t\t\t\thx-swap="outerHTML"\n \t\t\t\t\t\tclass="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"\n \t\t\t\t\t>\n \t\t\t\t\t\t',
					'\n \t\t\t\t\t</button>\n \t\t\t\t</div>\n \t\t\t</form>\n \t\t</div>\n \t',
				],
				[
					'\n \t\t<div class="bg-background p-6 rounded-lg shadow-md mb-6">\n \t\t\t<h3 class="text-xl font-bold mb-4">\n \t\t\t\t',
					'\n \t\t\t</h3>\n \t\t\t<form hx-post="',
					'" hx-target="body" hx-swap="none" class="space-y-4">\n \t\t\t\t<div>\n \t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">',
					':</label>\n \t\t\t\t\t<input\n \t\t\t\t\t\ttype="text"\n \t\t\t\t\t\tname="name"\n \t\t\t\t\t\tvalue="',
					'"\n \t\t\t\t\t\trequired\n \t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n \t\t\t\t\t/>\n \t\t\t\t</div>\n \t\t\t\t<div>\n \t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n \t\t\t\t\t\t',
					':\n \t\t\t\t\t</label>\n \t\t\t\t\t<textarea name="description" required class="mt-1 block w-full p-2 border rounded field-sizing-content">\n \t\t\t\t\t\t',
					'\n \t\t\t\t\t</textarea>\n \t\t\t\t</div>\n \t\t\t\t<div>\n \t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground">\n \t\t\t\t\t\t',
					':\n \t\t\t\t\t</label>\n \t\t\t\t\t<input\n \t\t\t\t\t\ttype="number"\n \t\t\t\t\t\tstep="0.01"\n \t\t\t\t\t\tname="price"\n \t\t\t\t\t\tvalue="',
					'"\n \t\t\t\t\t\trequired\n \t\t\t\t\t\tclass="mt-1 block w-full p-2 border rounded"\n \t\t\t\t\t/>\n \t\t\t\t</div>\n \t\t\t\t<div class="flex space-x-2">\n \t\t\t\t\t<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">\n \t\t\t\t\t\t',
					'\n \t\t\t\t\t</button>\n \t\t\t\t\t<button\n \t\t\t\t\t\ttype="button"\n \t\t\t\t\t\thx-get="/packages"\n \t\t\t\t\t\thx-target="#package-form"\n \t\t\t\t\t\thx-swap="outerHTML"\n \t\t\t\t\t\tclass="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"\n \t\t\t\t\t>\n \t\t\t\t\t\t',
					'\n \t\t\t\t\t</button>\n \t\t\t\t</div>\n \t\t\t</form>\n \t\t</div>\n \t',
				],
			)),
		isEdit ? t('components.packageForm.editTitle') : t('components.packageForm.addTitle'),
		action,
		t('components.packageForm.name'),
		(pkg === null || pkg === void 0 ? void 0 : pkg.name) || '',
		t('components.packageForm.description'),
		(pkg === null || pkg === void 0 ? void 0 : pkg.description) || '',
		t('components.packageForm.price'),
		(pkg === null || pkg === void 0 ? void 0 : pkg.price) || '',
		isEdit ? t('components.packageForm.update') : t('components.packageForm.create'),
		t('buttons.cancel'),
	)
}
var templateObject_1, templateObject_2, templateObject_3
