const personRouter = require('express').Router()
const Person = require('../models/person')


//---------------------ROUTES--------------------------------------------------------------------------

personRouter.get('/', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

personRouter.get('/:id', (req, res, next) => {
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

personRouter.delete('/:id', (req, res, next) => {
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

personRouter.post('/', async (req, res, next) => {
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

personRouter.put('/:id', (req, res, next) => {
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


module.exports = personRouter