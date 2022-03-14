async function apiServer(fastify) {
	fastify.register(import('fastify-mongodb'), {
		forceClose: true,
		url: process.env.DB_URL
	})

	fastify.register(import('fastify-cors'))
	fastify.register(import('./plugins/authenticate.js'))
	fastify.register(import('./plugins/userModels.js'))
	fastify.register(import('./plugins/boardModels.js'))
	fastify.register(import('./plugins/taskModels.js'))

	fastify.register(
		async (fastify) => {
			fastify.register(import('./routes/users.js'))
			fastify.register(import('./routes/boards.js'))
			fastify.register(import('./routes/tasks.js'))
		},
		{
			prefix: '/api'
		}
	)

	return fastify
}

export default apiServer
