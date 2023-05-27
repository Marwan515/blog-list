/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./api_test_helper')

const initialLength = helper.initialBlogs.length

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('Api Get api/blogs Expected to return content-type: application Json ', () =>  {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Verify id property exists', () => {
  test('check if id is a valid object property', async () => {
   const blogs = await api.get('/api/blogs')
   expect(blogs.body[0].id).toBeDefined()
  })
})

describe('Post request to the API with valid Blog', () => {
  test("Add a new blog data to the db", async () => {
    await api
      .post('/api/blogs')
      .send(helper.testPostBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const newResponse = await api.get('/api/blogs')
    const urls = newResponse.body.map(bd => bd.url)
    expect(newResponse.body).toHaveLength(initialLength + 1)
    expect(urls).toContain(helper.testPostBlog.url)
  })
})

describe('likes property defaults to zero', () => {
  test('like property default', async () => {
    await api
      .post('/api/blogs')
      .send(helper.testLikeDeafault)
      .expect(201)
  })
})

describe('missing important property test', () => {
  test('if title is missing should return 400', async () => {
    await api
      .post('/api/blogs')
      .send(helper.missingTitle)
      expect(400)
  })
  test('if url is missing should return 400', async () => {
    await api
      .post('/api/blogs')
      .send(helper.missingUrl)
      expect(400)
  })
  test('if author is missing should return 400', async () => {
    await api
      .post('/api/blogs')
      .send(helper.missingAuthor)
      expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})