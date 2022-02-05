import { ObjectId } from 'mongodb'
import { ModelError } from '../plugins/model.js'

async function signup(req, reply) {
	const { username, password, email } = req.body

	const users = this.mongo.db.collection('users')
	const data = { username, password, email }
	const findEmail = await users.findOne({ email: email })

	if (findEmail) {
		reply.code(500).send({ message: 'email already in use' })
	}
	const findUser = await users.findOne({ username: username })
	if (findUser) {
		reply.code(500).send({ message: 'username already in use' })
	}
	const result = await users.insertOne(data)
	return { token: this.jwt.sign({ _id }) }
}

async function login(req, reply) {
	const { password, email } = req.body
	try {
		const { id } = await this.model.login(email, password)
		return { token: this.jwt.sign({ id }) }
	} catch (error) {
		if (error instanceof ModelError) reply.code(401).send({ message: error.message })
		else throw error
	}
}
async function getUser(req, reply) {
	const users = this.mongo.db.collection('users')
	console.log(new ObjectId(req.params.id))
	const result = await users.findOne({ _id: new ObjectId(req.params.id) })
	if (result) {
		return reply.send(result)
	}
	reply.code(404).send({ message: 'Not found' })
}
export { signup, login, getUser }
