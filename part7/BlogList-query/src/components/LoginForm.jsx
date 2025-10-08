import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { useNotification } from '../NotificationContext'
import login from '../services/login'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const LoginForm = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: user => {
      queryClient.setQueryData(['user'], user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      showNotification('Login successful')
      navigate('/')
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      showNotification(errorMessage, 5, true)
    },
  })

  const handleLogin = async event => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    loginMutation.mutate({ username, password })
    event.target.username.value = ''
    event.target.password.value = ''
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
            name='username'
            placeholder='Username'
            required
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            data-testid='password'
            type='password'
            name='password'
            placeholder='Password'
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
