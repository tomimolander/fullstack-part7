const bcrypt = require('bcrypt')
// eslint-disable-next-line new-cap
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  // const users = await User.find({})
  const users = await User.find({}).populate('blogs')
  response.json(users.map((u) => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.password || body.password.length < 3) {
    return response.status(401).json({
      error: 'password empty or length less than 3' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
