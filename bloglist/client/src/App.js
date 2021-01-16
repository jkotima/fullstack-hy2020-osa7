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
import { setUser } from './reducers/loggedInUserReducer'
import {
  Switch, Route, Link, useRouteMatch
} from 'react-router-dom'
import { initializeUsers } from './reducers/userReducer'

const Logout = ({ user }) => (
  <div>
    <p>
      {user.name} logged in
      <button onClick={() => {
        window.localStorage.removeItem('loggedBlogappUser')
        window.location.reload()
      }
      }>logout</button>
    </p>
  </div>
)

const Users = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
  }, [initializeUsers])

  const users = useSelector(state => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map(user =>
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}
const User = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)
  const userById = id => users.find(u => id === u.id)
  const match = useRouteMatch('/users/:id')
  const user = match
    ? userById(match.params.id)
    : null

  useEffect(() => {
    dispatch(initializeUsers())
  }, [initializeUsers])

  if (!user) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>
            {blog.title}
          </li>
        )}
      </ul>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const loggedInUser = useSelector(state => state.loggedInUser)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
      <h2>blogs</h2>

      <Notification />

      {loggedInUser === null ?
        loginForm() :
        <>
          <Logout user={loggedInUser} />
          <Switch>
            <Route path="/users/:id">
              <User />
            </Route>
            <Route path="/users">
              <Users />
            </Route>

            <Route path="/">
              <div>
                {blogs.map(blog =>
                  <Blog key={blog.id} blog={blog} user={loggedInUser} />
                )}

                <BlogForm />
              </div>
            </Route>
          </Switch>
        </>
      }
    </div>
  )
}

export default App