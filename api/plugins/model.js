export class ModelError extends Error {}

async function model(fastify) {
	fastify.decorate('model', {
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
		}
	})
}

model[Symbol.for('skip-override')] = true

export default model
