const { Info, Error } = require('./logger')

const requestLogger = (request, response, next) => {
    Info('Method:', request.method)
    Info('Path:', request.path)
    Info('Body:', request.body)
    Info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    Error('=== ERROR HANDLER START ===')
    Error('Error name:', error.name)
    Error('Error message:', error.message)
    Error('Response already sent?:', response.headersSent)

    // Si ya se envió respuesta, no hacer nada
    if (response.headersSent) {
        Error('Response already sent, calling next(error)')
        return next(error)
    }

    try {
        if (error.name === 'CastError') {
            Error('Handling CastError')
            return response.status(400).send({ error: 'malformatted id' })
        }

        if (error.name === 'ValidationError') {
            Error('Handling ValidationError')

            // Manejar errores de unique validator
            if (error.message.includes('expected `username` to be unique')) {
                return response.status(400).json({ error: 'expected `username` to be unique' })
            }

            const firstError = Object.values(error.errors)[0]
            return response.status(400).json({ error: firstError.message })
        }

        if (error.name === 'JsonWebTokenError') {
            Error('Handling JsonWebTokenError - sending 401')
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (error.name === 'TokenExpiredError') {
            Error('Handling TokenExpiredError')
            return response.status(401).json({ error: 'token expired' })
        }

        // Error no manejado
        Error('Unhandled error, sending 500')
        return response.status(500).json({ error: 'internal server error' })

    } catch (handlerError) {
        Error('Error in error handler:', handlerError.message)
        return response.status(500).json({ error: 'internal server error' })
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}