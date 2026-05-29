Object.defineProperty(exports, '__esModule', { value: true })
exports.formatDate = formatDate
exports.formatNumber = formatNumber
exports.getLocalIP = getLocalIP
var node_os_1 = require('node:os')
// TODO:
// - member profile, updates, expires
// - visits
function formatDate(date) {
	if (date === null || date === undefined || date === '') {
		return 'N/A'
	}
	var parsedDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
	if (Number.isNaN(parsedDate.getTime())) {
		return 'N/A'
	}
	var day = String(parsedDate.getDate()).padStart(2, '0')
	var month = String(parsedDate.getMonth() + 1).padStart(2, '0')
	var year = parsedDate.getFullYear()
	return ''.concat(day, '-').concat(month, '-').concat(year)
}
// TODO:
// - package prices
function formatNumber(_number) {}
function getLocalIP() {
	var interfaces = node_os_1.default.networkInterfaces()
	for (var _i = 0, _a = Object.keys(interfaces); _i < _a.length; _i++) {
		var name_1 = _a[_i]
		for (var _b = 0, _c = interfaces[name_1] || []; _b < _c.length; _b++) {
			var iface = _c[_b]
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address
			}
		}
	}
	return '127.0.0.1'
}
