import { ObjectId } from 'mongodb'
import { ModelError } from '../plugins/userModels.js'

async function signup(req, reply) {
	const { username, password, email } = req.body
	try {
		const { id } = await this.userModels.signup(username, password, email)
		return { token: this.jwt.sign({ id }) }
	} catch (error) {
		if (error instanceof ModelError) reply.code(409).send({ message: error.message })
		else throw error
	}
}

async function login(req, reply) {
	const { password, email } = req.body
	try {
		const { id } = await this.userModels.login(email, password)
		return { token: this.jwt.sign({ id }) }
	} catch (error) {
		if (error instanceof ModelError) reply.code(401).send({ message: error.message })
		else throw error
	}
}
async function getUser(req, reply) {
	const id = req.user.id
	try {
		const result = await this.userModels.getUser(id)
		return { result }
	} catch (error) {
		if (error instanceof ModelError) reply.code(404).send({ message: error.message })
		else throw error
	}
}
export { signup, login, getUser }
