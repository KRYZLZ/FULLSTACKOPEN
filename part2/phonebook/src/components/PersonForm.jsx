import { useState } from 'react'
import personsService from '../services/persons'

export const PersonForm = ({ persons, setPersons, setMessage, setType }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const updateNumber = (person) => {
        const changedNumber = { ...person, number: newNumber }

        personsService
            .update(person.id, changedNumber)
            .then(returnedPerson => {
                setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
                setMessage(`Updated ${returnedPerson.name}'s number`)
                setType('success')
                setTimeout(() => {
                    setMessage(null)
                }, 3000)
            })
            .catch((error) => {
                setMessage(`${error.response.data.error}`)
                setType('error')
                setTimeout(() => {
                    setMessage(null)
                }, 3000)
            })
    }
    const addName = (event) => {
        event.preventDefault()

        const maxId = persons.length > 0
            ? Math.max(...persons.map(person => parseInt(person.id)))
            : 0
        const noteObject = {
            name: newName,
            number: newNumber,
            id: (maxId + 1).toString(),
        }

        if (persons.some(person => person.name === newName)) {
            if (confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {
                const existingPerson = persons.find(p => p.name === newName)
                updateNumber(existingPerson)
            }
        } else {
            personsService
                .create(noteObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setMessage(`Added ${returnedPerson.name}`)
                    setType('success')
                    setTimeout(() => {
                        setMessage(null)
                    }, 3000)
                    setNewName('')
                    setNewNumber('')
                })
                .catch(error => {
                    setMessage(`${error.response.data.error}`)
                    setType('error')
                    setTimeout(() => {
                        setMessage(null)
                    }, 3000)
                })
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)

    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <form onSubmit={addName}>
            <div>
                name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}
