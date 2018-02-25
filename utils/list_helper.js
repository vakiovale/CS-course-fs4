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

const mostBlogs = (blogs) => {
  let bloggers = blogs.map(blog => blog.author)
  if(bloggers.length === 0) {
    return null
  }
  let mostFrequentBlogger = bloggers[0]
  let biggestNumberOfBlogs = 1
  bloggers.forEach(blogger => {
    let counter = 0
    bloggers.forEach(otherBlogger => {
      if(blogger === otherBlogger) {
        counter = counter + 1
      }
    })
    if(counter > biggestNumberOfBlogs) {
      mostFrequentBlogger = blogger
      biggestNumberOfBlogs = counter
    }
  })
  console.log(mostFrequentBlogger)
  console.log(biggestNumberOfBlogs)
  return { author: mostFrequentBlogger, blogs: biggestNumberOfBlogs }
}

const mostLikes = (blogs) => {
  let bloggers = blogs.map(blog => blog.author)
  if(bloggers.length === 0) {
    return null
  }

  let reducer = (sum, item) => {
    return sum + item
  }

  let mostLikedBlogger = bloggers[0]
  let biggestNumberOfLikes = 0
  bloggers.forEach(blogger => {
    let likes = blogs.filter(blog => blog.author === blogger).map(blog => blog.likes).reduce(reducer, 0)
    if(likes > biggestNumberOfLikes) {
      biggestNumberOfLikes = likes
      mostLikedBlogger = blogger
    }
  })
  console.log(mostLikedBlogger)
  console.log(biggestNumberOfLikes)
  return { author: mostLikedBlogger, likes: biggestNumberOfLikes }
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
  usersInDb,
  mostBlogs,
  mostLikes
}