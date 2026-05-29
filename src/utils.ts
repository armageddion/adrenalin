import os from 'node:os'

// TODO:
// - member profile, updates, expires
// - visits
export function formatDate(date: string | number | Date | null | undefined): string {
	if (date === null || date === undefined || date === '') {
		return 'N/A'
	}

	const parsedDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

	if (Number.isNaN(parsedDate.getTime())) {
		return 'N/A'
	}

	const day = String(parsedDate.getDate()).padStart(2, '0')
	const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
	const year = parsedDate.getFullYear()

	return `${day}-${month}-${year}`
}

// TODO:
// - package prices
export function formatNumber(_number: number | string) {}

export function getLocalIP(): string {
	const interfaces = os.networkInterfaces()
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name] || []) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address
			}
		}
	}
	return '127.0.0.1'
}
