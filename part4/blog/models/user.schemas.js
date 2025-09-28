const { min } = require('lodash')
const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: [true, 'Username must be unique'],
        minlength: [2, 'username must be at least 2 characters long']

    },
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [2, 'name must be at least 2 characters long']
    },
    passwordHash: {
        type: String,
    },
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // el passwordHash no debe mostrarse
        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User