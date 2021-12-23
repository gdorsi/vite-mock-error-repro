async function authenticate(fastify) {
  fastify.register(import("fastify-jwt"), {
    secret: process.env.JWT_SECRET,
  })

  fastify.decorate("authenticate", async (req, reply) => {
    try {
      await req.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

authenticate[Symbol.for("skip-override")] = true

export default authenticate
