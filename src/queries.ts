import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient, type InValue } from '@libsql/client'
import type { Member, Package, User, Visit } from './types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isTest = false // process.env.NODE_ENV === 'test'
console.log('isTest:', isTest, 'NODE_ENV:', process.env.NODE_ENV)

let dbPath: string | undefined
if (process.env.DB_PATH) {
	// Provided via env var (e.g. from main.js user selection)
	dbPath = process.env.DB_PATH
} else if (process.env.ELECTRON_RUN_AS_NODE) {
	// PRODUCTION: Running inside the packaged app
	// The file structure in resources is flat for extraResources:
	// resources/
	//   ├── dist/server.js
	//   ├── db/
	//   └── public/
	dbPath = path.join(process.cwd(), '..', 'db', 'adrenalin.db')
	// Note: When spawned via electron, cwd is usually the app root or resources root depending on OS.
	// A safer bet is usually passing it from main.js, but let's try to resolve relative to this file.
	// If this file is in resources/dist/server.js, then ../db/adrenalin.db is resources/db/adrenalin.db
	dbPath = path.resolve(__dirname, '../db/adrenalin.db')
} else {
	// DEVELOPMENT
	const configPath = path.resolve(__dirname, '../config.json')
	if (fs.existsSync(configPath)) {
		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
		dbPath = config.dbPath
	}
	if (!dbPath) {
		dbPath = path.resolve(__dirname, '../db/adrenalin.db')
	}
}

const dbUrl = isTest ? ':memory:' : `file:${dbPath}`
console.log('dbUrl:', dbUrl)
// --- FIX END ---

const schemaPath = process.env.ELECTRON_RUN_AS_NODE
	? path.resolve(__dirname, '../schema.sqlite')
	: path.resolve(__dirname, '../db/schema.sqlite')
const seedPath = process.env.ELECTRON_RUN_AS_NODE
	? path.resolve(__dirname, '../seed.sqlite')
	: path.resolve(__dirname, '../db/seed.sqlite')

// Ensure the database directory exists
if (!isTest && dbPath) {
	const dbDir = path.dirname(dbPath)
	if (!fs.existsSync(dbDir)) {
		fs.mkdirSync(dbDir, { recursive: true })
	}
}

console.log('final dbPath:', dbPath, 'dbUrl:', dbUrl)

export const db = createClient({ url: dbUrl })

export async function initDb() {
	await db.execute('PRAGMA journal_mode = WAL')

	if (!isTest) {
		const rs = await db.execute("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='members'")
		const tableCheck = rs.rows[0] as unknown as { count: number }

		if (tableCheck.count === 0) {
			console.log('Initializing new database at:', dbPath)
			const schemaSql = fs.readFileSync(schemaPath, 'utf8')
			await db.executeMultiple(schemaSql)
			// Insert default admin user
			await db.execute({
				sql: 'INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)',
				args: ['admin', '$2b$10$RIg0/m/lxZRhLTllIWuCO.CzoRC5vhIDoCo1RnN2lKVuu6v20l75y', 'admin'],
			})
		}
	}

	if (isTest) {
		const schemaSql = fs.readFileSync(schemaPath, 'utf8')
		const seedSql = fs.readFileSync(seedPath, 'utf8')
		await db.executeMultiple(schemaSql)
		await db.executeMultiple(seedSql)
	}
}

export async function getMembers(): Promise<Member[]> {
	const rs = await db.execute('SELECT * FROM members ORDER BY updated_at DESC')
	return rs.rows as unknown as Member[]
}

export async function getMembersWithSignatures(): Promise<Member[]> {
	const rs = await db.execute('SELECT * FROM members WHERE signature IS NOT NULL ORDER BY id ASC')
	return rs.rows as unknown as Member[]
}

export async function getMembersPaginated(page: number, limit: number): Promise<Member[]> {
	const offset = (page - 1) * limit
	const rs = await db.execute({
		sql: 'SELECT * FROM members ORDER BY updated_at DESC LIMIT ? OFFSET ?',
		args: [limit, offset],
	})
	return rs.rows as unknown as Member[]
}

export async function getMembersCount(): Promise<number> {
	const rs = await db.execute('SELECT COUNT(*) as count FROM members')
	return (rs.rows[0] as unknown as { count: number }).count
}

export async function getMember(id: number): Promise<Member | undefined> {
	const rs = await db.execute({
		sql: 'SELECT * FROM members WHERE id = ?',
		args: [id],
	})
	return rs.rows[0] as unknown as Member | undefined
}

export async function searchMembers(query: string): Promise<Member[]> {
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

	const rs = await db.execute({ sql, args: params })
	return rs.rows as unknown as Member[]
}

export async function searchMembersPaginated(query: string, page: number, limit: number): Promise<Member[]> {
	const words = query
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
	if (words.length === 0) return []

	const conditions: string[] = []
	const params: (string | number)[] = []
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
	params.push(limit, offset)

	const rs = await db.execute(sql, params)
	return rs.rows as unknown as Member[]
}

export async function searchMembersCount(query: string): Promise<number> {
	const words = query
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
	if (words.length === 0) return 0

	const conditions: string[] = []
	const params: InValue[] = []
	words.forEach((word) => {
		const wordParam = `%${word}%`
		conditions.push(`(first_name LIKE ? OR last_name LIKE ? OR card_id LIKE ?)`)
		params.push(wordParam, wordParam, wordParam)
	})

	const sql = `SELECT COUNT(*) as count FROM members WHERE ${conditions.join(' AND ')}`
	const rs = await db.execute(sql, params)
	return (rs.rows[0] as unknown as { count: number }).count
}

export async function getVisits(): Promise<Array<Visit & Pick<Member, 'first_name' | 'last_name'>>> {
	const rs = await db.execute(`
		SELECT v.*, m.first_name, m.last_name
		FROM visits v
		JOIN members m ON v.member_id = m.id
		ORDER BY v.created_at DESC
	`)
	return rs.rows as unknown as Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
}

export async function getVisitsPaginated(
	page: number,
	limit: number,
): Promise<Array<Visit & Pick<Member, 'first_name' | 'last_name'>>> {
	const offset = (page - 1) * limit
	const rs = await db.execute({
		sql: `
		SELECT v.*, m.first_name, m.last_name
		FROM visits v
		JOIN members m ON v.member_id = m.id
		ORDER BY v.created_at DESC
		LIMIT ? OFFSET ?
	`,
		args: [limit, offset],
	})
	return rs.rows as unknown as Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
}

export async function getVisitsCount(): Promise<number> {
	const rs = await db.execute('SELECT COUNT(*) as count FROM visits')
	return (rs.rows[0] as unknown as { count: number }).count
}

export async function searchVisitsPaginated(
	query: string,
	page: number,
	limit: number,
): Promise<Array<Visit & Pick<Member, 'first_name' | 'last_name'>>> {
	const words = query
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
	if (words.length === 0) return []

	const conditions: string[] = []
	const params: InValue[] = []
	words.forEach((word) => {
		const wordParam = `%${word}%`
		conditions.push(`(m.first_name LIKE ? OR m.last_name LIKE ?)`)
		params.push(wordParam, wordParam)
	})

	const offset = (page - 1) * limit
	const sql = `
		SELECT v.*, m.first_name, m.last_name
		FROM visits v
		JOIN members m ON v.member_id = m.id
		WHERE ${conditions.join(' AND ')}
		ORDER BY v.created_at DESC
		LIMIT ? OFFSET ?
	`
	params.push(limit, offset)

	const rs = await db.execute(sql, params)
	return rs.rows as unknown as Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
}

export async function searchVisitsCount(query: string): Promise<number> {
	const words = query
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
	if (words.length === 0) return 0

	const conditions: string[] = []
	const params: InValue[] = []
	words.forEach((word) => {
		const wordParam = `%${word}%`
		conditions.push(`(m.first_name LIKE ? OR m.last_name LIKE ?)`)
		params.push(wordParam, wordParam)
	})

	const sql = `SELECT COUNT(*) as count FROM visits v JOIN members m ON v.member_id = m.id WHERE ${conditions.join(' AND ')}`
	const rs = await db.execute(sql, params)
	return (rs.rows[0] as unknown as { count: number }).count
}

export async function getVisitsByMemberId(
	memberId: number,
): Promise<Array<Visit & Pick<Member, 'first_name' | 'last_name'>>> {
	const rs = await db.execute({
		sql: `
		SELECT v.*, m.first_name, m.last_name
		FROM visits v
		JOIN members m ON v.member_id = m.id
		WHERE v.member_id = ?
		ORDER BY v.created_at DESC
	`,
		args: [memberId],
	})
	return rs.rows as unknown as Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
}

export async function getPackages(): Promise<Package[]> {
	const rs = await db.execute('SELECT * FROM packages ORDER BY display_order ASC')
	return rs.rows as unknown as Package[]
}

export async function addVisit(memberId: number): Promise<void> {
	await db.execute({
		sql: 'INSERT INTO visits (member_id) VALUES (?)',
		args: [memberId],
	})

	await db.execute({
		sql: 'UPDATE members SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
		args: [memberId],
	})
}

export async function addMember(
	member: Omit<Member, 'id' | 'updated_at' | 'expires_at' | 'created_at'>,
): Promise<number> {
	const rs = await db.execute({
		sql: `
		INSERT INTO members (first_name, last_name, email, phone, card_id, gov_id, package_id, expires_at, image, signature, notes, address_street, address_number, address_city, guardian, guardian_first_name, guardian_last_name, guardian_gov_id, notify, year_of_birth)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		args: [
			member.first_name,
			member.last_name,
			member.email || null,
			member.phone || null,
			member.card_id,
			member.gov_id || null,
			member.package_id || null,
			null,
			member.image || null,
			member.signature || null,
			member.notes || null,
			member.address_street || null,
			member.address_number || null,
			member.address_city || null,
			member.guardian,
			member.guardian_first_name || null,
			member.guardian_last_name || null,
			member.guardian_gov_id || null,
			member.notify,
			member.year_of_birth || null,
		],
	})
	return Number(rs.lastInsertRowid)
}

export async function updateMember(id: number, member: Partial<Member>): Promise<void> {
	const fields = Object.keys(member).filter((key) => key !== 'id' && key !== 'updated_at')
	const setClause = fields.map((field) => `${field} = ?`).join(', ')
	const values = fields.map((field) => {
		const val = member[field as keyof Member]
		return val === undefined ? null : val
	})
	values.push(id)
	await db.execute({
		sql: `UPDATE members SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
		args: values,
	})
}

export async function deleteMember(id: number): Promise<void> {
	await db.execute({
		sql: 'DELETE FROM members WHERE id = ?',
		args: [id],
	})
}

export async function deleteVisit(id: number): Promise<void> {
	await db.execute({
		sql: 'DELETE FROM visits WHERE id = ?',
		args: [id],
	})
}

export async function addPackage(pkg: Omit<Package, 'id' | 'created_at'>): Promise<number> {
	const rs = await db.execute({
		sql: 'INSERT INTO packages (name, price, description, display_order) VALUES (?, ?, ?, ?)',
		args: [pkg.name, pkg.price || null, pkg.description || null, pkg.display_order || null],
	})
	return Number(rs.lastInsertRowid)
}

export async function updatePackage(id: number, pkg: Partial<Package>): Promise<void> {
	const fields = Object.keys(pkg).filter((key) => key !== 'id' && key !== 'created_at')
	const setClause = fields.map((field) => `${field} = ?`).join(', ')
	const values = fields.map((field) => {
		const val = pkg[field as keyof Package]
		return val === undefined ? null : val
	})
	values.push(id)
	await db.execute({
		sql: `UPDATE packages SET ${setClause} WHERE id = ?`,
		args: values,
	})
}

export async function deletePackage(id: number): Promise<void> {
	await db.execute({
		sql: 'DELETE FROM packages WHERE id = ?',
		args: [id],
	})
}

export async function getMembersWithUpcomingExpiries(days: number = 7): Promise<Member[]> {
	const rs = await db.execute({
		sql: `
		SELECT * FROM members
		WHERE expires_at BETWEEN date('now') AND date('now', ?)
		AND notify = 1
	    `,
		args: [`+${days} days`],
	})
	return rs.rows as unknown as Member[]
}

export async function logMessage(
	memberId: number,
	subject: string,
	message: string,
	method: string = 'email',
): Promise<void> {
	await db.execute({
		sql: 'INSERT INTO messages (member_id, subject, message, method) VALUES (?, ?, ?, ?)',
		args: [memberId, subject, message, method],
	})
}

export async function cardIdExists(cardId: string): Promise<boolean> {
	const rs = await db.execute({
		sql: 'SELECT COUNT(*) as count FROM members WHERE card_id = ?',
		args: [cardId],
	})
	return (rs.rows[0] as unknown as { count: number }).count > 0
}

export async function govIdExists(govId: string): Promise<boolean> {
	const rs = await db.execute({
		sql: 'SELECT COUNT(*) as count FROM members WHERE gov_id = ?',
		args: [govId],
	})
	return (rs.rows[0] as unknown as { count: number }).count > 0
}

export async function getUsers(): Promise<User[]> {
	const rs = await db.execute('SELECT id, username, role, created_at, updated_at FROM users ORDER BY created_at DESC')
	return rs.rows as unknown as User[]
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
	const rs = await db.execute({
		sql: 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
		args: [user.username, user.password_hash, user.role],
	})
	return Number(rs.lastInsertRowid)
}

export async function updateUser(id: number, user: Partial<User>): Promise<void> {
	const fields = Object.keys(user).filter((key) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
	const setClause = fields.map((field) => `${field} = ?`).join(', ')
	const values: InValue[] = fields.map((field) => user[field as keyof User] ?? null)
	values.push(id)
	await db.execute({
		sql: `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
		args: values,
	})
}

export async function deleteUser(id: number): Promise<void> {
	await db.execute({
		sql: 'DELETE FROM users WHERE id = ?',
		args: [id],
	})
}

export async function usernameExists(username: string): Promise<boolean> {
	const rs = await db.execute({
		sql: 'SELECT COUNT(*) as count FROM users WHERE username = ?',
		args: [username],
	})
	return (rs.rows[0] as unknown as { count: number }).count > 0
}
