import t from 'tap'
import fastify from 'fastify'
import sinon from 'sinon'
import { ModelError } from '../../plugins/model.js'

const { test } = t

function buildServer() {
	return fastify()
		.decorate('model', { login: sinon.stub() })
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
