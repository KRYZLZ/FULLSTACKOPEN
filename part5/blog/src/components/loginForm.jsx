import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

export const LoginForm = ({ showNotification, setUser }) => {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleUsernameChange = event => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleLogin = async event => {
    try {
      event.preventDefault()
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppuser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      showNotification(`${error.response.data.error}`, 'error')
    }
  }

  return (
    <Togglable buttonLabel='show login'>
      <form onSubmit={handleLogin}>
        <div>
          <input
            data-testid='username'
            type='text'
            value={username}
            name='Username'
            placeholder='Username'
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <input
            data-testid='password'
            type='password'
            value={password}
            name='Password'
            placeholder='Password'
            onChange={handlePasswordChange}
          />
        </div>
        <button>login</button>
      </form>
    </Togglable>
  )
}

LoginForm.displayName = 'LoginForm'

LoginForm.propTypes = {
  showNotification: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
}
