import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../db/adrenalin.db')
const schemaPath = path.resolve(__dirname, '../db/schema.sqlite')
const seedPath = path.resolve(__dirname, '../db/seed.sqlite')
const schemaFile = fs.readFileSync(schemaPath, 'utf8')
const seedFile = fs.readFileSync(seedPath, 'utf8')

const cmd = process.argv[2]

if (!cmd || !['init', 'migrate', 'seed'].includes(cmd)) {
	console.error('Usage: node setup.js <init|migrate|seed>')
	process.exit(1)
}

if (cmd === 'init') {
	if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath)
	const db = new Database(dbPath)
	db.exec(schemaFile)
	db.pragma('foreign_keys = OFF')
	db.exec(seedFile)
	db.pragma('foreign_keys = ON')
	db.close()
	console.log('Database initialized and seeded.')
	process.exit(0)
}

if (cmd === 'migrate') {
	if (!fs.existsSync(dbPath)) {
		console.error('Database not found. Run `init` first.')
		process.exit(1)
	}
	const db = new Database(dbPath)
	db.exec(schemaFile)
	db.close()
	console.log('Database migrated.')
	process.exit(0)
}

if (cmd === 'seed') {
	if (!fs.existsSync(dbPath)) {
		console.error('Database not found. Run `init` first.')
		process.exit(1)
	}
	const db = new Database(dbPath)
	db.pragma('foreign_keys = OFF')
	db.exec(seedFile)
	db.pragma('foreign_keys = ON')
	db.close()
	console.log('Database seeded.')
	process.exit(0)
}
