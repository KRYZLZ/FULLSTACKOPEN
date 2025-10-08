import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { likeBlog } from '../store/reducers/blogsReducer'
import { showNotification } from '../store/reducers/notificationReducer'
import Comments from './Comments'
import { Button } from 'react-bootstrap'
const BlogDetail = ({ blogs }) => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const handleLikeBlog = async (id, title) => {
    try {
      await dispatch(likeBlog(id))

      dispatch(showNotification(`Liked "${title}"`, 'success'))
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      dispatch(showNotification(errorMessage, 'danger'))
    }
  }
  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes
        <Button
          variant='outline-primary'
          className='ms-2'
          size='sm'
          onClick={() => handleLikeBlog(blog.id, blog.title)}
        >
          like
        </Button>
      </p>
      <p>added by {blog.author}</p>
      <Comments blog={blog} />
    </div>
  )
}

export default BlogDetail
