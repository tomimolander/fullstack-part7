// eslint-disable-next-line no-unused-vars
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (previousValue, currentValue) => previousValue + currentValue
  likes = blogs.map((blog) => blog.likes)
  return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce(function(prev, curr) {
    return (prev.likes > curr.likes) ? prev : curr
  })
  return favBlog
}

const mostBlogs = (blogs) => {
  authorBlogAmounts = _.countBy(blogs, 'author')
  const maxKey = _.max(Object.keys(authorBlogAmounts),
    (o) => authorBlogAmounts[o])
  const mostBlogsAuthor = {
    author: maxKey,
    blogs: authorBlogAmounts[maxKey],
  }
  return mostBlogsAuthor
}

const mostLikes = (blogs) => {
  authorsBlogs = _.groupBy(blogs, 'author')

  const reducer = (previousValue, currentValue) => {
    return previousValue + currentValue.likes
  }

  authorsLikes = _.map(authorsBlogs, (author) => {
    const authorLikes = {
      author: _.head(author).author,
      likes: author.reduce(reducer, 0),
    }
    return authorLikes
  })

  const authorReducer = (previousValue, currentValue) => {
    if (currentValue.likes > previousValue.likes) {
      return currentValue
    } else {
      return previousValue
    }
  }

  const mostLikedAuthor = authorsLikes.reduce(authorReducer,
    _.head(authorsLikes))

  return mostLikedAuthor
}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
}
