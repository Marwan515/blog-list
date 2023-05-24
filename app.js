const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const morgan = require('morgan')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

middleware.logger('connecting to ', config.mongodUrl)

mongoose.connect(config.mongodUrl)
  .then(() => {
    middleware.logger('connected to MongoDB')
  })
  .catch((error) => {
    middleware.logger('Error connecting to MongoDB:',error.message)
  })
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :body'))

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app