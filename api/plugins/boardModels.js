import { ObjectId } from 'mongodb'
export class ModelError extends Error {}

async function boardModels(fastify) {
	fastify.decorate('boardModels', {
		getBoard: async (id) => {
			const boards = this.mongo.db.collection('boards')
			const tasks = this.mongo.db.collection('tasks')
			const result = await boards.findOne({ _id: new ObjectId(id) })
			if (result) {
				const taskList = await tasks.find({ board: new ObjectId(id) })
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
