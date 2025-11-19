import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../db/adrenalin.db')
const backupDir = path.resolve(__dirname, '../backups')

if (!fs.existsSync(dbPath)) {
	console.error('Database not found. Run `npm run setup:db` first.')
	process.exit(1)
}

if (!fs.existsSync(backupDir)) {
	fs.mkdirSync(backupDir)
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
const backupPath = path.join(backupDir, `adrenalin-${timestamp}.db`)

fs.copyFileSync(dbPath, backupPath)
console.log(`Database backed up to ${backupPath}`)
