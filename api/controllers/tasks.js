import { ObjectId } from 'mongodb'
import { ModelError } from '../plugins/taskModels.js'

async function createTask(req, reply) {
	
	const name = req.body.name
	const Board = req.body.board
	const state = 'iniziato'
	const npomodoro = 0
	const data = { name, Board, state, npomodoro }
	try {
		const result = await this.taskModels.createTask(data)
		return { result }
	} catch (error) {
		if (error instanceof ModelError) reply.code(409).send({ message: error.message })
		else throw error
	}
}

async function deleteTask(req, reply) {
	const tasks = this.mongo.db.collection('tasks')
	const find = await tasks.findOne({ _id: new ObjectId(req.params.id) })
	if (find) {
		const result = await tasks.deleteOne({ _id: new ObjectId(req.params.id) })

		if (result) {
			reply.code(200).send({ message: ' task deleted' })
		} else {
			reply.code(500).send({ message: ' error' })
		}
	} else {
		reply.code(404).send({ message: 'task not found' })
	}
}
async function getTask(req, reply) {
	const tasks = this.mongo.db.collection('tasks')

	const result = await tasks.findOne({ _id: new ObjectId(req.params.id) })
	if (result) {
		return reply.send(result)
	}
	reply.code(500).send({ message: 'Not found' })
}
async function updateTask(req, reply) {
	const tasks = this.mongo.db.collection('tasks')
	const boards = this.mongo.db.collection('boards')
	const name = req.body.name
	const Board = new ObjectId(req.body.board)
	const state = req.body.state
	const npomodoro = req.body.npomodoro

	const find = await tasks.findOne({ _id: new ObjectId(req.params.id) })
	if (find) {
		const result = await tasks.updateOne(
			{ _id: new ObjectId(req.params.id) },
			{ $set: { name: name, npomodoro: npomodoro, state: state } },
			{}
		)
		if (result) {
			return reply.send(result)
		} else {
			reply.code(500).send({ message: 'error' })
		}
	} else {
		reply.code(404).send({ message: 'Task Not found' })
	}
}
export { createTask, deleteTask, getTask, updateTask }
