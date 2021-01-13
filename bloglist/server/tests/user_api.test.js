const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('a valid user can be added', async () => {
    const testuser = {
      'username': 'jaasda',
      'name': 'Jeejeejee Jee',
      'password': 'huaa123'
    }

    await api
      .post('/api/users')
      .send(testuser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    let usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(2)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(testuser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const testuser = {
      'username': 'root',
      'name': 'Jeejeejee Jee',
      'password': 'huaa123'
    }

    const result = await api
      .post('/api/users')
      .send(testuser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username too short', async () => {
    const testuser = {
      'username': 'ja',
      'name': 'Jeejeejee Jee',
      'password': 'huaa123'
    }

    const result = await api
      .post('/api/users')
      .send(testuser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed')
  })

  test('creation fails with proper statuscode and message if password too short', async () => {
    const testuser = {
      'username': 'ja',
      'name': 'Jeejeejee Jee',
      'password': 'hu'
    }

    const result = await api
      .post('/api/users')
      .send(testuser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password has to be at least 3 characters')
  })

  test('creation fails with proper statuscode and message if password not present', async () => {
    const testuser = {
      'username': 'ja',
      'name': 'Jeejeejee Jee'
    }

    const result = await api
      .post('/api/users')
      .send(testuser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Undefined password')
  })
})

afterAll(() => {
  mongoose.connection.close()
})