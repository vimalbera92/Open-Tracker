const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const http = require('http')
const logger = require('./util/logger')
const constants = require('./util/constants')
const port = constants.APP_PORT
const sqlite = require('./database/sqlite')
const Promise = require('bluebird')

const app = express()
const httpServer = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

// registering routers
require('./app/tracker/trackerRoutes')(app)

//shutting down server gracefully
const gracefulStopServer = function () {
  httpServer.close(function () {
    process.exit(0)
  })
}

process.on('SIGTERM', gracefulStopServer)
process.on('SIGINT', gracefulStopServer)

// registering error handler
require('./app/error/errorHandler')(app)

Promise.try(() => {
  sqlite.init()
}).then(() => {
  return new Promise((resolve, reject) => {
    return httpServer.listen(port, function (err) {
      if (!err) {
        logger.info('startup', 'Staring server app listening on port: ' + port + '!')
        resolve()
      } else {
        reject(err)
      }
    })
  })
}).catch((err) => {
  logger.err('startup', 'error: ' + err.message, err)
  process.exit(1)
})