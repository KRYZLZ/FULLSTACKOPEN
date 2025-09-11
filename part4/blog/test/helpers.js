const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')
const server = require('../index')
const User = require('../models/user.schemas')
const { JWT_SECRET } = require('../utils/config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
    {
        title: 'First blog',
        author: 'Jane Doe',
        url: 'https://example.com/first-blog',
        likes: 1
    },
    {
        title: 'Second blog',
        author: 'Jane Doe',
        url: 'https://example.com/second-blog',
        likes: 2
    },
    {
        title: 'Third blog',
        author: 'Jane Doe',
        url: 'https://example.com/third-blog',
        likes: 3
    },
    {
        title: 'Fourth blog',
        author: 'Charlie Brown',
        url: 'https://example.com/fourth-blog',
        likes: 4
    },
    {
        title: 'Fifth blog',
        author: 'Charlie Brown',
        url: 'https://example.com/fifth-blog',
        likes: 5
    }
]

const getAllContentFromBlogs = async () => {
    const response = await api.get('/api/blogs')
    return {
        titles: response.body.map(r => r.title),
        totalLikes: response.body.reduce((sum, body) => sum + body.likes, 0),
        response
    }
}

const closeConnections = async () => {
    await mongoose.connection.close()
    await server.close()
}

const getUsers = async () => {
    const usersDB = await User.find({})
    return usersDB.map(user => user.toJSON())

}

const getTokenUser = async () => {
    const passwordHash = await bcrypt.hash('testpassword', 10)

    const user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash
    })

    const savedUser = await user.save()

    const userForToken = {
        username: savedUser.username,
        id: savedUser._id
    }

    const token = jwt.sign(userForToken, JWT_SECRET)

    return { token, user: savedUser }
}

module.exports = {
    initialBlogs,
    getUsers,
    getTokenUser,
    api,
    getAllContentFromBlogs,
    closeConnections
}