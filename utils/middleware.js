const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "Unkown endpoint"})
}

const errorHandler = (error, request, response, next) => {
  if (error) {
    return response.status(400).send({error: error.message})
  }
  next(error)
}

const logger = (...params) => {
  console.log(...params)
}

module.exports = {errorHandler, unknownEndpoint, logger}