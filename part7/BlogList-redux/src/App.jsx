import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './store/reducers/blogsReducer'
import { logoutUser, initializeUser } from './store/reducers/userReducer'
import { initializeUsers } from './store/reducers/usersReducer'
import { Routes, Route, Link, Navigate } from 'react-router-dom'

import Notification from './components/Notification'
import Users from './components/Users'
import LoginForm from './components/LoginForm'
import UserDetail from './components/UserDetail'
import BlogDetail from './components/BlogDetail'
import Blogs from './components/Blogs'

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to='/login' replace />
  }
  return children
}

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  if (!blogs) {
    return null
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
