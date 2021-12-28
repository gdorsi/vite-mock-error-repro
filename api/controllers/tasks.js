import { ObjectId } from 'mongodb'

async function createTask(req, reply) {
	const tasks = this.mongo.db.collection('tasks')
	const boards = this.mongo.db.collection('boards')
	const name = req.body.name
	const Board = new ObjectId(req.body.board)
	const state = 'iniziato'
	const npomodoro = 0
	const findBoard = await boards.findOne({ _id: Board })
	if (findBoard) {
		const data = { name, Board, state, npomodoro }
		const result = await tasks.insertOne(data)
		return reply.send(data)
	} else {
		reply.code(404).send({ message: ' Board not found' })
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
