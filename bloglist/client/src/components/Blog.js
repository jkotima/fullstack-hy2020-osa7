import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
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
  const removeConfirm = (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}?`)) {
      return
    }
    dispatch(removeBlog(blog))
  }

  const likeBlogWithNotification = (blog) => {
    // todo: notification
    dispatch(likeBlog(blog))
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
          likes {blog.likes} <button id="like-button" onClick={() => likeBlogWithNotification(blog)}>like</button> <br />
        {blog.user.name}<br />
        <button id="remove-button" onClick={() => removeConfirm(blog)} style={showWhenCurrentUsersBlog}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
