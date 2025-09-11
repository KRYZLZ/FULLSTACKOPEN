const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const Person = require('./models/person')
// const morgan = require('morgan')

const url = config.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        logger.info('connected to MongoDB', result.connection.name);
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message);
    });

// morgan.token('body', (req) => {
//     return req.method === 'POST' ? JSON.stringify(req.body) : ''
// })

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.get('/info', async (req, res, next) => {
    try {
        const count = await Person.countDocuments({})
        const date = new Date()
        res.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${date}</p>
        `)
    } catch (error) {
        next(error)
    }
})

app.use('/api/persons', personRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app