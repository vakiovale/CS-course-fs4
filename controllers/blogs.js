const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user')
    response.json(blogs)
  } catch(exception) {
    console.log(exception)
    response.status(400)
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const blog = new Blog(body)

    if(!blog.title && !blog.url) {
      return response.status(400).json({ error: 'missing title and url' })
    }

    if(blog.likes === undefined) {
      blog.likes = 0
    }

    const users = await User.find({})
    const firstUser = users[0]
    blog.user = firstUser._id

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = blogsRouter