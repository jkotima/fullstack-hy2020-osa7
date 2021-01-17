import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import UserList from './components/UserList'
import User from './components/User'
import Blog from './components/Blog'
import Menu from './components/Menu'

import { setNotification } from './reducers/notificationReducer'
import { setUser } from './reducers/loggedInUserReducer'

import blogService from './services/blogs'


const App = () => {
  const dispatch = useDispatch()
  const loggedInUser = useSelector(state => state.loggedInUser)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const setTimedNotification = (message, error = false) => {
    dispatch(setNotification({ message, error }))
    setTimeout(() => {
      dispatch(setNotification(null))
    }, 5000)
  }

  const blogs = useSelector(state => state.blogs)
  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  return (
    <div>
      <h2>blog app</h2>

      <Notification />

      {loggedInUser === null
        ? <LoginForm setTimedNotification={setTimedNotification} />
        :
        <>
          <Menu />
          <Switch>
            <Route path="/users/:id">
              <User />
            </Route>
            <Route path="/users">
              <UserList />
            </Route>
            <Route path="/blogs/:id">
              <Blog
                blog={blog}
                setTimedNotification={setTimedNotification}
              />
            </Route>
            <Route path="/">
              <BlogList />
              <BlogForm />
            </Route>
          </Switch>
        </>
      }
    </div>
  )
}

export default App