import { useParams } from 'react-router-dom'
import Comments from './Comments'
import { Button } from 'react-bootstrap'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '../NotificationContext'
import blogService from '../services/blogs'

const BlogDetail = ({ blogs }) => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const updateLikeMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: updatedBlog => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b))
      )
      showNotification(`You liked '${updatedBlog.title}'`)
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      showNotification(errorMessage, 5, true)
    },
  })

  const handleLikeBlog = () => {
    updateLikeMutation.mutate(blog.id)
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
