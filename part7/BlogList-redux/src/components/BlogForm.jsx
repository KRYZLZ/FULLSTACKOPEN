import { useRef } from 'react'
import Togglable from './Togglable'
import { createBlog } from '../store/reducers/blogsReducer'
import { useDispatch } from 'react-redux'
import { showNotification } from '../store/reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
  const dispatch = useDispatch()
  const togglableRef = useRef()

  const handleSubmit = async event => {
    event.preventDefault()

    const blogData = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
      likes: event.target.likes.value || 0,
    }

    try {
      await dispatch(createBlog(blogData))

      dispatch(
        showNotification(
          `A new blog "${blogData.title}" by ${blogData.author} added`,
          'success'
        )
      )

      event.target.reset()
      togglableRef.current.toggleVisibility()
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      dispatch(showNotification(errorMessage, 'danger'))
    }
  }

  return (
    <Togglable buttonLabel='create new' ref={togglableRef}>
      <h3>Create new</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>title:</Form.Label>
          <Form.Control data-testid='title' type='text' name='title' />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>author:</Form.Label>
          <Form.Control data-testid='author' type='text' name='author' />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>url:</Form.Label>
          <Form.Control data-testid='url' type='text' name='url' />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>likes:</Form.Label>
          <Form.Control data-testid='likes' type='number' name='likes' />
        </Form.Group>
        <Button variant='primary' className='w-100' type='submit'>
          Create
        </Button>
      </Form>
    </Togglable>
  )
}

export default BlogForm
