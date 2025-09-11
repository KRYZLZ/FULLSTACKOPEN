const { PORT } = require('./utils/config')
const app = require('./app')
const { Info } = require('./utils/logger')

const server = app.listen(PORT, () => {
    Info(`Server running on port ${PORT}`)
})

module.exports = server