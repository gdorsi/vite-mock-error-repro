import Task from '../schemas.js'
import { createTask, deleteTask, getTask, updateTask } from '../controllers/tasks.js'

const createTaskOpts = {
	schema: {
		body: {
			type: 'object',
			required: ['name', 'board'],
			properties: {
				name: { type: 'string' },
				creator: { type: 'string' }
			}
		},
		response: {
			201: Task
		}
	},
	handler: createTask
}

const deleteTaskOpts = {
	schema: {
		response: {
			201: Task
		}
	},
	handler: deleteTask
}
const getTaskOpts = {
	schema: {
		response: {
			201: Task
		}
	},
	handler: getTask
}
const updateTaskOpts = {
	schema: {
		body: {
			type: 'object',
			required: ['name', 'state', 'npomodoro'],
			properties: {
				name: { type: 'string' },
				creator: { type: 'string' }
			}
		},
		response: {
			201: Task
		}
	},
	handler: updateTask
}
function taskRoutes(fastify, options, done) {
	fastify.post('/tasks/', createTaskOpts)
	fastify.delete('/tasks/:id', deleteTaskOpts)
	fastify.get('/tasks/:id', getTaskOpts)
	fastify.put('/tasks/:id', updateTaskOpts)
	done()
}

export default taskRoutes
