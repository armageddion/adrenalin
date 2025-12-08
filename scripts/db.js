import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'

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

const dbUrl = `file:${dbPath}`

if (cmd === 'init') {
	if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath)
	const db = createClient({ url: dbUrl })
	await db.executeMultiple(schemaFile)
	await db.execute('PRAGMA foreign_keys = OFF')
	await db.executeMultiple(seedFile)
	await db.execute('PRAGMA foreign_keys = ON')
	db.close()
	console.log('Database initialized and seeded.')
	process.exit(0)
}

if (cmd === 'migrate') {
	if (!fs.existsSync(dbPath)) {
		console.error('Database not found. Run `init` first.')
		process.exit(1)
	}
	const db = createClient({ url: dbUrl })
	await db.executeMultiple(schemaFile)
	// Add signature column if it doesn't exist
	try {
		await db.execute('ALTER TABLE members ADD COLUMN signature TEXT;')
		console.log('Added signature column to members table.')
	} catch (_err) {
		// Column might already exist, ignore error
		console.log('Signature column already exists or could not be added.')
	}
	db.close()
	console.log('Database migrated.')
	process.exit(0)
}

if (cmd === 'seed') {
	if (!fs.existsSync(dbPath)) {
		console.error('Database not found. Run `init` first.')
		process.exit(1)
	}
	const db = createClient({ url: dbUrl })
	await db.execute('PRAGMA foreign_keys = OFF')
	await db.executeMultiple(seedFile)
	await db.execute('PRAGMA foreign_keys = ON')
	db.close()
	console.log('Database seeded.')
	process.exit(0)
}
