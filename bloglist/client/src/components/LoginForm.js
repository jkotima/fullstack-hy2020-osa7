import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Togglable from '../components/Togglable'

import loginService from '../services/login'
import blogService from '../services/blogs'
import { setUser } from '../reducers/loggedInUserReducer'
import { setNotification } from '../reducers/notificationReducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect( () => () => loginService.cancel(), [] )

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
      dispatch(setNotification({ message: 'Wrong username or password', error: true }))
    }
  }

  return (
    <Togglable buttonLabel='login'>
      <div>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    </Togglable>
  )
}

export default LoginForm