/* eslint-disable no-case-declarations */
import blogsService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'INIT_BLOGS':
    return action.data
  case 'VOTE':
    const id = action.data.id
    const blogToChange = state.find(n => n.id === id)
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes+1
    }
    return state.map(blog =>
      blog.id !== id ? blog : changedBlog
    )
  case 'REMOVE_BLOG':
    return state.filter(b => b.id !== action.id)
  default: return state
  }
}

export const createNewBlog = (data) => {
  return async dispatch => {
    const newBlog = await blogsService.create(data)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const toggleVote = (blog) => {
  return async dispatch => {
    const updatedBlog = await blogsService.update(blog)
    dispatch({
      type: 'VOTE',
      data: updatedBlog,
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogsService.remove(id)
    dispatch({
      type: 'REMOVE_BLOG',
      id: id,
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogsService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export default reducer