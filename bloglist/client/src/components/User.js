import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

const User = ({ user }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUsers())
  }, [])
  const history = useHistory()

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>Blogs added by <i>{user.name}</i></h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: 'lightgray' }}>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.blogs.map(blog =>
              <TableRow hover key={blog.id} onClick={() => history.push(`/blogs/${blog.id}`)}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default User