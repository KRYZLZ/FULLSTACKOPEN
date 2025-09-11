const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const { Info, Error } = require('./utils/logger')

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)
    .then((result) => {
        Info('connected to MongoDB', result.connection.name);
    })
    .catch((error) => {
        Error('error connecting to MongoDB:', error.message);
    });

process.on('uncaughtException', (error) => {
    Error('uncaughtException:', error.message);
    mongoose.connection.disconnect()
});

module.exports = mongoose