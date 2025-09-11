const bcrypt = require('bcrypt')
const User = require('../models/user.schemas')
const { api, closeConnections, getUsers } = require('./helpers')

afterAll(closeConnections)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pswd', 10)
        const user = new User({
            username: 'root',
            name: 'root',
            passwordHash
        })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'user1',
            name: 'user1',
            password: 'user1pass',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'root',
            name: 'Duplicate User',
            password: 'newpassword',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })
    test('Password is required', async () => {
        const userAtStart = await getUsers()

        const newUser = {
            username: 'user2',
            name: 'User Two'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

    test('Username is required', async () => {
        const userAtStart = await getUsers()

        const newUser = {
            name: 'User Two',
            password: 'user2pass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

    test('Username must be at least 3 characters long', async () => {
        const userAtStart = await getUsers()

        const newUser = {
            username: 'us',
            name: 'User Two',
            password: 'user2pass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

    test('Password must be at least 3 characters long', async () => {
        const userAtStart = await getUsers()

        const newUser = {
            username: 'user2',
            name: 'User Two',
            password: 'pa'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

})