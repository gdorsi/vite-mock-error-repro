const Board = require("../schemas")
const { createBoard, deleteBoard } = require("../controllers/boards")

const createBoardOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name", "creator"],
      properties: {
        name: { type: "string" },
        creator: { type: "string" },
      },
    },
    response: {
      201: Board,
    },
  },
  handler: createBoard,
}

const deleteBoardOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
      },
    },
    response: {
      200: message,
    },
  },
  handler: deleteBoard,
}

function boardRoutes(fastify, options, done) {
  fastify.post("/createBoard/", createBoardOpts)
  fastify.delete("/deleteBoard/", deleteBoardOpts)
  done()
}

module.exports = boardRoutes
