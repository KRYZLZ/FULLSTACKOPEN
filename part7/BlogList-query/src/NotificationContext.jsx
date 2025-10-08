import { createContext, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { message: action.payload, type: 'success' }
    case 'SET_ERROR':
      return { message: action.payload, type: 'error' }
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch.notification
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch.notificationDispatch
}

export const useNotification = () => {
  const dispatch = useNotificationDispatch()

  const showNotification = (message, time = 5, isError = false) => {
    dispatch({
      type: isError ? 'SET_ERROR' : 'SET',
      payload: message,
    })

    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, time * 1000)
  }

  return { showNotification }
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node,
}

export default NotificationContext
