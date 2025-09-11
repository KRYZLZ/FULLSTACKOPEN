const usersRouter = require('express').Router()
const User = require('../models/user.schemas')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({}).populate('blogs', {
            title: 1,
            author: 1,
            url: 1,
            likes: 1
        })
        response.json(users)
    } catch (error) { next(error) }
})

usersRouter.post('/', async (request, response, next) => {
    try {
        const { username, name, password } = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        if (!password || password.length < 3) {
            return response.status(400).json({
                error: 'password is required and must be at least 3 characters long'
            })
        }

        const user = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

module.exports = usersRouter