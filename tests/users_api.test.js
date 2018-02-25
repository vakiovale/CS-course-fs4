const User = require('../models/user')
const supertest = require('supertest')
const { app, server } = require('../index')
const usersInDb = require('../utils/list_helper').usersInDb
const api = supertest(app)

describe.only('when there is initially one user at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'admin', name: 'Admin', password: 'secret', adult: false })
    await user.save()
  })

  afterAll(() => {
    console.log('Closing server')
    server.close()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'vpyyhtia',
      name: 'Valtteri Pyyhtiä',
      password: 'secretP4ssW0rd',
      adult: true
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users fails if username already exists', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'admin',
      name: 'Valtteri Pyyhtiä',
      password: 'secretP4ssW0rd',
      adult: true
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'username must be unique' })
    const usersAfterOperation = await usersInDb()
    expect(usersBeforeOperation.length).toBe(usersAfterOperation.length)
  })

  test('POST /api/users fails if password is too short', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'abcd1234',
      name: 'Valtteri Pyyhtiä',
      password: '12',
      adult: true
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'password is too short' })
    const usersAfterOperation = await usersInDb()
    expect(usersBeforeOperation.length).toBe(usersAfterOperation.length)
  })

  test('POST /api/users sets adult to true if not specified', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'newUserName',
      name: 'Testikäyttäjän Nimi',
      password: 'goodPassword123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(result.body.adult).toEqual(true)
    const usersAfterOperation = await usersInDb()
    expect(usersBeforeOperation.length).toBe(usersAfterOperation.length - 1)
  })
})