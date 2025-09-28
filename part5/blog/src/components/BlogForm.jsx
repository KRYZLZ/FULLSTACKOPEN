import { useRef, useState } from 'react'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

const BlogForm = ({ onCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const togglableRef = useRef()

  const handleSubmit = async event => {
    event.preventDefault()

    const blogData = {
      title,
      author,
      url,
      likes: likes || 0,
    }

    try {
      await onCreateBlog(blogData)

      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes('')
      togglableRef.current.toggleVisibility()
    } catch (error) {
      // El error ya fue manejado en onCreateBlog
    }
  }

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = event => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }

  const handleLikesChange = event => {
    setLikes(event.target.value)
  }

  return (
    <Togglable buttonLabel='new blog' ref={togglableRef}>
      <h3>Create new</h3>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            data-testid='title'
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input data-testid='url' value={url} onChange={handleUrlChange} />
        </div>
        <div>
          likes:
          <input
            data-testid='likes'
            value={likes}
            onChange={handleLikesChange}
          />
        </div>
        <button type='submit'>Create</button>
      </form>
    </Togglable>
  )
}

BlogForm.propTypes = {
  onCreateBlog: PropTypes.func,
}
export default BlogForm
