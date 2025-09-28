import ToggleEvent from './Togglable'
import PropTypes from 'prop-types'

const Blogs = ({ blogs, onDeleteBlog, onLikeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map(blog => (
        <div
          key={blog.id}
          style={blogStyle}
          data-testid='blog'
          data-blog-title={blog.title}
        >
          <ToggleEvent text={blog.title} buttonLabel='view'>
            <p>
              <a href={blog.url}>{blog.url}</a>
            </p>
            <p>
              likes {blog.likes}
              <button onClick={() => onLikeBlog(blog.id)}>like</button>
            </p>
            <p>{blog.author}</p>
            <button
              onClick={() => onDeleteBlog(blog.id, blog.title)}
              style={{
                backgroundColor: '#4286f6',
                borderRadius: '5px',
                fontWeight: 500,
                border: 'none',
                marginBottom: '0.5rem',
              }}
            >
              delete
            </button>
          </ToggleEvent>
        </div>
      ))}
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array,
  onDeleteBlog: PropTypes.func,
  onLikeBlog: PropTypes.func,
}

export default Blogs
