import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import { showNotification } from '../store/reducers/notificationReducer'
import { loginUser } from '../store/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleUsernameChange = event => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      await dispatch(loginUser({ username, password }))

      dispatch(showNotification('Login successful', 'success'))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      dispatch(showNotification(errorMessage, 'danger'))
    }
  }

  return (
    <>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className='mb-3'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            data-testid='username'
            type='text'
            value={username}
            name='Username'
            placeholder='Username'
            onChange={handleUsernameChange}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            data-testid='password'
            type='password'
            value={password}
            name='Password'
            placeholder='Password'
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>
        <Button className='w-100' variant='primary' type='submit'>
          login
        </Button>
      </Form>
    </>
  )
}

export default LoginForm
