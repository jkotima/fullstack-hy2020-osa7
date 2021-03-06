import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom'
import Container from '@material-ui/core/Container'

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
  }

  const blogs = useSelector(state => state.blogs)
  const blogmatch = useRouteMatch('/blogs/:id')
  const blog = blogmatch
    ? blogs.find(b => b.id === blogmatch.params.id)
    : null

  const users = useSelector(state => state.users)
  const usermatch = useRouteMatch('/users/:id')
  const user = usermatch
    ? users.find(u => u.id === usermatch.params.id)
    : null

  return (
    <Container>
      <h2>blog app</h2>

      <Notification />

      {loggedInUser === null
        ? <LoginForm setTimedNotification={setTimedNotification} />
        :
        <>
          <Menu />
          <Switch>
            <Route path="/users/:id">
              <User user={user}/>
            </Route>
            <Route path="/users">
              <UserList />
            </Route>
            <Route path="/blogs/:id">
              <Blog
                blog={blog}
              />
            </Route>
            <Route path="/">
              <BlogForm />
              <BlogList />
            </Route>
          </Switch>
        </>
      }
    </Container>
  )
}

export default App