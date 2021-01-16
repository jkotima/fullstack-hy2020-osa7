import React, { useEffect } from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { initializeBlogs } from '../reducers/blogReducer'
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

  const likeBlogWithNotification = (blog) => {
    setTimedNotification(`Liked '${blog.title}'`)
    dispatch(likeBlog(blog))
  }

  if (!blog) {
    return null
  }
  return (
    <div>
      <h1>{blog.title} by {blog.author}</h1>
      <a href={blog.url}>{blog.url}</a><br />
      {blog.likes} likes <button id="like-button" onClick={() => likeBlogWithNotification(blog)}>like</button> <br />
      Added by {blog.user.name}<br />
      <button id="remove-button" onClick={() => removeConfirm(blog)} style={showWhenCurrentUsersBlog}>remove</button>
      <div>
        <h3>comments</h3>
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
