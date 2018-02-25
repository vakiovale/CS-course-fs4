const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

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
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!token || !decodedToken.id) {
      return response.status(400).json({ error: 'token missing or invalid' })
    }

    const body = request.body
    const blog = new Blog(body)

    if(!blog.title && !blog.url) {
      return response.status(400).json({ error: 'missing title and url' })
    }

    if(blog.likes === undefined) {
      blog.likes = 0
    }

    const user = await User.findById(decodedToken.id)
    blog.user = user._id

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
  } catch(exception) {
    if(exception.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      return response.status(500).json({ error: 'something went wrong' })
    }
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