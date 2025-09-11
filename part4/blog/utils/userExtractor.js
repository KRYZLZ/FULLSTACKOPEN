const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')

module.exports = (request, response, next) => {
    try {
        const authorization = request.get('authorization')
        let token = ""

        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            token = authorization.substring(7)
        }

        if (!token) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const decodedToken = jwt.verify(token, JWT_SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const userId = decodedToken.id
        request.userId = userId

        next()
    } catch (error) { next(error) }
}