const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB', result.connection.name);
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'name must be at least 3 characters long'],
        required: [true, 'name is required']
    },
    number: {
        type: String,
        minlength: [8, 'number must be at least 8 characters long'],
        required: [true, 'number is required'],
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Format should be XX-XXXXXXX or XXX-XXXXXXX`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)