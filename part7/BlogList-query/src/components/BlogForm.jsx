import { useRef } from 'react'
import Togglable from './Togglable'
import { Form, Button } from 'react-bootstrap'

import { useNotification } from '../NotificationContext'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
const BlogForm = () => {
  const queryClient = useQueryClient()
  const togglableRef = useRef()
  const { showNotification } = useNotification()

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: newBlog => {
      queryClient.setQueryData(['blogs'], old => [...old, newBlog])
      showNotification(
        `A new blog "${newBlog.title}" by ${newBlog.author} added`
      )
      togglableRef.current.toggleVisibility()
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      showNotification(errorMessage, 5, true)
    },
  })

  const handleSubmit = event => {
    event.preventDefault()

    const blogData = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
      likes: event.target.likes.value || 0,
    }

    addBlogMutation.mutate(blogData)

    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    event.target.likes.value = ''
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
