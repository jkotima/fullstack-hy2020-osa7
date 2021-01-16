import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async blogObject => {
  const updatedBlog = {
    user: blogObject.user.id,
    likes: blogObject.likes,
    author: blogObject.author,
    title: blogObject.title,
    url: blogObject.url
  }

  const response = await axios.put(baseUrl+'/'+blogObject.id, updatedBlog)
  return response.data
}

const comment = async (blog, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl+'/'+blog.id+'/comments', { comment }, config)
  return response.data
}

const remove = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(baseUrl+'/'+blogObject.id, config)
  return response.data
}

export default { getAll, setToken, create, update, remove, comment }