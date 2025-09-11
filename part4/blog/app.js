const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog.routes')
const usersRouter = require('./controllers/user.routes')
const loginRouter = require('./controllers/login.routes')
const middleware = require('./utils/middleware')
require('./mongo')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app