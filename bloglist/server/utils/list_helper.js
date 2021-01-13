var _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes
    ? max
    : blog
  )
}

const mostBlogs = (blogs) => {
  const blogCountByAuthor = _.countBy(blogs, 'author')
  const authorWithMostBlogs = Object.keys(blogCountByAuthor).reduce((a, b) =>
    blogCountByAuthor[a] > blogCountByAuthor[b] ? a : b
  )

  return {
    author: authorWithMostBlogs,
    blogs: blogCountByAuthor[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {
  const summed = _(blogs)
    .groupBy('author')
    .map((objs, key) => {
      return {
        'author': key,
        'likes': _.sumBy(objs, 'likes')
      }
    })
    .value()

  return summed.reduce((a, b) => a.likes > b.likes ? a : b)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}