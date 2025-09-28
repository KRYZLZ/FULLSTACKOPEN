const blogRouter = require('express').Router()
const Blog = require('../models/blog.schemas')
const User = require('../models/user.schemas')
const { favoriteBlog, mostBlogs, mostLikes } = require('../utils/functions')
const userExtractor = require('../utils/userExtractor')

blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', {
            username: 1,
            name: 1
        })
        response.json(blogs)
    } catch (error) { next(error) }
})

blogRouter.get('/likes/total', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
        response.json({ totalLikes })
    } catch (error) { next(error) }
})

blogRouter.get('/favorite', async (request, response, next) => {
    try {
        const favorite = await favoriteBlog({ Blog })
        response.json(favorite)
    } catch (error) { next(error) }
})

blogRouter.get('/mostlikes', async (request, response, next) => {
    try {
        const most = await mostLikes({ Blog })
        response.json(most)
    } catch (error) { next(error) }
})

blogRouter.get('/mostblogs', async (request, response, next) => {
    try {
        const most = await mostBlogs({ Blog })
        response.json(most)
    } catch (error) { next(error) }
})

blogRouter.post('/', userExtractor, async (request, response, next) => {
    try {
        const body = request.body
        const userId = request.userId

        const user = await User.findById(userId)

        if (!user) {
            return response.status(401).json({ error: 'user not found' })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    } catch (error) { next(error) }
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
    try {
        const id = request.params.id
        const blog = await Blog.findById(id)

        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        if (blog.user.toString() !== request.userId) {
            return response.status(403).json({ error: 'forbidden: you can only delete your own blogs' })
        }

        const deletedBlog = await Blog.findByIdAndDelete(id)
        if (deletedBlog) {
            response.status(204).end()
        } else {
            response.status(400).end()
        }
    } catch (error) { next(error) }
})

blogRouter.put('/:id', userExtractor, async (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
        if (updatedBlog) {
            response.json(updatedBlog)
        } else {
            response.status(404).end()
        }
    } catch (error) { next(error) }
})

blogRouter.patch('/:id/like', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        blog.likes = blog.likes + 1
        const updatedBlog = await blog.save()

        response.json(updatedBlog)

    } catch (error) {
        next(error)
    }
})

module.exports = blogRouter
