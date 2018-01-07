/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

const logger = require('./../../util/logger')
const customErrors = require('./errorCodes')
const _ = require('lodash')

/**
 *
 * @param code - error code assigned to err object
 * @returns object {code, statusCode, message}}
 * @private
 */
const _getCustomError = function (code) {

  const customErrorData = customErrors[code]
  // if empty, assign unknown error message and code
  if (_.isEmpty(customErrorData)) {
    return customErrors.UNKNOWN_ERROR
  }
  return customErrorData
}

module.exports = function (app) {

  const middlewareHandler = function (err, req, res, next) {
    // log original error before sending response to client
    logger.err(null, err.message, err)

    const customError = _getCustomError(err.code)
    // this will return custom status code and custom error message to client
    res.status(customError.statusCode).send({error: customError.message})
  }

  app.use(middlewareHandler)
}