import axios from 'axios'
const baseUrl = '/api/login'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials, { cancelToken: source.token })
  return response.data
}

const cancel = async () => {
  source.cancel()
}

export default { login, cancel }