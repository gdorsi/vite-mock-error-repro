import t from 'tap'
import fastify from 'fastify'
import sinon from 'sinon'
import { ModelError } from '../../plugins/model.js'

const { test } = t

function buildServer() {
	return fastify()
		.decorate('model', { login: sinon.stub(), signup: sinon.stub(), getUser: sinon.stub() })
		.decorate('jwt', { sign: sinon.stub() })
		.register(import('../../routes/users.js'))
}

test('POST /login', async (t) => {
	t.test('returns 400 with missing credentials', async (t) => {
		const fastify = buildServer()

		const res = await fastify.inject({
			url: '/login/',
			method: 'POST'
		})

		t.equal(res.statusCode, 400)
	})

	t.test('returns 400 with partial credentials', async (t) => {
		const fastify = buildServer()

		const res = await fastify.inject({
			url: '/login/',
			method: 'POST',
			body: {
				username: 'alice'
			}
		})

		t.equal(res.statusCode, 400)
	})

	t.test('returns 401 with wrong credentials', async (t) => {
		const fastify = buildServer()
		fastify.model.login.rejects(new ModelError('Wrong Password'))
		const res = await fastify.inject({
			url: '/login/',
			method: 'POST',
			body: {
				email: 'alice',
				password: 'wrong password'
			}
		})

		t.equal(res.statusCode, 401)
	})

	t.test('returns 401 when user is not found in database', async (t) => {
		const fastify = buildServer()

		fastify.model.login.rejects(new ModelError('User Not Found'))

		const res = await fastify.inject({
			url: '/login/',
			method: 'POST',
			body: {
				email: 'alice',
				password: 'alice'
			}
		})

		t.equal(res.statusCode, 401)
	})

	t.test('returns 500 when database errors', async (t) => {
		const fastify = buildServer()

		fastify.model.login.rejects(new Error('Database Error'))

		const res = await fastify.inject({
			url: '/login/',
			method: 'POST',
			body: {
				email: 'alice',
				password: 'alice'
			}
		})

		t.equal(res.statusCode, 500)
	})

	t.test('obtains a token with right credentials', async (t) => {
		const fastify = buildServer()

		fastify.model.login.resolves({
			id: 1
		})
		fastify.jwt.sign.returns('jwt token')

		const res = await fastify.inject({
			url: '/login/',
			method: 'POST',
			body: {
				email: 'alice',
				password: 'alice'
			}
		})

		t.equal(res.statusCode, 200)
		t.same(await res.json(), { token: 'jwt token' })
	})
})
test('POST /signup', async (t) => {
	t.test('returns 400 with missing credentials', async (t) => {
		const fastify = buildServer()

		const res = await fastify.inject({
			url: '/signup/',
			method: 'POST'
		})

		t.equal(res.statusCode, 400)
	})

	t.test('returns 400 with partial credentials', async (t) => {
		const fastify = buildServer()

		const res = await fastify.inject({
			url: '/signup/',
			method: 'POST',
			body: {
				username: 'alice'
			}
		})

		t.equal(res.statusCode, 400)
	})

	t.test('returns 409 when username is already in use', async (t) => {
		const fastify = buildServer()

		fastify.model.signup.rejects(new ModelError('username is already in use'))

		const res = await fastify.inject({
			url: '/signup/',
			method: 'POST',
			body: {
				email: 'alice',
				password: 'alice',
				username: 'alreadyinuse'
			}
		})

		t.equal(res.statusCode, 409)
	})
	t.test('returns 409 when email is already in use', async (t) => {
		const fastify = buildServer()

		fastify.model.signup.rejects(new ModelError(' email is already in use'))

		const res = await fastify.inject({
			url: '/signup/',
			method: 'POST',
			body: {
				email: 'alreadyinuse',
				password: 'alice',
				username: 'alice'
			}
		})

		t.equal(res.statusCode, 409)
	})

	t.test('returns 500 when database errors', async (t) => {
		const fastify = buildServer()

		fastify.model.signup.rejects(new Error('Database Error'))

		const res = await fastify.inject({
			url: '/signup/',
			method: 'POST',
			body: {
				email: 'alice',
				password: 'alice',
				username: 'alice'
			}
		})

		t.equal(res.statusCode, 500)
	})

	t.test('obtains a token with succesful signup', async (t) => {
		const fastify = buildServer()

		fastify.model.signup.resolves({
			id: 1
		})
		fastify.jwt.sign.returns('jwt token')

		const res = await fastify.inject({
			url: '/signup/',
			method: 'POST',
			body: {
				email: 'alice',
				username: 'alice',
				password: 'alice'
			}
		})

		t.equal(res.statusCode, 200)
		t.same(await res.json(), { token: 'jwt token' })
	})
})

test('GET /users/:id', async (t) => {
	t.test('returns error when user id does not exist', async (t) => {
		const fastify = buildServer()
		fastify.model.getUser.rejects(new Error('User id does not exist'))

		const res = await fastify.inject({
			url: '/users/notexist1',
			method: 'GET'
		})
		t.equal(res.statusCode, 404)
	})
	t.test('returns 500 when database errors', async (t) => {
		const fastify = buildServer()

		fastify.model.getUser.rejects(new Error('Database Error'))

		const res = await fastify.inject({
			url: '/users/notexist1/',
			method: 'GET'
		})

		t.equal(res.statusCode, 500)
	})

	t.test('return user when id is found', async (t) => {
		const fastify = buildServer()
		fastify.model.getUser.resolves({
			id: '1',
			username: 'dfsdfsdsNew Item',
			password: 'pipssp',
			email: 'pippsdddsssssadao@baudo'
		})
		const res = await fastify.inject({
			url: '/users/1/',
			method: 'GET'
		})

		t.equal(res.statusCode, 200)
		t.same(await res.json(), {
			user: {
				id: '1',
				username: 'dfsdfsdsNew Item',
				password: 'pipssp',
				email: 'pippsdddsssssadao@baudo'
			}
		})
	})
})
