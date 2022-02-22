import fs from 'fs/promises'
import Fastify from 'fastify'
import { config } from 'dotenv'
import closeWithGrace from 'close-with-grace'
import * as path from 'path'

const dirname = path.dirname(import.meta.url.replace('file://', ''))

const template = await fs.readFile('frontend/dist/index.html', 'utf-8')

config()

const fastify = Fastify()

await fastify.register(import('./api/index.js'))
await fastify.register(import('fastify-static'), {
	root: path.join(dirname, 'frontend/dist')
})

fastify.get('*', async (req, reply) => {
	const url = req.url

	const html = await vite.transformIndexHtml(url, template)

	reply.status(200).header('Content-Type', 'text/html').send(html)
})

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, async function ({ signal, err, manual }) {
	if (err) {
		fastify.log.error(err)
	}
	await fastify.close()
})

fastify.addHook('onClose', async (instance, done) => {
	closeListeners.uninstall()
	done()
})

// Start listening.
fastify.listen(process.env.PORT || 3000, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
