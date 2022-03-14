import t from 'tap'
import fastify from 'fastify'
import sinon from 'sinon'
import errors from 'http-errors'
import { ModelError } from '../../plugins/taskModels.js'

const { test } = t

function buildServer() {
	return fastify()
		.decorate('taskModels', {
			createTask: sinon.stub(),
			deleteTask: sinon.stub(),
			updateTask: sinon.stub()
		})
		.decorate('jwt', { sign: sinon.stub() })
		.decorate('authenticate', sinon.stub())
		.register(import('../../routes/tasks.js'))
}

test('POST /tasks', async (t) => {
	

	t.test('returns 400 with missing credentials', async (t) => {
		const fastify = buildServer()
		fastify.authenticate.callsFake(async (request) => {
			request.user = { id: '1', iat: 1 }
		})
		const res = await fastify.inject({
			url: '/tasks/',
			method: 'POST'
		})

		t.equal(res.statusCode, 400)
	})

	

	t.test('returns 500 when database errors', async (t) => {
		const fastify = buildServer()
		fastify.authenticate.callsFake(async (request) => {
			request.user = { id: '1', iat: 1 }
		})
		fastify.taskModels.createTask.rejects(new Error('Database Error'))

		const res = await fastify.inject({
			url: '/tasks/',
			method: 'POST',
			body: {
				name: 'alice',
                board: '1'
			}
		})

		t.equal(res.statusCode, 500)
	})

	t.test('returns task after succesful creation', async (t) => {
		const fastify = buildServer()
		fastify.authenticate.callsFake(async (request) => {
			request.user = { id: '1', iat: 1 }
		})
		fastify.taskModels.createTask.resolves({
			id: '1',
			name: 'alice',
			board: '1',
			npomodoro: '0',
			state: 'iniziato'
		})

		const res = await fastify.inject({
			url: '/tasks/',
			method: 'POST',
			body: {
				name: 'alice',
                board: '1'
			}
		})

		t.equal(res.statusCode, 200)
	})
})


