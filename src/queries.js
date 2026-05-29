var __awaiter =
	(this && this.__awaiter) ||
	((thisArg, _arguments, P, generator) => {
		function adopt(value) {
			return value instanceof P
				? value
				: new P((resolve) => {
						resolve(value)
					})
		}
		return new (P || (P = Promise))((resolve, reject) => {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator.throw(value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	})
var __generator =
	(this && this.__generator) ||
	((thisArg, body) => {
		var _ = {
				label: 0,
				sent: () => {
					if (t[0] & 1) throw t[1]
					return t[1]
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype)
		return (
			(g.next = verb(0)),
			(g.throw = verb(1)),
			(g.return = verb(2)),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this
				}),
			g
		)
		function verb(n) {
			return (v) => step([n, v])
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.')
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t
					if (((y = 0), t)) op = [op[0] & 2, t.value]
					switch (op[0]) {
						case 0:
						case 1:
							t = op
							break
						case 4:
							_.label++
							return { value: op[1], done: false }
						case 5:
							_.label++
							y = op[1]
							op = [0]
							continue
						case 7:
							op = _.ops.pop()
							_.trys.pop()
							continue
						default:
							if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
								_ = 0
								continue
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1]
								break
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1]
								t = op
								break
							}
							if (t && _.label < t[2]) {
								_.label = t[2]
								_.ops.push(op)
								break
							}
							if (t[2]) _.ops.pop()
							_.trys.pop()
							continue
					}
					op = body.call(thisArg, _)
				} catch (e) {
					op = [6, e]
					y = 0
				} finally {
					f = t = 0
				}
			if (op[0] & 5) throw op[1]
			return { value: op[0] ? op[1] : void 0, done: true }
		}
	})
Object.defineProperty(exports, '__esModule', { value: true })
exports.db = void 0
exports.initDb = initDb
exports.getMembers = getMembers
exports.getMembersWithSignatures = getMembersWithSignatures
exports.getMembersPaginated = getMembersPaginated
exports.getMembersCount = getMembersCount
exports.getMember = getMember
exports.searchMembers = searchMembers
exports.searchMembersPaginated = searchMembersPaginated
exports.searchMembersCount = searchMembersCount
exports.getVisits = getVisits
exports.getVisitsPaginated = getVisitsPaginated
exports.getVisitsCount = getVisitsCount
exports.searchVisitsPaginated = searchVisitsPaginated
exports.searchVisitsCount = searchVisitsCount
exports.getVisitsByMemberId = getVisitsByMemberId
exports.getPackages = getPackages
exports.addVisit = addVisit
exports.addMember = addMember
exports.updateMember = updateMember
exports.deleteMember = deleteMember
exports.deleteVisit = deleteVisit
exports.addPackage = addPackage
exports.updatePackage = updatePackage
exports.deletePackage = deletePackage
exports.getMembersWithUpcomingExpiries = getMembersWithUpcomingExpiries
exports.logMessage = logMessage
exports.cardIdExists = cardIdExists
exports.govIdExists = govIdExists
exports.getUsers = getUsers
exports.createUser = createUser
exports.updateUser = updateUser
exports.deleteUser = deleteUser
exports.usernameExists = usernameExists
var node_fs_1 = require('node:fs')
var node_path_1 = require('node:path')
var node_url_1 = require('node:url')
var client_1 = require('@libsql/client')
var __dirname = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url))
var isTest = process.env.NODE_ENV === 'test'
console.log('isTest:', isTest, 'NODE_ENV:', process.env.NODE_ENV)
var dbPath
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
	dbPath = node_path_1.default.join(process.cwd(), '..', 'db', 'adrenalin.db')
	// Note: When spawned via electron, cwd is usually the app root or resources root depending on OS.
	// A safer bet is usually passing it from main.js, but let's try to resolve relative to this file.
	// If this file is in resources/dist/server.js, then ../db/adrenalin.db is resources/db/adrenalin.db
	dbPath = node_path_1.default.resolve(__dirname, '../db/adrenalin.db')
} else {
	// DEVELOPMENT
	var configPath = node_path_1.default.resolve(__dirname, '../config.json')
	if (node_fs_1.default.existsSync(configPath)) {
		var config = JSON.parse(node_fs_1.default.readFileSync(configPath, 'utf8'))
		dbPath = config.dbPath
	}
	if (!dbPath) {
		dbPath = node_path_1.default.resolve(__dirname, '../db/adrenalin.db')
	}
}
var dbUrl = isTest ? ':memory:' : 'file:'.concat(dbPath)
console.log('dbUrl:', dbUrl)
// --- FIX END ---
var schemaPath = process.env.ELECTRON_RUN_AS_NODE
	? node_path_1.default.resolve(__dirname, '../schema.sqlite')
	: node_path_1.default.resolve(__dirname, '../db/schema.sqlite')
var seedPath = process.env.ELECTRON_RUN_AS_NODE
	? node_path_1.default.resolve(__dirname, '../seed.sqlite')
	: node_path_1.default.resolve(__dirname, '../db/seed.sqlite')
// Ensure the database directory exists
if (!isTest && dbPath) {
	var dbDir = node_path_1.default.dirname(dbPath)
	if (!node_fs_1.default.existsSync(dbDir)) {
		node_fs_1.default.mkdirSync(dbDir, { recursive: true })
	}
}
console.log('final dbPath:', dbPath, 'dbUrl:', dbUrl)
exports.db = (0, client_1.createClient)({ url: dbUrl })
function initDb() {
	return __awaiter(this, void 0, void 0, function () {
		var rs, tableCheck, _schemaSql, schemaSql, seedSql
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, exports.db.execute('PRAGMA journal_mode = WAL')]
				case 1:
					_a.sent()
					if (isTest) return [3 /*break*/, 5]
					return [
						4 /*yield*/,
						exports.db.execute("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='members'"),
					]
				case 2:
					rs = _a.sent()
					tableCheck = rs.rows[0]
					if (!(tableCheck.count === 0)) return [3 /*break*/, 5]
					console.log('Initializing new database at:', dbPath)
					schemaSql = node_fs_1.default.readFileSync(schemaPath, 'utf8')
					return [
						4 /*yield*/,
						exports.db.executeMultiple(schemaSql),
						// Insert default admin user
					]
				case 3:
					_a.sent()
					// Insert default admin user
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)',
							args: ['admin', '$2b$10$RIg0/m/lxZRhLTllIWuCO.CzoRC5vhIDoCo1RnN2lKVuu6v20l75y', 'admin'],
						}),
					]
				case 4:
					// Insert default admin user
					_a.sent()
					_a.label = 5
				case 5:
					if (!isTest) return [3 /*break*/, 8]
					schemaSql = node_fs_1.default.readFileSync(schemaPath, 'utf8')
					seedSql = node_fs_1.default.readFileSync(seedPath, 'utf8')
					return [4 /*yield*/, exports.db.executeMultiple(schemaSql)]
				case 6:
					_a.sent()
					return [4 /*yield*/, exports.db.executeMultiple(seedSql)]
				case 7:
					_a.sent()
					_a.label = 8
				case 8:
					return [2 /*return*/]
			}
		})
	})
}
function getMembers() {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, exports.db.execute('SELECT * FROM members ORDER BY updated_at DESC')]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function getMembersWithSignatures() {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, exports.db.execute('SELECT * FROM members WHERE signature IS NOT NULL ORDER BY id ASC')]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function getMembersPaginated(page, limit) {
	return __awaiter(this, void 0, void 0, function () {
		var offset, rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					offset = (page - 1) * limit
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'SELECT * FROM members ORDER BY updated_at DESC LIMIT ? OFFSET ?',
							args: [limit, offset],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function getMembersCount() {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, exports.db.execute('SELECT COUNT(*) as count FROM members')]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0].count]
			}
		})
	})
}
function getMember(id) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'SELECT * FROM members WHERE id = ?',
							args: [id],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0]]
			}
		})
	})
}
function searchMembers(query) {
	return __awaiter(this, void 0, void 0, function () {
		var words, conditions, params, sql, rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					words = query
						.trim()
						.split(/\s+/)
						.filter((word) => word.length > 0)
					if (words.length === 0) return [2 /*return*/, []]
					conditions = []
					params = []
					words.forEach((word) => {
						var wordParam = '%'.concat(word, '%')
						conditions.push('(first_name LIKE ? OR last_name LIKE ? OR card_id LIKE ?)')
						params.push(wordParam, wordParam, wordParam)
					})
					sql = '\n\t\tSELECT * FROM members\n\t\tWHERE '.concat(
						conditions.join(' AND '),
						'\n\t\tORDER BY updated_at DESC\n\t',
					)
					return [4 /*yield*/, exports.db.execute({ sql: sql, args: params })]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function searchMembersPaginated(query, page, limit) {
	return __awaiter(this, void 0, void 0, function () {
		var words, conditions, params, offset, sql, rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					words = query
						.trim()
						.split(/\s+/)
						.filter((word) => word.length > 0)
					if (words.length === 0) return [2 /*return*/, []]
					conditions = []
					params = []
					words.forEach((word) => {
						var wordParam = '%'.concat(word, '%')
						conditions.push('(first_name LIKE ? OR last_name LIKE ? OR card_id LIKE ?)')
						params.push(wordParam, wordParam, wordParam)
					})
					offset = (page - 1) * limit
					sql = '\n\t\tSELECT * FROM members\n\t\tWHERE '.concat(
						conditions.join(' AND '),
						'\n\t\tORDER BY updated_at DESC\n\t\tLIMIT ? OFFSET ?\n\t',
					)
					params.push(limit, offset)
					return [4 /*yield*/, exports.db.execute(sql, params)]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function searchMembersCount(query) {
	return __awaiter(this, void 0, void 0, function () {
		var words, conditions, params, sql, rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					words = query
						.trim()
						.split(/\s+/)
						.filter((word) => word.length > 0)
					if (words.length === 0) return [2 /*return*/, 0]
					conditions = []
					params = []
					words.forEach((word) => {
						var wordParam = '%'.concat(word, '%')
						conditions.push('(first_name LIKE ? OR last_name LIKE ? OR card_id LIKE ?)')
						params.push(wordParam, wordParam, wordParam)
					})
					sql = 'SELECT COUNT(*) as count FROM members WHERE '.concat(conditions.join(' AND '))
					return [4 /*yield*/, exports.db.execute(sql, params)]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0].count]
			}
		})
	})
}
function getVisits() {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute(
							'\n\t\tSELECT v.*, m.first_name, m.last_name\n\t\tFROM visits v\n\t\tJOIN members m ON v.member_id = m.id\n\t\tORDER BY v.created_at DESC\n\t',
						),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function getVisitsPaginated(page, limit) {
	return __awaiter(this, void 0, void 0, function () {
		var offset, rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					offset = (page - 1) * limit
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: '\n\t\tSELECT v.*, m.first_name, m.last_name\n\t\tFROM visits v\n\t\tJOIN members m ON v.member_id = m.id\n\t\tORDER BY v.created_at DESC\n\t\tLIMIT ? OFFSET ?\n\t',
							args: [limit, offset],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function getVisitsCount() {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, exports.db.execute('SELECT COUNT(*) as count FROM visits')]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0].count]
			}
		})
	})
}
function searchVisitsPaginated(query, page, limit) {
	return __awaiter(this, void 0, void 0, function () {
		var words, conditions, params, offset, sql, rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					words = query
						.trim()
						.split(/\s+/)
						.filter((word) => word.length > 0)
					if (words.length === 0) return [2 /*return*/, []]
					conditions = []
					params = []
					words.forEach((word) => {
						var wordParam = '%'.concat(word, '%')
						conditions.push('(m.first_name LIKE ? OR m.last_name LIKE ?)')
						params.push(wordParam, wordParam)
					})
					offset = (page - 1) * limit
					sql =
						'\n\t\tSELECT v.*, m.first_name, m.last_name\n\t\tFROM visits v\n\t\tJOIN members m ON v.member_id = m.id\n\t\tWHERE '.concat(
							conditions.join(' AND '),
							'\n\t\tORDER BY v.created_at DESC\n\t\tLIMIT ? OFFSET ?\n\t',
						)
					params.push(limit, offset)
					return [4 /*yield*/, exports.db.execute(sql, params)]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function searchVisitsCount(query) {
	return __awaiter(this, void 0, void 0, function () {
		var words, conditions, params, sql, rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					words = query
						.trim()
						.split(/\s+/)
						.filter((word) => word.length > 0)
					if (words.length === 0) return [2 /*return*/, 0]
					conditions = []
					params = []
					words.forEach((word) => {
						var wordParam = '%'.concat(word, '%')
						conditions.push('(m.first_name LIKE ? OR m.last_name LIKE ?)')
						params.push(wordParam, wordParam)
					})
					sql = 'SELECT COUNT(*) as count FROM visits v JOIN members m ON v.member_id = m.id WHERE '.concat(
						conditions.join(' AND '),
					)
					return [4 /*yield*/, exports.db.execute(sql, params)]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0].count]
			}
		})
	})
}
function getVisitsByMemberId(memberId) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: '\n\t\tSELECT v.*, m.first_name, m.last_name\n\t\tFROM visits v\n\t\tJOIN members m ON v.member_id = m.id\n\t\tWHERE v.member_id = ?\n\t\tORDER BY v.created_at DESC\n\t',
							args: [memberId],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function getPackages() {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, exports.db.execute('SELECT * FROM packages ORDER BY display_order ASC')]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function addVisit(memberId) {
	return __awaiter(this, void 0, void 0, function () {
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'INSERT INTO visits (member_id) VALUES (?)',
							args: [memberId],
						}),
					]
				case 1:
					_a.sent()
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'UPDATE members SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
							args: [memberId],
						}),
					]
				case 2:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function addMember(member) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: '\n\t\tINSERT INTO members (first_name, last_name, email, phone, card_id, gov_id, package_id, expires_at, image, signature, notes, address_street, address_number, address_city, guardian, guardian_first_name, guardian_last_name, guardian_gov_id, notify, year_of_birth)\n\t\tVALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n\t',
							args: [
								member.first_name,
								member.last_name,
								member.email || null,
								member.phone || null,
								member.card_id,
								member.gov_id || null,
								member.package_id || null,
								member.expires_at || null,
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
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, Number(rs.lastInsertRowid)]
			}
		})
	})
}
function updateMember(id, member) {
	return __awaiter(this, void 0, void 0, function () {
		var fields, setClause, values
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					fields = Object.keys(member).filter((key) => key !== 'id' && key !== 'updated_at')
					setClause = fields.map((field) => ''.concat(field, ' = ?')).join(', ')
					values = fields.map((field) => {
						var val = member[field]
						return val === undefined ? null : val
					})
					values.push(id)
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'UPDATE members SET '.concat(setClause, ', updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
							args: values,
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function deleteMember(id) {
	return __awaiter(this, void 0, void 0, function () {
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'DELETE FROM members WHERE id = ?',
							args: [id],
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function deleteVisit(id) {
	return __awaiter(this, void 0, void 0, function () {
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'DELETE FROM visits WHERE id = ?',
							args: [id],
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function addPackage(pkg) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'INSERT INTO packages (name, price, description, display_order) VALUES (?, ?, ?, ?)',
							args: [pkg.name, pkg.price || null, pkg.description || null, pkg.display_order || null],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, Number(rs.lastInsertRowid)]
			}
		})
	})
}
function updatePackage(id, pkg) {
	return __awaiter(this, void 0, void 0, function () {
		var fields, setClause, values
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					fields = Object.keys(pkg).filter((key) => key !== 'id' && key !== 'created_at')
					setClause = fields.map((field) => ''.concat(field, ' = ?')).join(', ')
					values = fields.map((field) => {
						var val = pkg[field]
						return val === undefined ? null : val
					})
					values.push(id)
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'UPDATE packages SET '.concat(setClause, ' WHERE id = ?'),
							args: values,
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function deletePackage(id) {
	return __awaiter(this, void 0, void 0, function () {
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'DELETE FROM packages WHERE id = ?',
							args: [id],
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function getMembersWithUpcomingExpiries() {
	return __awaiter(this, arguments, void 0, function (days) {
		var rs
		if (days === void 0) {
			days = 7
		}
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: "\n\t\tSELECT * FROM members\n\t\tWHERE expires_at BETWEEN date('now') AND date('now', ?)\n\t\tAND notify = 1\n\t    ",
							args: ['+'.concat(days, ' days')],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function logMessage(_memberId_1, _subject_1, _message_1) {
	return __awaiter(this, arguments, void 0, function (memberId, subject, message, method) {
		if (method === void 0) {
			method = 'email'
		}
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'INSERT INTO messages (member_id, subject, message, method) VALUES (?, ?, ?, ?)',
							args: [memberId, subject, message, method],
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function cardIdExists(cardId) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'SELECT COUNT(*) as count FROM members WHERE card_id = ?',
							args: [cardId],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0].count > 0]
			}
		})
	})
}
function govIdExists(govId) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'SELECT COUNT(*) as count FROM members WHERE gov_id = ?',
							args: [govId],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0].count > 0]
			}
		})
	})
}
function getUsers() {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute('SELECT id, username, role, created_at, updated_at FROM users ORDER BY created_at DESC'),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows]
			}
		})
	})
}
function createUser(user) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
							args: [user.username, user.password_hash, user.role],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, Number(rs.lastInsertRowid)]
			}
		})
	})
}
function updateUser(id, user) {
	return __awaiter(this, void 0, void 0, function () {
		var fields, setClause, values
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					fields = Object.keys(user).filter((key) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
					setClause = fields.map((field) => ''.concat(field, ' = ?')).join(', ')
					values = fields.map((field) => {
						var _a
						return (_a = user[field]) !== null && _a !== void 0 ? _a : null
					})
					values.push(id)
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'UPDATE users SET '.concat(setClause, ', updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
							args: values,
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function deleteUser(id) {
	return __awaiter(this, void 0, void 0, function () {
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'DELETE FROM users WHERE id = ?',
							args: [id],
						}),
					]
				case 1:
					_a.sent()
					return [2 /*return*/]
			}
		})
	})
}
function usernameExists(username) {
	return __awaiter(this, void 0, void 0, function () {
		var rs
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						exports.db.execute({
							sql: 'SELECT COUNT(*) as count FROM users WHERE username = ?',
							args: [username],
						}),
					]
				case 1:
					rs = _a.sent()
					return [2 /*return*/, rs.rows[0].count > 0]
			}
		})
	})
}
