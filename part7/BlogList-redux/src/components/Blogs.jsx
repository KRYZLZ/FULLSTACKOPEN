import BlogForm from './BlogForm'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Blogs = ({ blogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <BlogForm />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>URL</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {sortedBlogs.map(blog => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>{blog.author}</td>
              <td>{blog.url}</td>
              <td>{blog.likes}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
}

export default Blogs
