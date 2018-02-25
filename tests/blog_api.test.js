const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const blogsInDb = require('../utils/list_helper').blogsInDb

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

beforeAll(async () => {
  await Blog.remove({})
  console.log('Cleared blogs')

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('done')
})

afterAll(() => {
  console.log('Closing server')
  server.close()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid blog can be added', async () => {
  const blogsInDatabase = await blogsInDb()

  const newBlog = {
    title: 'Testiblogi',
    author: 'John Doe',
    url: '<url>',
    likes: 1234
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body.length).toBe(blogsInDatabase.length + 1)
  expect(contents).toContain('Testiblogi')

})

test('added blog without likes has zero likes', async () => {
  const newBlog = {
    title: 'Testiblogi',
    author: 'John Doe',
    url: '<url>'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  expect(response.body.likes).toBe(0)
})

test('adding blog without title and url should return status 400', async () => {
  const newBlog = {
    author: 'John Doe',
    likes: 1234
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog can be removed by id', async () => {
  const blogsInDatabase = await blogsInDb()
  const blogToRemove = blogsInDatabase[0]
  const idToRemove = blogToRemove._id

  await api
    .delete(`/api/blogs/${idToRemove}`)
    .expect(204)

  const blogsAfterRemove = await blogsInDb()
  const idsAfterRemove = blogsAfterRemove.map(blog => blog._id)
  expect(idsAfterRemove).not.toContain(idToRemove)
  expect(blogsAfterRemove.length).toBe(blogsInDatabase.length - 1)
})