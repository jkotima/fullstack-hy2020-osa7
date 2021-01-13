import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const isCurrentUsersBlog = blog.user.username === user.username
  const showWhenCurrentUsersBlog = { display: isCurrentUsersBlog ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div id="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible}>view</button>
        <button onClick={toggleVisibility} style={showWhenVisible}>hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}<br />
          likes {blog.likes} <button id="like-button" onClick={() => likeBlog(blog)}>like</button> <br />
        {blog.user.name}<br />
        <button id="remove-button" onClick={() => removeBlog(blog)} style={showWhenCurrentUsersBlog}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
