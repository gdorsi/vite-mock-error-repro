import fs from 'fs/promises'
import { createServer } from 'vite'

async function devServer(fastify, options) {
	await fastify.register(import('./api/index.js'))

	await fastify.register(import('fastify-express'))

	const vite = await createServer({
		server: { middlewareMode: 'ssr' }
	})

	fastify.use(vite.middlewares)

	fastify.get('*', async (req, reply) => {
		const url = req.url

		const template = await fs.readFile('frontend/index.html', 'utf-8')

		const html = await vite.transformIndexHtml(url, template)

		reply.status(200).header('Content-Type', 'text/html').send(html)
	})

	return fastify
}

export default devServer
