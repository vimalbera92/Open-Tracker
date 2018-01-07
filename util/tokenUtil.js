/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

const uuid = require('uuid/v4')

/**
 * Function to generate unique token using uuid
 * @returns {*}
 */
const generateToken = function () {
  return uuid()
}

/**
 * Retrieve details from request
 * @param req
 * @returns {{}}
 */
const retrieveRequestDetail = function (req) {
  const detail = {}
  detail.token = req.params.token
  detail.ip = req.ip
  detail.userAgent = req.headers['user-agent']
  detail.other = JSON.stringify(req.headers)
  return detail
}

module.exports = {
  generateToken,
  retrieveRequestDetail
}
