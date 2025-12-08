import os from 'node:os'

// TODO:
// - member profile, updates, expires
// - visits
export function formatDate(_date: string | number) {}

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
