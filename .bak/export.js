import fs from 'node:fs'

const txt = fs.readFileSync('export-24.csv', 'utf8')

const csv = txt.split('\n').map(line => line.trimStart().split('\t'))
const headers = csv.shift()

const json = csv.map((row) => {
	const obj = {}
	const ignore = ['NumberOfTrainings']
	const map = { Id: 'card_id', IdCard: 'gov_id' }
	headers.forEach((header, i) => {
		if (ignore.includes(header)) {
			return
		}
		if (map[header]) {
			header = map[header]
		}
		obj[header] = row[i]
	})
	return obj
})

const uniqueKeyPackage = json.reduce((acc, row) => {
	acc[row.Package] = (acc[row.Package] || 0) + 1
	// sort keys by count
	acc = Object.entries(acc).sort((a, b) => b[1] - a[1])
	return Object.fromEntries(acc)
}, {})
console.log(uniqueKeyPackage)

/**
	card_id: string | null
	created_at: string
	email: string | null
	first_name: string | null
	gov_id: string | null
	id: number
	imageUrl: string | null
	last_name: string | null
	package: string | null
	package_id: number | null
	phone: string | null
	updated_at: string
	year_of_birth: number | null
	notes: string | null
 */

function jsonToSql(json) {
	const prefix = 'insert into public.members'
	const columns = '(first_name, last_name, email, phone, package, card_id, gov_id)'
	const values = json
		.filter(row => !Object.values(row).every(value => !value || value === null))
		.map((row) => {
			const values = Object.entries(row)
				.map(([key, value]) => {
					const shortKeys = ['Name', 'LastName']
					const isEmpty = !value?.length || (!shortKeys.includes(key) && value.length <= 5)
					if (isEmpty) {
						return 'null'
					}
					if (key === 'Phone') {
						value = formatPhone(value).replace(/\+/g, '')
					}
					return `'${value.replace(/'/g, '\'\'')}'`
				})
			return `\n\t(${values.join(', ')})`
		})
		.join(',')
	return `${prefix} ${columns} values${values};`

	function formatPhone(value) {
		value = value.replace(/[/\-\s.]/g, '')
		if (value.startsWith('0')) {
			value = value.slice(1)
			return `+381${value}`
		}
		if (value.startsWith('+')) {
			return value
		}
		return `+${value}`
	}
}

const sql = jsonToSql(json)
fs.writeFileSync('seed.sql', sql)
