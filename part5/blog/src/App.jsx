import { useEffect, useState } from 'react'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import blogsService from './services/blogs'
import { Notification } from './components/Notification'
import { LoginForm } from './components/loginForm'

const App = () => {
  const [blogs, setBlogs] = useState(null)
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)
  const [user, setUser] = useState(null)

  const showNotification = (msg, notificationType = 'success') => {
    setMessage(msg)
    setType(notificationType)

    setTimeout(() => {
      setMessage(null)
      setType(null)
    }, 3000)
  }

  const handleCreateBlog = async blogData => {
    try {
      const existingBlog = blogs.find(blog => blog.title === blogData.title)

      if (existingBlog) {
        const shouldReplace = window.confirm(
          `${blogData.title} is already added to blogs, replace the old one with a new one?`
        )

        if (shouldReplace) {
          const updatedBlog = await blogsService.update(
            existingBlog.id,
            blogData
          )
          setBlogs(blogs.map(b => (b.id === existingBlog.id ? updatedBlog : b)))
          showNotification(`Updated ${updatedBlog.title}`)
        }
        return
      }

      const newBlog = await blogsService.create(blogData)
      setBlogs(blogs.concat(newBlog))
      showNotification(
        `A new blog "${newBlog.title}" by ${newBlog.author} added`
      )
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      showNotification(errorMessage, 'error')
      throw error
    }
  }

  const handleLikeBlog = async id => {
    try {
      const updatedBlog = await blogsService.like(id)
      setBlogs(blogs.map(b => (b.id === id ? updatedBlog : b)))

      showNotification(`Liked "${updatedBlog.title}"`)
    } catch (error) {
      showNotification(`${error.response.data.error}`, 'error')
    }
  }

  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) {
      return
    }

    try {
      await blogsService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification(`Blog "${title}" deleted successfully`)
    } catch (error) {
      showNotification(`${error.response.data.error}`, 'error')
    }
  }

  useEffect(() => {
    blogsService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppuser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogsService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    blogsService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppuser')
  }

  if (!blogs) {
    return null
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} type={type} />

        <LoginForm setUser={setUser} showNotification={showNotification} />
      </div>
    )
  }

  return (
    <>
      <div>
        <h2>Blogs</h2>
        <Notification message={message} type={type} />

        <p>
          {`${user.name} logged in `}
          <button onClick={handleLogout}>logout</button>
        </p>

        <BlogForm onCreateBlog={handleCreateBlog} />

        <h3>Blogs</h3>
        <Blogs
          blogs={blogs}
          onDeleteBlog={handleDeleteBlog}
          onLikeBlog={handleLikeBlog}
        />
      </div>
    </>
  )
}

export default App
