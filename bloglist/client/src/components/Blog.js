import React, { useEffect, useState } from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { initializeBlogs, commentBlog } from '../reducers/blogReducer'
import { useHistory } from 'react-router-dom'

const Blog = ({ loggedInUser, setTimedNotification }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const blogById = id => blogs.find(b => id === b.id)
  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogById(match.params.id)
    : null
  let isCurrentUsersBlog = blog
    ? blog.user.username === loggedInUser.username
    : false
  const showWhenCurrentUsersBlog = { display: isCurrentUsersBlog ? '' : 'none' }
  const history = useHistory()
  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [initializeBlogs])

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
