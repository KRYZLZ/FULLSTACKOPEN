import { createSlice } from '@reduxjs/toolkit'
import loginService from '../../services/login'
import blogService from '../../services/blogs'

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = loginSlice.actions

export const loginUser = credentials => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogAppuser', JSON.stringify(user))
      blogService.setToken(user.token)

      dispatch(setUser(user))
      return user
    } catch (error) {
      throw error
    }
  }
}

export const initializeUser = () => {
  return async dispatch => {
    const loggerdUserJSON = window.localStorage.getItem('loggedBlogAppuser')
    if (loggerdUserJSON) {
      const user = JSON.parse(loggerdUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogAppuser')
    blogService.setToken(null)
    dispatch(clearUser())
  }
}

export default loginSlice.reducer
