const ObjectId = require("mongodb").ObjectId
const Task = require("../schemas")

async function createTask(req, reply) {
  const { name, state, board, npomodoro } = req.body

  const Tasks = this.mongo.db.collection("tasks")
  const data = { name, state, board, npomodoro }

  const result = await boards.insertOne(data)
}

async function deleteTask(req, reply) {
  const tasks = this.mongo.db.collection("tasks")
  const result = await tasks.findByIdAndRemove(req.body.id)

  if (result) {
    reply.code(200).send({ message: " board deleted" })
  }

  reply.code(404).send({ message: "board not found" })
}
