import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addCommentToBlog } from '../store/reducers/blogsReducer'
import { showNotification } from '../store/reducers/notificationReducer'
import { Button, Form, InputGroup } from 'react-bootstrap'

const Comments = ({ blog }) => {
  const dispatch = useDispatch()
  const [newComment, setNewComment] = useState('')

  const handleAddComment = async event => {
    event.preventDefault()

    if (newComment.trim() === '') return

    try {
      await dispatch(addCommentToBlog(blog.id, newComment))
      setNewComment('')
      dispatch(showNotification('Comment added successfully', 'success'))
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      dispatch(showNotification(errorMessage, 'danger'))
    }
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
