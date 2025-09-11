const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user.schemas')
const { JWT_SECRET } = require('../utils/config')

loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        response.status(401).json({
            error: 'invalid user or password'
        })
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(
        userForToken,
        JWT_SECRET,
        {
            expiresIn: 60 * 60 * 24 * 7  // 7 days
        }
    )

    response.status(200).json({
        name: user.name,
        username: user.username,
        token
    })
})

module.exports = loginRouter