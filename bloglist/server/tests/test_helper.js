const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'qwe',
    author: 'jaaboldi',
    url: 'qwe.com',
    likes: 10
  },
  {
    title: 'asd',
    author: 'kuuboldi',
    url: 'asd.com',
    likes: 5,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createTestUserToken = async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('password', saltRounds)

  const user = new User({
    username: 'user',
    name: 'Test User',
    passwordHash,
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  return token
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb, createTestUserToken
}