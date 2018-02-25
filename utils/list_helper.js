const Blog = require('../models/blog')
const User = require('../models/user')

const dummy = (blogs) => {
  return 1
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length
}

const totalLikes = (blogs) => {
  const reducer = (sumOfLikes, blog) => {
    return sumOfLikes + blog.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    return null
  }
  const reducer = (best, blog) => {
    return best.likes > blog.likes ? best : blog
  }
  return blogs.reduce(reducer, {})
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  dummy,
  average,
  totalLikes,
  favoriteBlog,
  blogsInDb,
  usersInDb
}