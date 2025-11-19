import fs from 'node:fs'
import path from 'node:path'

const dependencies = [
	{
		src: 'node_modules/htmx.org/dist/htmx.js',
		dest: 'public/htmx.js',
	},
	{
		src: 'node_modules/alpinejs/dist/cdn.js',
		dest: 'public/alpine.js',
	},
	{
		src: 'node_modules/signature_pad/dist/signature_pad.umd.js',
		dest: 'public/signature_pad.js',
	},
]

dependencies.forEach(({ src, dest }) => {
	const fullSrc = path.resolve(src)
	const fullDest = path.resolve(dest)
	try {
		if (fs.existsSync(fullSrc)) {
			fs.copyFileSync(fullSrc, fullDest)
			console.log(`Copied ${src} to ${dest}`)
		} else {
			console.error(`Source not found: ${src}`)
		}
	} catch (error) {
		console.error(`Error copying ${src} to ${dest}:`, error)
	}
})
