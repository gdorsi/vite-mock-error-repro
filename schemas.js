const User = {
  type: "object",
  properties: {
    _id: { type: "string" },
    username: { type: "string" },
    password: { type: "string" },
    email: { type: "string" },
  },
}

const Task = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    state: { type: "string" },
    board: { type: "string" },
    npomodoro: { type: "int" },
  },
}

const Board = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    creator: { type: "string" },
  },
}

export default {
  User,
}
