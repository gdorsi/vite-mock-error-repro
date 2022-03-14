import { ObjectId } from 'mongodb'
export class ModelError extends Error {}

async function taskModels(fastify) {
	fastify.decorate('taskModels', {
		createTask: async (data) => {
			const tasks = fastify.mongo.db.collection('tasks')
			const boards = fastify.mongo.db.collection('boards')
			const findBoard = await boards.findOne({ _id: new ObjectId(data.Board) })
			if (findBoard) {
				const result = await tasks.insertOne(data)
				return data
			} else {
				throw new ModelError(' Board not found')
			}
		}
	})
}
taskModels[Symbol.for('skip-override')] = true
export default taskModels
