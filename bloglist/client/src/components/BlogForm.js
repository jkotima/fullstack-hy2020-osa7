import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
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
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm