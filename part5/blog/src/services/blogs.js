import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

const remove = id => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

const like = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/like`, {}, config)
  return response.data
}

export default { getAll, create, update, remove, setToken, like }
