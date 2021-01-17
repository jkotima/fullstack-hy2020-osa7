import React, { useEffect, useState } from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs, commentBlog } from '../reducers/blogReducer'
import { useHistory } from 'react-router-dom'

const Blog = ({ blog, setTimedNotification }) => {
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

  const removeConfirm = (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}?`)) {
      return
    }
    dispatch(removeBlog(blog))
    history.push('/')
    setTimedNotification(`Removed '${blog.title}'`)
  }

  const handleLike = (blog) => {
    setTimedNotification(`Liked '${blog.title}'`)
    dispatch(likeBlog(blog))
  }

  const handleComment = async (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog, comment))
    setComment('')
    setTimedNotification(`Commented '${blog.title}'`)
  }
  if (!blog) {
    return null
  }

  return (
    <div>
      <h1>{blog.title} by {blog.author}</h1>
      <a href={blog.url}>{blog.url}</a><br />
      {blog.likes} likes <button id="like-button" onClick={() => handleLike(blog)}>like</button> <br />
      Added by {blog.user.name}<br />
      <button id="remove-button" onClick={() => removeConfirm(blog)} style={showWhenCurrentUsersBlog}>remove</button>
      <div>
        <h3>comments</h3>
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
