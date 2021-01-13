const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a returned blog has a field called \'id\'', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].id).toBeDefined()
  })

  test('a specific blog(object) is within the returned blogs', async () => {
    let blogsAtEnd = await helper.blogsInDb()

    blogsAtEnd = blogsAtEnd.map(r => {
      let { id, ...rest } = r
      return rest
    })

    expect(blogsAtEnd).toContainEqual(helper.initialBlogs[0])
  })
})


describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'The New Blog',
      author: 'The New Blogger',
      url: 'new.blog',
      likes: 123
    }

    const token = await helper.createTestUserToken()

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    let blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    blogsAtEnd = blogsAtEnd.map(r => {
      let { id, user, ...rest } = r
      return rest
    })

    expect(blogsAtEnd).toContainEqual(newBlog)
  })

  test('if likes-field in POST undefined, it should be initialized as zero', async () => {
    const blogWithoutLikes = {
      title: 'The Sad Blog',
      author: 'The Sad Blogger',
      url: 'sad.blog',
    }

    const token = await helper.createTestUserToken()

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(blogWithoutLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    let blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 2)

    blogsAtEnd = blogsAtEnd.map(r => {
      let { id, user, ...rest } = r
      return rest
    })

    expect(blogsAtEnd).toContainEqual(Object.assign(blogWithoutLikes, { likes: 0 }))
  })

  test('if both title and url in POST undefined, should return 400 Bad Request', async () => {
    const blogWithoutTitleAndUrl = {
      author: 'The Mysterious Blogger',
      likes: 123
    }

    const token = await helper.createTestUserToken()

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(blogWithoutTitleAndUrl)
      .expect(400)
  })

  test('a blog without token cannot be added and should return 401 Unauthorized', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'The Tokenless Blog',
      author: 'The Tokenless Blogger',
      url: 'tokenless.blog',
      likes: 123
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })
})


describe('deletion of a blog', () => {
  test('creation and deletion of a blog works with correct status codes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      title: 'The New Blog',
      author: 'The New Blogger',
      url: 'new.blog',
      likes: 123
    }

    const token = await helper.createTestUserToken()

    // create blog
    const result = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogToDelete = result.body

    expect(await helper.blogsInDb()).toHaveLength(blogsAtStart.length + 1)

    // delete blog
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtEnd).not.toContainEqual(blogToDelete)

  })
})

describe('update blog', () => {
  test('increasing likes by one works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeUpdated = blogsAtStart[0]

    const updatedBlog = {
      ...blogToBeUpdated,
      likes: blogToBeUpdated.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(blogToBeUpdated.likes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})