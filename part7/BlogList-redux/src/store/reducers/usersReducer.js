import { createSlice } from '@reduxjs/toolkit'
import userService from '../../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const { setUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async dispatch => {
    try {
      const users = await userService.getAll()
      dispatch(setUsers(users))
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }
}

export default usersSlice.reducer
