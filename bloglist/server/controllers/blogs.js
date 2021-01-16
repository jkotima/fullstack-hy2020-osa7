const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (body.title === undefined && body.url === undefined) {
    return response.status(400).end()
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!blog) {
    return response.status(404).end()
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const userFromToken = decodedToken.id

  if (userFromToken.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)

  const newBlog = {
    ...blog.toObject(),
    ...body
  }

  Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    .then(updatedBlog => {
      if (updatedBlog) {
        response.json(updatedBlog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const comment = request.body.comment
  if (!comment) {
    return response.status(401).json({ error: 'comment missing' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const updatedBlog = { ...blog.toObject(), comments: blog.comments.concat(comment) }

  try {
    const responseBlog =
      await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    response.json(responseBlog)

  } catch (error) {
    error => next(error)
  }
})

module.exports = blogsRouter