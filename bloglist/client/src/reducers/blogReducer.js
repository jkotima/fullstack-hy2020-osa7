import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'ADD_BLOG':
    return [...state, action.data]
  case 'UPDATE_BLOG':
    return state.map(blog => blog.id === action.data.id
      ? action.data
      : blog
    )
  case 'REMOVE_BLOG':
    return state.filter(blog => blog.id !== action.data.id)
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const blogsSortedByLikes = blogs.sort((a, b) => b.likes - a.likes)
    dispatch({
      type: 'INIT_BLOGS',
      data: blogsSortedByLikes
    })
  }
}

export const addBlog = (blog) => {
  return async dispatch => {
    const returnedBlog = await blogService.create(blog)
    returnedBlog.user = blog.user
    dispatch({
      type: 'ADD_BLOG',
      data: returnedBlog
    })
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    blog.likes++
    const returnedBlog = await blogService.update(blog)
    returnedBlog.user = blog.user
    dispatch({
      type: 'UPDATE_BLOG',
      data: returnedBlog
    })
  }
}

export const commentBlog = (blog, comment) => {
  return async dispatch => {
    const returnedBlog = await blogService.comment(blog, comment)
    returnedBlog.user = blog.user
    dispatch({
      type: 'UPDATE_BLOG',
      data: returnedBlog
    })
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    await blogService.remove(blog)
    dispatch({
      type: 'REMOVE_BLOG',
      data: blog
    })
  }
}
export default blogReducer