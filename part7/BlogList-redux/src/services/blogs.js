import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async newObject => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const request = await axios.post(baseUrl, newObject, config)
  return request.data
}

const update = async (id, newObject) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const request = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.data
}

const remove = async id => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}

const like = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/like`, {}, config)
  return response.data
}

const addComment = async (id, comment) => {
  const request = await axios.post(`${baseUrl}/${id}/comments`, { comment })
  return request.data
}

export default { getAll, create, update, remove, setToken, like, addComment }
