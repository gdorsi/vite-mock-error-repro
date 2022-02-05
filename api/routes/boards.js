import Board from '../schemas.js'
import { createBoard, deleteBoard, getBoard, updateBoard } from '../controllers/boards.js'

function boardRoutes(fastify, options, done) {
	// create board
	fastify.post('/boards/', {
		schema: {
			body: {
				type: 'object',
				required: ['name'],
				properties: {
					name: { type: 'string' }
				}
			},
			response: {
				201: Board
			}
		},
		handler: createBoard,
		onRequest: [fastify.authenticate]
	})
	// delete board
	fastify.delete('/boards/:id', {
		schema: {
			response: {
				201: Board
			}
		},
		handler: deleteBoard,
		onRequest: [fastify.authenticate]
	})
	// get board
	fastify.get('/boards/:id', {
		schema: {
			response: {
				201: Board
			}
		},
		handler: getBoard,
		onRequest: [fastify.authenticate]
	})
	// edit board
	fastify.put('/boards/:id', {
		schema: {
			body: {
				type: 'object',
				required: ['name'],
				properties: {
					name: { type: 'string' }
				}
			},
			response: {
				201: Board
			}
		},
		handler: updateBoard,
		onRequest: [fastify.authenticate]
	})
	done()
}

export default boardRoutes
