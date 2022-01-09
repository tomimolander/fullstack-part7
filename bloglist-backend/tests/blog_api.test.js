const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs identified with id', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body
  expect(contents[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Guide to testing',
    author: 'Tomi M',
    url: 'NA',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((n) => n.title)
  expect(titles).toContain(
    'Guide to testing',
  )
})

test('blog without likes has zero likes', async () => {
  const newBlog = {
    title: 'Guide to testing',
    author: 'Tomi M',
    url: 'NA',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  newBlogAtEnd = blogsAtEnd.find((blog) => blog.title==='Guide to testing')
  expect(newBlogAtEnd.likes).toBeDefined()
})

test('blog without title and url returns 400', async () => {
  const newBlog = {
    author: 'Tomi M',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1,
    )

    const ids = blogsAtEnd.map((r) => r.id)

    expect(ids).not.toContain(blogToDelete.id)
  })
})

describe('changing the content of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToChange = blogsAtStart[0]

    blogToChange.author = 'Changed Author'
    blogToChange.url = 'N/A'
    blogToChange.likes = 2000

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const authors = blogsAtEnd.map((r) => r.author)
    const urls = blogsAtEnd.map((r) => r.url)

    expect(authors).toContain(blogToChange.author)
    expect(urls).toContain(blogToChange.url)

    changedBlogAtEnd = blogsAtEnd.find((blog) => blog.author==='Changed Author')
    expect(changedBlogAtEnd.likes).toEqual(2000)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
