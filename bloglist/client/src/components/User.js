import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { initializeUsers } from '../reducers/userReducer'

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

export default User