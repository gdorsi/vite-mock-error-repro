import mongodb from "mongodb"
import Board from "../schemas.js"

async function createBoard(req, reply) {
  const name = req.body.name
  const creator = req.body.creator
  const boards = this.mongo.db.collection("boards")
  const data = { name, creator }
  const findName = await boards.findOne({ name: name })
  if (findName) {
    reply.code(500).send({ message: "name already in use" })
  }
  const result = await boards.insertOne(data)
}

async function deleteBoard(req, reply) {
  const boards = this.mongo.db.collection("boards")
  const result = await boards.findByIdAndRemove(req.body.id)
  if (result) {
    reply.code(200).send({ message: " board deleted" })
  }
  reply.code(404).send({ message: "board not found" })
}

export { createBoard, deleteBoard }
