import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Notification from './components/Notification'
import Users from './components/Users'
import LoginForm from './components/LoginForm'
import UserDetail from './components/UserDetail'
import BlogDetail from './components/BlogDetail'
import Blogs from './components/Blogs'

import userService from './services/users'
import blogService from './services/blogs'

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to='/login' replace />
  }
  return children
}

const App = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      queryClient.setQueryData(['user'], user)
      blogService.setToken(user.token)
    }
  }, [queryClient])

  const user = queryClient.getQueryData(['user'])

  const {
    data: blogs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
  })

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorMessage,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1,
  })

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    queryClient.setQueryData(['user'], null)
    queryClient.clear()
    blogService.setToken(null)
    navigate('/login')
  }

  if (isLoading || usersLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>Error loading blogs: {error.message}</div>
  }

  if (usersError) {
    return <div>Error loading users: {usersErrorMessage.message}</div>
  }

  return (
    <div className='container mt-3'>
      <Notification />
      {user && (
        <Navbar
          collapseOnSelect
          expand='lg'
          bg='light'
          variant='light'
          className='mb-3'
        >
          <Container>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav className='mx-auto'>
                <Nav.Link as={Link} to='/'>
                  Blogs
                </Nav.Link>
                <Nav.Link as={Link} to='/users'>
                  Users
                </Nav.Link>
              </Nav>
              <Nav>
                <Navbar.Text className='me-2'>
                  {user.name} logged in
                </Navbar.Text>
                <Button
                  variant='outline-secondary'
                  size='sm'
                  onClick={handleLogout}
                >
                  logout
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <h2 className='text-center mb-2'>Blog App</h2>
      <Routes>
        <Route
          path='/login'
          element={user ? <Navigate replace to='/' /> : <LoginForm />}
        />

        <Route
          path='/users'
          element={
            <ProtectedRoute user={user}>
              <Users users={users} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/users/:id'
          element={
            <ProtectedRoute user={user}>
              <UserDetail users={users} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/blogs/:id'
          element={
            <ProtectedRoute user={user}>
              <BlogDetail blogs={blogs} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute user={user}>
              <Blogs blogs={blogs} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
