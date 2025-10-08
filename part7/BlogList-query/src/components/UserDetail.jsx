import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const UserDetail = ({ users }) => {
  const { id } = useParams()
  const user = users.find(u => u.id === id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      {user.blogs.length === 0 ? (
        <p>No blogs added yet</p>
      ) : (
        <ul>
          {user.blogs.map(blog => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserDetail
