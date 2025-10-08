import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },
  },
})

export const { appendBlog, setBlogs, updateBlog, removeBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogsService.getAll()
      dispatch(setBlogs(blogs))
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
      throw error
    }
  }
}

export const createBlog = blogData => {
  return async dispatch => {
    try {
      const newBlog = await blogsService.create(blogData)
      dispatch(appendBlog(newBlog))
    } catch (error) {
      console.error('Failed to create blog:', error)
      throw error
    }
  }
}

export const likeBlog = id => {
  return async dispatch => {
    try {
      const updatedBlog = await blogsService.like(id)
      dispatch(updateBlog(updatedBlog))
    } catch (error) {
      console.error('Failed to like blog:', error)
      throw error
    }
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    try {
      await blogsService.remove(id)
      dispatch(removeBlog(id))
    } catch (error) {
      console.error('Failed to delete blog:', error)
      throw error
    }
  }
}

export const addCommentToBlog = (id, comment) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogsService.addComment(id, comment)
      dispatch(updateBlog(updatedBlog))
    } catch (error) {
      console.error('Failed to add comment:', error)
      throw error
    }
  }
}

export default blogSlice.reducer
