import { html } from 'hono/html'
import type { TFn } from '../../middleware/i18n'

export function MainPanel({
	stats,
	t,
}: {
	stats: {
		newMembers30Days: number
		visitsToday: number
		visitsLast7Days: number
		visitsPrevious7Days: number
		visitsLast30Days: number
		visitsPrevious30Days: number
	}
	t: TFn
}) {
	const calculatePercentageChange = (current: number, previous: number) => {
		if (previous === 0) return current > 0 ? '+100%' : '0%'
		const change = ((current - previous) / previous) * 100
		return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
	}

	const visits7DaysChange = calculatePercentageChange(stats.visitsLast7Days, stats.visitsPrevious7Days)
	const visits30DaysChange = calculatePercentageChange(stats.visitsLast30Days, stats.visitsPrevious30Days)

	return html`
		<div class="bg-background p-6 rounded-lg shadow-md">
			<h2 class="text-2xl font-bold mb-4">${t('components.dashboard.title')}</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="bg-card p-4 rounded-lg">
					<h3 class="text-lg font-semibold">${t('components.dashboard.newMembers')}</h3>
					<p class="text-2xl font-bold text-primary">${stats.newMembers30Days}</p>
				</div>
				<div class="bg-card p-4 rounded-lg">
					<h3 class="text-lg font-semibold">${t('components.dashboard.visitsToday')}</h3>
					<p class="text-2xl font-bold text-primary">${stats.visitsToday}</p>
				</div>
				<div class="bg-card p-4 rounded-lg">
					<h3 class="text-lg font-semibold">${t('components.dashboard.visitsLast7Days')}</h3>
					<p class="text-2xl font-bold text-primary">${stats.visitsLast7Days}</p>
					<p class="text-sm text-muted-foreground">
						${visits7DaysChange} ${t('components.dashboard.fromPrevious7Days')}
					</p>
				</div>
				<div class="bg-card p-4 rounded-lg">
					<h3 class="text-lg font-semibold">${t('components.dashboard.visitsLast30Days')}</h3>
					<p class="text-2xl font-bold text-primary">${stats.visitsLast30Days}</p>
					<p class="text-sm text-muted-foreground">
						${visits30DaysChange} ${t('components.dashboard.fromPrevious30Days')}
					</p>
				</div>
			</div>
		</div>
	`
}
