import { signup, login, getUser } from '../controllers/users.js'
import User from '../schemas.js'

const signupOpts = {
	schema: {
		body: {
			type: 'object',
			required: ['username', 'password', 'email'],
			properties: {
				username: { type: 'string' },
				password: { type: 'string' },
				email: { type: 'string' }
			}
		},
		response: {
			201: User
		}
	},
	handler: signup
}

const loginOpts = {
	schema: {
		body: {
			type: 'object',
			required: ['password', 'email'],
			properties: {
				password: { type: 'string' },
				email: { type: 'string' }
			}
		},
		response: {
			201: User
		}
	},
	handler: login
}

function userRoutes(fastify, options, done) {
	fastify.post('/signup/', signupOpts)
	fastify.post('/login/', loginOpts)
	fastify.get('/users/', {
		schema: {
			response: {
				201: User
			}
		},
		handler: getUser,
		onRequest: [fastify.authenticate]
	})
	done()
}

export default userRoutes
