import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  type: '',
}
const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },
    clearNotification: () => {
      return initialState
    },
  },
})

export const { clearNotification } = notificationSlice.actions

export const showNotification = (message, type, time = 5) => {
  return dispatch => {
    dispatch(notificationSlice.actions.setNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

export default notificationSlice.reducer
