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

module.exports = {
  dummy,
  average,
  totalLikes
}