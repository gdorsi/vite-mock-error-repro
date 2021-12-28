import Board from "../schemas.js"
import { createBoard, deleteBoard, getBoard , updateBoard} from "../controllers/boards.js"

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
  schema : {
    response: {
        201: Board

    }
},
handler: deleteBoard
}
const getBoardOpts = {
  schema : {
      response: {
          201: Board

      }
  },
  handler: getBoard
}
const updateBoardOpts = {
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
  handler: updateBoard,
}
function boardRoutes(fastify, options, done) {
  fastify.post("/boards/", createBoardOpts)
  fastify.delete("/boards/:id", deleteBoardOpts)
  fastify.get("/boards/:id", getBoardOpts)
  fastify.put("/boards/:id", updateBoardOpts)
  done()
}

export default boardRoutes
