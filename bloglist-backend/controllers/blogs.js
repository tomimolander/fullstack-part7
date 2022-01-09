// eslint-disable-next-line new-cap
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

/*
const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
*/
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  // const blogs = await Blog.find({})
  response.json(blogs.map((blog) => blog.toJSON()))
  /*
  Blog
    .find({})
    .then((blogs) => {
      response.json(blogs)
    })
    */
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  // const user = await User.findById(body.userId)

  // const token = getTokenFrom(request)
  /*
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  */
  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())

  /*
  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    })
    */
})

blogsRouter.delete('/:id', async (request, response) => {
  /*
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  */
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() !== user._id.toString() ) {
    return response.status(401).json({
      error: 'blog not created by the user and cannot be removed' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog.toJSON())
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
