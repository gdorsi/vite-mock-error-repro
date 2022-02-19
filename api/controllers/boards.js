import { ObjectId } from 'mongodb'
import { ModelError } from '../plugins/boardModels.js'

async function createBoard(req, reply) {
	const name = req.body.name

	const creator = req.user.id

	const data = { name, creator }

	try {
		const result = await this.boardModels.createBoard(data)
		return { result }
	} catch (error) {
		if (error instanceof ModelError) reply.code(409).send({ message: error.message })
		else throw error
	}
}

async function deleteBoard(req, reply) {
	try {
		const result = await this.boardModels.deleteBoard(req.params.id)
		return { result }
	} catch (error) {
		if (error instanceof ModelError) reply.code(404).send({ message: error.message })
		else throw error
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
	const name = req.body.name

	const id = new ObjectId(req.params.id)
	try {
		const result = await this.boardModels.updateBoard(id, name)
		return { result }
	} catch (error) {
		if (error instanceof ModelError) reply.code(404).send({ message: error.message })
		else throw error
	}
}
export { createBoard, deleteBoard, getBoard, updateBoard }
