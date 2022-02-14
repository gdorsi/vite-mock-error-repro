import { ObjectId } from 'mongodb'
export class ModelError extends Error {}

async function userModels(fastify) {
	fastify.decorate('userModels', {
		login: async (email, password) => {
			const users = fastify.mongo.db.collection('users')

			const result = await users.findOne({ email: email })
			if (result) {
				if (password === result.password) {
					const id = result._id
					return { id }
				} else {
					throw new ModelError('wrong password')
				}
			}
			throw new ModelError('user not found')
		},
		signup: async (username, password, email) => {
			const users = fastify.mongo.db.collection('users')
			const data = { username, password, email }
			const findEmail = await users.findOne({ email: email })

			if (findEmail) {
				throw new ModelError('email already in use')
			}
			const findUser = await users.findOne({ username: username })
			if (findUser) {
				throw new ModelError('username already in use')
			}
			const result = await users.insertOne(data)
			const id = result._id
			return { id }
		},
		getUser: async (id) => {
			const users = fastify.mongo.db.collection('users')

			const result = await users.findOne({ _id: new ObjectId(id) })
			if (!result) {
				throw new ModelError('user does not exist')
			} else if (result) return result
		}
	})
}

userModels[Symbol.for('skip-override')] = true

export default userModels
