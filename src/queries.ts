import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'
import type { Member, Package, Visit } from './types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isTest = process.env.NODE_ENV === 'test'
const dbPath = isTest ? ':memory:' : path.resolve(__dirname, '../db/adrenalin.db')
const schemaPath = path.resolve(__dirname, '../db/schema.sqlite')
const seedPath = path.resolve(__dirname, '../db/seed.sqlite')

export const db = new Database(dbPath, { readonly: false })
db.pragma('journal_mode = WAL')

if (isTest) {
	const schemaSql = fs.readFileSync(schemaPath, 'utf8')
	const seedSql = fs.readFileSync(seedPath, 'utf8')
	db.exec(schemaSql)
	db.exec(seedSql)
}

export function getMembers(): Member[] {
	const stmt = db.prepare('SELECT * FROM members ORDER BY updated_at DESC')
	return stmt.all() as Member[]
}

export function getMembersPaginated(page: number, limit: number): Member[] {
	const offset = (page - 1) * limit
	const stmt = db.prepare('SELECT * FROM members ORDER BY updated_at DESC LIMIT ? OFFSET ?')
	return stmt.all(limit, offset) as Member[]
}

export function getMembersCount(): number {
	const stmt = db.prepare('SELECT COUNT(*) as count FROM members')
	return (stmt.get() as { count: number }).count
}

export function getMember(id: number): Member | undefined {
	const stmt = db.prepare('SELECT * FROM members WHERE id = ?')
	return stmt.get(id) as Member | undefined
}

export function searchMembers(query: string): Member[] {
	const words = query
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
	if (words.length === 0) return []

	const conditions: string[] = []
	const params: string[] = []
	words.forEach((word) => {
		const wordParam = `%${word}%`
		conditions.push(`(first_name LIKE ? OR last_name LIKE ? OR card_id LIKE ?)`)
		params.push(wordParam, wordParam, wordParam)
	})

	const sql = `
		SELECT * FROM members
		WHERE ${conditions.join(' AND ')}
		ORDER BY updated_at DESC
	`

	const stmt = db.prepare(sql)
	return stmt.all(...params) as Member[]
}

export function searchMembersPaginated(query: string, page: number, limit: number): Member[] {
	const words = query
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
	if (words.length === 0) return []

	const conditions: string[] = []
	const params: string[] = []
	words.forEach((word) => {
		const wordParam = `%${word}%`
		conditions.push(`(first_name LIKE ? OR last_name LIKE ? OR card_id LIKE ?)`)
		params.push(wordParam, wordParam, wordParam)
	})

	const offset = (page - 1) * limit
	const sql = `
		SELECT * FROM members
		WHERE ${conditions.join(' AND ')}
		ORDER BY updated_at DESC
		LIMIT ? OFFSET ?
	`

	const stmt = db.prepare(sql)
	return stmt.all(...params, limit, offset) as Member[]
}

export function searchMembersCount(query: string): number {
	const words = query
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
	if (words.length === 0) return 0

	const conditions: string[] = []
	const params: string[] = []
	words.forEach((word) => {
		const wordParam = `%${word}%`
		conditions.push(`(first_name LIKE ? OR last_name LIKE ? OR card_id LIKE ?)`)
		params.push(wordParam, wordParam, wordParam)
	})

	const sql = `SELECT COUNT(*) as count FROM members WHERE ${conditions.join(' AND ')}`
	const stmt = db.prepare(sql)
	return (stmt.get(...params) as { count: number }).count
}

export function getVisits(): Array<Visit & Pick<Member, 'first_name' | 'last_name'>> {
	const stmt = db.prepare(`
		SELECT v.*, m.first_name, m.last_name
		FROM visits v
		JOIN members m ON v.member_id = m.id
		ORDER BY v.created_at DESC
	`)
	return stmt.all() as Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
}

export function getVisitsPaginated(
	page: number,
	limit: number,
): Array<Visit & Pick<Member, 'first_name' | 'last_name'>> {
	const offset = (page - 1) * limit
	const stmt = db.prepare(`
		SELECT v.*, m.first_name, m.last_name
		FROM visits v
		JOIN members m ON v.member_id = m.id
		ORDER BY v.created_at DESC
		LIMIT ? OFFSET ?
	`)
	return stmt.all(limit, offset) as Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
}

export function getVisitsCount(): number {
	const stmt = db.prepare('SELECT COUNT(*) as count FROM visits')
	return (stmt.get() as { count: number }).count
}

export function getVisitsByMemberId(memberId: number): Array<Visit & Pick<Member, 'first_name' | 'last_name'>> {
	const stmt = db.prepare(`
		SELECT v.*, m.first_name, m.last_name
		FROM visits v
		JOIN members m ON v.member_id = m.id
		WHERE v.member_id = ?
		ORDER BY v.created_at DESC
	`)
	return stmt.all(memberId) as Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
}

export function getPackages(): Package[] {
	const stmt = db.prepare('SELECT * FROM packages ORDER BY display_order ASC')
	return stmt.all() as Package[]
}

export function addVisit(memberId: number): void {
	const addVisitStmt = db.prepare('INSERT INTO visits (member_id) VALUES (?)')
	addVisitStmt.run(memberId)

	const updateMemberStmt = db.prepare('UPDATE members SET updated_at = CURRENT_TIMESTAMP WHERE id = ?')
	updateMemberStmt.run(memberId)
}

export function addMember(member: Omit<Member, 'id' | 'updated_at' | 'expires_at' | 'created_at'>): number {
	const stmt = db.prepare(`
		INSERT INTO members (first_name, last_name, email, phone, card_id, gov_id, package_id, expires_at, image, notes, address_street, address_number, address_city, guardian, guardian_first_name, guardian_last_name, guardian_gov_id, notify, year_of_birth)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	const result = stmt.run(
		member.first_name,
		member.last_name,
		member.email,
		member.phone,
		member.card_id,
		member.gov_id,
		member.package_id,
		null,
		member.image,
		member.notes,
		member.address_street,
		member.address_number,
		member.address_city,
		member.guardian,
		member.guardian_first_name,
		member.guardian_last_name,
		member.guardian_gov_id,
		member.notify,
		member.year_of_birth,
	)
	return result.lastInsertRowid as number
}

export function updateMember(id: number, member: Partial<Member>): void {
	const fields = Object.keys(member).filter((key) => key !== 'id' && key !== 'updated_at')
	const setClause = fields.map((field) => `${field} = ?`).join(', ')
	const values = fields.map((field) => member[field as keyof Member])
	values.push(id)
	const stmt = db.prepare(`UPDATE members SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
	stmt.run(...values)
}

export function deleteMember(id: number): void {
	const stmt = db.prepare('DELETE FROM members WHERE id = ?')
	stmt.run(id)
}

export function deleteVisit(id: number): void {
	const stmt = db.prepare('DELETE FROM visits WHERE id = ?')
	stmt.run(id)
}

export function addPackage(pkg: Omit<Package, 'id' | 'created_at'>): number {
	const stmt = db.prepare('INSERT INTO packages (name, price, description, display_order) VALUES (?, ?, ?, ?)')
	const result = stmt.run(pkg.name, pkg.price, pkg.description, pkg.display_order)
	return result.lastInsertRowid as number
}

export function updatePackage(id: number, pkg: Partial<Package>): void {
	const fields = Object.keys(pkg).filter((key) => key !== 'id' && key !== 'created_at')
	const setClause = fields.map((field) => `${field} = ?`).join(', ')
	const values = fields.map((field) => pkg[field as keyof Package])
	values.push(id)
	const stmt = db.prepare(`UPDATE packages SET ${setClause} WHERE id = ?`)
	stmt.run(...values)
}

export function deletePackage(id: number): void {
	const stmt = db.prepare('DELETE FROM packages WHERE id = ?')
	stmt.run(id)
}

export function getMembersWithUpcomingExpiries(days: number = 7): Member[] {
	const stmt = db.prepare(`
		SELECT * FROM members
		WHERE expires_at BETWEEN date('now') AND date('now', '+${days} days')
		AND notify = 1
	`)
	return stmt.all() as Member[]
}

export function logMessage(memberId: number, subject: string, message: string, method: string = 'email'): void {
	const stmt = db.prepare('INSERT INTO messages (member_id, subject, message, method) VALUES (?, ?, ?, ?)')
	stmt.run(memberId, subject, message, method)
}

export function getNewMembersLast30Days(): number {
	const stmt = db.prepare("SELECT COUNT(*) as count FROM members WHERE created_at >= date('now', '-30 days')")
	return (stmt.get() as { count: number }).count
}

export function getVisitsToday(): number {
	const stmt = db.prepare("SELECT COUNT(*) as count FROM visits WHERE date(created_at) = date('now')")
	return (stmt.get() as { count: number }).count
}

export function getVisitsLast7Days(): number {
	const stmt = db.prepare("SELECT COUNT(*) as count FROM visits WHERE created_at >= date('now', '-7 days')")
	return (stmt.get() as { count: number }).count
}

export function getVisitsPrevious7Days(): number {
	const stmt = db.prepare(
		"SELECT COUNT(*) as count FROM visits WHERE created_at BETWEEN date('now', '-14 days') AND date('now', '-7 days')",
	)
	return (stmt.get() as { count: number }).count
}

export function getVisitsLast30Days(): number {
	const stmt = db.prepare("SELECT COUNT(*) as count FROM visits WHERE created_at >= date('now', '-30 days')")
	return (stmt.get() as { count: number }).count
}

export function getVisitsPrevious30Days(): number {
	const stmt = db.prepare(
		"SELECT COUNT(*) as count FROM visits WHERE created_at BETWEEN date('now', '-60 days') AND date('now', '-30 days')",
	)
	return (stmt.get() as { count: number }).count
}
