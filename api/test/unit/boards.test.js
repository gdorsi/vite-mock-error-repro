import t from 'tap'
import fastify from 'fastify'
import sinon from 'sinon'
import errors from 'http-errors'
import { ModelError } from '../../plugins/boardModels.js'

const { test } = t

function buildServer() {
	return fastify()
		.decorate('boardModels', {
			createBoard: sinon.stub(),
			deleteBoard: sinon.stub(),
			getBoard: sinon.stub()
		})
		.decorate('jwt', { sign: sinon.stub() })
		.decorate('authenticate', sinon.stub())
		.register(import('../../routes/boards.js'))
}

test('POST /boards', async (t) => {
	t.test('returns error when authentication fails', async (t) => {
		const fastify = buildServer()

		fastify.authenticate.rejects(errors.Unauthorized())

		const res = await fastify.inject('/boards/')

		sinon.assert.called(fastify.authenticate)
		t.equal(res.statusCode, 401)
	})

	t.test('returns 400 with missing credentials', async (t) => {
		const fastify = buildServer()
		fastify.authenticate.callsFake(async (request) => {
			request.user = { id: '1', iat: 1 }
		})
		const res = await fastify.inject({
			url: '/boards/',
			method: 'POST'
		})

		t.equal(res.statusCode, 400)
	})

	t.test('returns 409 when name is already in use', async (t) => {
		const fastify = buildServer()
		fastify.authenticate.callsFake(async (request) => {
			request.user = { id: '1', iat: 1 }
		})
		fastify.boardModels.createBoard.rejects(new ModelError('name already in use'))
		const res = await fastify.inject({
			url: '/boards/',
			method: 'POST',
			body: {
				name: 'alreadyinuse'
			}
		})

		t.equal(res.statusCode, 409)
	})

	t.test('returns 500 when database errors', async (t) => {
		const fastify = buildServer()
		fastify.authenticate.callsFake(async (request) => {
			request.user = { id: '1', iat: 1 }
		})
		fastify.boardModels.createBoard.rejects(new Error('Database Error'))

		const res = await fastify.inject({
			url: '/boards/',
			method: 'POST',
			body: {
				name: 'alice'
			}
		})

		t.equal(res.statusCode, 500)
	})

	t.test('returns board after succesful creation', async (t) => {
		const fastify = buildServer()
		fastify.authenticate.callsFake(async (request) => {
			request.user = { id: '1', iat: 1 }
		})
		fastify.boardModels.createBoard.resolves({
			id: '1',
			name: 'alice',
			creator: '1'
		})

		const res = await fastify.inject({
			url: '/boards/',
			method: 'POST',
			body: {
				name: 'alice'
			}
		})

		t.equal(res.statusCode, 200)
	})
})

// test('GET /users/:id', async (t) => {
// 	t.test('returns error when user id does not exist', async (t) => {
// 		const fastify = buildServer()
// 		fastify.userModels.getUser.rejects(new ModelError('User id does not exist'))

// 		const res = await fastify.inject({
// 			url: '/users/notexist1/',
// 			method: 'GET'
// 		})
// 		t.equal(res.statusCode, 404)
// 	})
// 	t.test('returns 500 when database errors', async (t) => {
// 		const fastify = buildServer()

// 		fastify.userModels.getUser.rejects(new Error('Database Error'))

// 		const res = await fastify.inject({
// 			url: '/users/notexist1/',
// 			method: 'GET'
// 		})

// 		t.equal(res.statusCode, 500)
// 	})

// 	t.test('return user when id is found', async (t) => {
// 		const fastify = buildServer()
// 		fastify.userModels.getUser.resolves({
// 			id: '1',
// 			username: 'dfsdfsdsNew Item',
// 			password: 'pipssp',
// 			email: 'pippsdddsssssadao@baudo'
// 		})
// 		const res = await fastify.inject({
// 			url: '/users/1/',
// 			method: 'GET'
// 		})

// 		t.equal(res.statusCode, 200)
// 		t.same(await res.json(), {
// 			user: {
// 				id: '1',
// 				username: 'dfsdfsdsNew Item',
// 				password: 'pipssp',
// 				email: 'pippsdddsssssadao@baudo'
// 			}
// 		})
// 	})
// })
