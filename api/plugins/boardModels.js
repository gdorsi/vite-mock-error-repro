import { ObjectId } from 'mongodb'
export class ModelError extends Error {}

async function boardModels(fastify) {
	fastify.decorate('boardModels', {
		createBoard: async (data) => {
			const boards = fastify.mongo.db.collection('boards')

			const findName = await boards.findOne({ name: data.name }, { creator: data.creator })
			if (findName) {
				throw new ModelError('name already in use')
			}
			const result = await boards.insertOne(data)
			const createdBoard = await boards.findOne({ name: data.name })

			return createdBoard
		},
		deleteBoard: async (id) => {
			const boards = fastify.mongo.db.collection('boards')
			const find = await boards.findOne({ _id: new ObjectId(id) })
			if (find) {
				const result = await boards.deleteOne({ _id: new ObjectId(id) })

				if (result) {
					return result
				} else {
					throw new Error('Database Error')
				}
			} else {
				throw new ModelError('board not found')
			}
		},
		updateBoard: async (id, name) => {
			const boards = fastify.mongo.db.collection('boards')
			const find = await boards.findOne({ _id: id })
			if (find) {
				const result = await boards.updateOne({ _id: id }, { $set: { name: name } }, {})
				if (result) {
					return result
				} else {
					throw new Error('Database Error')
				}
			} else {
				throw new ModelError('board not found')
			}
		},
		getBoard: async (id) => {
			const boards = fastify.mongo.db.collection('boards')
			const tasks = fastify.mongo.db.collection('tasks')
			const result = await boards.findOne({ _id: new ObjectId(id) })
			if (result) {
				const cursor = await tasks.find({ Board: id })
				const taskList = await cursor.toArray()

				return { result, taskList }
			}
			if (!result) {
				throw new ModelError('board not found')
			}
		}
	})
}

boardModels[Symbol.for('skip-override')] = true

export default boardModels
