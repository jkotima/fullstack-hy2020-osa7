import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@material-ui/core'

const UserList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUsers())
  }, [])

  const users = useSelector(state => state.users)
  const history = useHistory()

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: 'lightgray' }}>
            <TableCell>Name</TableCell>
            <TableCell>Blogs created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user =>
            <TableRow hover key={user.id} onClick={() => history.push(`/users/${user.id}`)}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>
                {user.blogs.length}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserList