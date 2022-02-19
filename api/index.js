import Fastify from 'fastify'

import dotenv from 'dotenv'

dotenv.config()

function buildServer(config) {
	const opts = {
		...config,
		logger: {
			level: config.LOG_LEVEL,
			prettyPrint: config.PRETTY_PRINT
		}
	}

	const fastify = Fastify(opts)

	fastify.register(import('fastify-mongodb'), {
		forceClose: true,
		url: process.env.DB_URL
	})

	fastify.register(import('./plugins/authenticate.js'))
	fastify.register(import('./plugins/userModels.js'))
	fastify.register(import('./plugins/boardModels.js'))
	fastify.register(import('./routes/users.js'))
	fastify.register(import('./routes/boards.js'))
	fastify.register(import('./routes/tasks.js'))
	return fastify
}

export default buildServer
