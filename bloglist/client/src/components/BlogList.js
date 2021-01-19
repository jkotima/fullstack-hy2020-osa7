import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from '../reducers/blogReducer'
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

const BlogList = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: 'lightgray' }}>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Added by</TableCell>
            <TableCell>Likes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blogs.map(blog =>
            <TableRow hover key={blog.id} onClick={() => history.push(`/blogs/${blog.id}`)}>
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
              <TableCell>
                {blog.author}
              </TableCell>
              <TableCell>
                {blog.user.name}
              </TableCell>
              <TableCell>
                {blog.likes}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList