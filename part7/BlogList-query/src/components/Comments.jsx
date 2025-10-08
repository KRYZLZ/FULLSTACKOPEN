import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '../NotificationContext'
import blogService from '../services/blogs'

const Comments = ({ blog }) => {
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: updatedBlog => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b))
      )
      setNewComment('')
      showNotification('Comment added successfully')
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      showNotification(errorMessage, 5, true)
    },
  })

  const handleAddComment = event => {
    event.preventDefault()

    if (newComment.trim() === '') return

    addCommentMutation.mutate({ id: blog.id, comment: newComment })
  }

  return (
    <div>
      <h2>Comments</h2>
      <Form onSubmit={handleAddComment}>
        <InputGroup className='mb-3' size='xm'>
          <Form.Control
            type='text'
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            required
            placeholder='Add a comment'
          />
          <Button type='submit'>Add Comment</Button>
        </InputGroup>
      </Form>

      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  )
}

export default Comments
