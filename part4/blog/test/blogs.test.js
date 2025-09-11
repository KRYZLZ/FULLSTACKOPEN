const Blog = require('../models/blog.schemas')
const { initialBlogs, api, getAllContentFromBlogs, closeConnections, getTokenUser } = require('./helpers')
const { favoriteBlog, mostBlogs, mostLikes } = require('../utils/functions')
const User = require('../models/user.schemas')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../utils/config')

let token = null
let testUser = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const tokendata = await getTokenUser()
    token = tokendata.token
    testUser = tokendata.user

    for (const blog of initialBlogs) {
        const blogObject = new Blog(
            {
                ...blog,
                user: testUser._id
            }
        )
        await blogObject.save()
    }
})

afterAll(closeConnections)

describe('Get all blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const { response } = await getAllContentFromBlogs()

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('One blog is about', async () => {
        const { titles } = await getAllContentFromBlogs()

        expect(titles).toContain('First blog')
    })

})

describe('POST /api/blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'Alice Smith',
            url: 'https://example.com/new-blog',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const { titles, response } = await getAllContentFromBlogs()

        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain(newBlog.title)
    })

    test('a invalid blog cannot be added, title is missing', async () => {
        const newBlog = {
            author: 'Alice Smith',
            url: 'https://example.com/new-blog',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const { response } = await getAllContentFromBlogs()

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('token is missing', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'Alice Smith',
            url: 'https://example.com/new-blog',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const { response } = await getAllContentFromBlogs()

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('token is invalid', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'Alice Smith',
            url: 'https://example.com/new-blog',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer tokenfake')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const { response } = await getAllContentFromBlogs()

        expect(response.body).toHaveLength(initialBlogs.length)
    })
})

describe('DELETE /api/blogs/:id', () => {
    test('a blog can be deleted', async () => {
        const { response } = await getAllContentFromBlogs()
        const blogToDelete = response.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const { titles } = await getAllContentFromBlogs()

        expect(titles).not.toContain(blogToDelete.title)
    })

    test('a blog cannot be deleted if it does not exist', async () => {
        const { response } = await getAllContentFromBlogs()

        await api
            .delete('/api/blogs/1234')
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('a blog cannot be deleted if the user is not the creator', async () => {
        const passwordHash = await bcrypt.hash('bob123', 10)

        const anotherUser = new User({
            username: 'Bob',
            name: 'Bob Builder',
            passwordHash
        })

        const savedAnotherUser = await anotherUser.save()

        const userForToken = {
            username: savedAnotherUser.username,
            id: savedAnotherUser._id
        }

        const anotherUserToken = jwt.sign(userForToken, JWT_SECRET)
        const anotherUserData = {
            token: anotherUserToken,
            user: savedAnotherUser
        }

        const { response } = await getAllContentFromBlogs()
        const blogToDelete = response.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${anotherUserData.token}`)
            .expect(403)

        const { response: afterResponse } = await getAllContentFromBlogs()
        expect(afterResponse.body).toHaveLength(initialBlogs.length)
    })

    test('a blog cannot be deleted, token is missing', async () => {
        const { response } = await getAllContentFromBlogs()
        const blogToDelete = response.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)

        const { response: afterResponse } = await getAllContentFromBlogs()

        expect(afterResponse.body).toHaveLength(initialBlogs.length)
    })
})

describe('total likes', () => {
    test('of empty list is zero', async () => {
        await Blog.deleteMany({})
        const { totalLikes } = await getAllContentFromBlogs()

        expect(totalLikes).toBe(0)
    })

    test('when list has only one blog equals the likes of that blog', async () => {
        const newBlogs = await Blog.find({})
        const firstBlogId = newBlogs[0]._id
        await Blog.deleteMany({ _id: { $ne: firstBlogId } })
        const { totalLikes } = await getAllContentFromBlogs()

        expect(totalLikes).toBe(newBlogs[0].likes)
    })

    test('of a bigger list is calculated right', async () => {
        const { totalLikes } = await getAllContentFromBlogs()

        expect(totalLikes).toBe(15)
    })
})

describe('Blog:', () => {
    test('favorite', async () => {
        const fav = await favoriteBlog({ Blog })
        expect(fav).toEqual({
            title: 'Fifth blog',
            author: 'Charlie Brown',
            likes: 5
        })
    })
    test('Author with most blogs', async () => {
        const most = await mostBlogs({ Blog })

        expect(most).toEqual({
            author: 'Jane Doe',
            blogs: 3
        })
    })
    test('Author with most likes', async () => {
        const most = await mostLikes({ Blog })

        expect(most).toEqual({
            author: 'Charlie Brown',
            likes: 9
        })
    })
})

describe('Update', () => {
    test('Update likes of a blog', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = { ...blogToUpdate, likes: 10 }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await Blog.find({})

        expect(blogsAtEnd[0].likes).toBe(10)
    })

    test('Update likes of a blog without token', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = { ...blogToUpdate, likes: 10 }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(401)

        const blogsAtEnd = await Blog.find({})

        expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes)
    })
})