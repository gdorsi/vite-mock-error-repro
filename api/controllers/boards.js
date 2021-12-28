import { ObjectId } from 'mongodb'

async function createBoard(req, reply) {
	const name = req.body.name
	const creator = req.body.creator
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
	const boards = this.mongo.db.collection('boards')

	const result = await boards.findOne({ _id: new ObjectId(req.params.id) })
	if (result) {
		return reply.send(result)
	}
	reply.code(500).send({ message: 'Not found' })
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
