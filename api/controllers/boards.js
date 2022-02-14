import { ObjectId } from 'mongodb'

async function createBoard(req, reply) {
	const name = req.body.name
	const creator = req.user.id
	const boards = this.mongo.db.collection('boards')
	const data = { name, creator }
	const findName = await boards.findOne({ name: name })
	if (findName) {
		reply.code(500).send({ message: 'name already in use' })
	}
	const result = await boards.insertOne(data)
	return reply.send(data)
}

async function deleteBoard(req, reply) {
	const boards = this.mongo.db.collection('boards')
	const find = await boards.findOne({ _id: new ObjectId(req.params.id) })
	if (find) {
		const result = await boards.deleteOne({ _id: new ObjectId(req.params.id) })

		if (result) {
			reply.code(200).send({ message: ' board deleted' })
		} else {
			reply.code(500).send({ message: ' error' })
		}
	} else {
		reply.code(404).send({ message: 'board not found' })
	}
}
async function getBoard(req, reply) {
	const id = req.params.id
	try {
		const result = await this.boardModels.getBoard(id)
		return { result }
	} catch (error) {
		if (error instanceof ModelError) reply.code(404).send({ message: error.message })
		else throw error
	}
}
async function updateBoard(req, reply) {
	const boards = this.mongo.db.collection('boards')
	const name = req.body.name

	const id = new ObjectId(req.params.id)
	const find = await boards.findOne({ _id: id })
	if (find) {
		const result = await boards.updateOne({ _id: id }, { $set: { name: name } }, {})
		if (result) {
			return reply.send(result)
		} else {
			reply.code(500).send({ message: 'error' })
		}
	} else {
		reply.code(404).send({ message: 'Board Not found' })
	}
}
export { createBoard, deleteBoard, getBoard, updateBoard }
