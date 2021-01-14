import React, { useState } from 'react'
import { addBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import Togglable from './Togglable'

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)
  const dispatch = useDispatch()

  const togglableRef = React.createRef()

  const createBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    dispatch(addBlog(newBlog))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

    togglableRef.current.toggleVisibility()
  }

  return (
    <Togglable buttonLabel='create new blog' ref={togglableRef}>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          title:
          <input
            id='title'
            value={newTitle}
            onChange={handleTitleChange}
          />
          <br />
        author:
          <input
            id='author'
            value={newAuthor}
            onChange={handleAuthorChange}
          />
          <br />
        url:
          <input
            id='url'
            value={newUrl}
            onChange={handleUrlChange}
          />
        </div>

        <div>
          <button id='create-blog-button' type="submit">create</button>
        </div>
      </form>
    </Togglable>
  )
}

export default BlogForm