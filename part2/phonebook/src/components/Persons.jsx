import personsService from '../services/persons'

export const Persons = ({ persons, setPersons, search }) => {
    const filterPersons = persons.filter(person =>
        person.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (id, name) => {
        if (confirm(`Delete ${name}?`)) {
            personsService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                })
        }
    }

    return (
        <div>
            {filterPersons.map(person =>
            (
                <div key={person.id}>
                    <p>
                        {person.name} {person.number}
                        <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
                    </p>
                </div>
            )
            )}
        </div>
    )
}
