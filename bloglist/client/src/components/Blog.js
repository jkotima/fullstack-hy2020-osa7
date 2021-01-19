import React, { useEffect, useState } from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs, commentBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useHistory } from 'react-router-dom'
import { Button, IconButton } from '@material-ui/core/'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import DeleteIcon from '@material-ui/icons/Delete'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const loggedInUser = useSelector(state => state.loggedInUser)

  const isCurrentUsersBlog = blog
    ? blog.user.username === loggedInUser.username
    : false
  const showWhenCurrentUsersBlog = { display: isCurrentUsersBlog ? '' : 'none' }
  const history = useHistory()
  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const removeConfirm = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}?`)) {
      return
    }
    await dispatch(removeBlog(blog))
    dispatch(setNotification({ message: `Removed '${blog.title}'` }))
    history.push('/')
  }

  const handleLike = (blog) => {
    dispatch(setNotification({ message: `Liked '${blog.title}'` }))
    dispatch(likeBlog(blog))
  }

  const handleComment = async (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog, comment))
    setComment('')
    dispatch(setNotification({ message: `Commented '${blog.title}'` }))
  }
  if (!blog) {
    return null
  }

  return (
    <div>

      <h1>
        {blog.title} by <i>{blog.author}</i>
        <IconButton
          aria-label="delete"
          style={showWhenCurrentUsersBlog}
          onClick={() => removeConfirm(blog)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </h1>

      <a href={blog.url}>{blog.url}</a><br />
      Added by {blog.user.name}<br />

      <Button
        variant="contained"
        size="small"
        style={{ color: 'green' }}
        onClick={() => handleLike(blog)}>
        <ThumbUpIcon /> {blog.likes}
      </Button>
      <div>
        <h3>Comments</h3>
        <form onSubmit={handleComment}>
          <input id="commentField" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button id="login-button" type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) =>
            <li key={index}>{comment}</li>
          )}
        </ul>
      </div>
    </div>
  )
}
export default Blog
