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
exports.MainPanel = MainPanel
var html_1 = require('hono/html')
function MainPanel(_a) {
	var stats = _a.stats,
		t = _a.t
	var calculatePercentageChange = (current, previous) => {
		if (previous === 0) return current > 0 ? '+100%' : '0%'
		var change = ((current - previous) / previous) * 100
		return ''.concat(change > 0 ? '+' : '').concat(change.toFixed(1), '%')
	}
	var visits7DaysChange = calculatePercentageChange(stats.visitsLast7Days, stats.visitsPrevious7Days)
	var visits30DaysChange = calculatePercentageChange(stats.visitsLast30Days, stats.visitsPrevious30Days)
	return (0, html_1.html)(
		templateObject_1 ||
			(templateObject_1 = __makeTemplateObject(
				[
					'\n\t\t<div class="bg-background p-6 rounded-lg shadow-md">\n\t\t\t<h2 class="text-2xl font-bold mb-4">',
					'</h2>\n\t\t\t<div class="grid grid-cols-1 md:grid-cols-2 gap-4">\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t</div>\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t</div>\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t\t<p class="text-sm text-muted-foreground">\n\t\t\t\t\t\t',
					' ',
					'\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t\t<p class="text-sm text-muted-foreground">\n\t\t\t\t\t\t',
					' ',
					'\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
				[
					'\n\t\t<div class="bg-background p-6 rounded-lg shadow-md">\n\t\t\t<h2 class="text-2xl font-bold mb-4">',
					'</h2>\n\t\t\t<div class="grid grid-cols-1 md:grid-cols-2 gap-4">\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t</div>\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t</div>\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t\t<p class="text-sm text-muted-foreground">\n\t\t\t\t\t\t',
					' ',
					'\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div class="bg-card p-4 rounded-lg">\n\t\t\t\t\t<h3 class="text-lg font-semibold">',
					'</h3>\n\t\t\t\t\t<p class="text-2xl font-bold text-primary">',
					'</p>\n\t\t\t\t\t<p class="text-sm text-muted-foreground">\n\t\t\t\t\t\t',
					' ',
					'\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
			)),
		t('components.dashboard.title'),
		t('components.dashboard.newMembers'),
		stats.newMembers30Days,
		t('components.dashboard.visitsToday'),
		stats.visitsToday,
		t('components.dashboard.visitsLast7Days'),
		stats.visitsLast7Days,
		visits7DaysChange,
		t('components.dashboard.fromPrevious7Days'),
		t('components.dashboard.visitsLast30Days'),
		stats.visitsLast30Days,
		visits30DaysChange,
		t('components.dashboard.fromPrevious30Days'),
	)
}
var templateObject_1
