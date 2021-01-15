import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { useSelector, useDispatch } from 'react-redux'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { setNotification } from './reducers/notificationReducer'

import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [user, setUser] = useState(null)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setTimedNotification('wrong username or password', true)
    }
  }
  /*
  const removeBlog = (/*blogObject) => {

    if (!window.confirm(`Remove blog ${blogObject.title}?`)) {
      return
    }

    blogService
      .remove(blogObject)
      .then(
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
      )

  }
    */
  const setTimedNotification = (message, error = false) => {
    dispatch(setNotification({ message, error }))
    setTimeout(() => {
      dispatch(setNotification(null))
    }, 5000)
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )
  /*
  const addBlog = (/*blogObject) => {

    //blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
        setTimedNotification(`a new blog ${returnedBlog.title} added`)
      })

  }
 */

  return (
    <div>
      <Notification />
      {user === null ?
        loginForm() :

        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={() => {
              window.localStorage.removeItem('loggedBlogappUser')
              window.location.reload()
            }
            }>logout</button>
          </p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} />
          )}
          <BlogForm />
        </div>
      }
    </div>
  )
}

export default App