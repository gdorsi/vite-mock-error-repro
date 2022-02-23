import Fastify from 'fastify'
import { config } from 'dotenv'
import * as path from 'path'

config({
	path: path.resolve(path.dirname(import.meta.url.replace('file://', '')), '../.env')
})

const fastify = Fastify()
fastify.register(import('./index.js'))

try {
	await fastify.listen(3000)
} catch (err) {
	fastify.log.error(err)
	process.exit(1)
}
