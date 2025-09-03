require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const PORT = process.env.PORT
const app = express()

//---------------------CORS && Middleware--------------------------------------------------------------------------

app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//---------------------ROUTES--------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(204).end()
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', async (req, res, next) => {
    try {
        const body = req.body
        const existingPerson = await Person.findOne({ name: body.name })

        if (existingPerson) {
            return res.status(400).json({ error: 'name must be unique' })
        }

        const person = new Person({
            name: body.name,
            number: body.number,
        })

        const savedPerson = await person.save()
        res.json(savedPerson)

    } catch (error) {
        next(error)
    }
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const { name, number } = req.body

    Person.findByIdAndUpdate(
        id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson)
            } else {
                res.status(404).json({ error: `person ${name} not found` })
            }
        })
        .catch(error => next(error))
})

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

//---------------------Error Handling Middleware--------------------------------------------------------------------------

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        const firstError = Object.values(error.errors)[0]
        return res.status(400).json({ error: firstError.message })
    }

    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

//---------------------Listen--------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})