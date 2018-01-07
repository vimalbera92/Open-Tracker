/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

const util = require('./../../util/tokenUtil')
const trackerDao = require('./trackerDao')
const logger = require('./../../util/logger')
const Promise = require('bluebird')

/**
 * Function to generate and save token to database
 * @returns {Promise.<TResult>}
 */
const getToken = function () {
  const token = util.generateToken()
  return trackerDao.save(token).then(() => {
    return Promise.resolve(token)
  }).catch((err) => {
    logger.err('save token', `Error while saving token ${token}`, err)
    return Promise.reject(err)
  })
}

/**
 * Function to validate request with token and store request details
 * @param req
 * @returns {Promise.<TResult>}
 */
const track = function (req) {
  const token = req.params.token
  return trackerDao.isValidToken(token).then((isValid) => {
    if (isValid) {
      const requestDetail = util.retrieveRequestDetail(req)
      return trackerDao.saveRequestDetails(requestDetail).then(() => {
        logger.info('track', `Valid request with token ${token}`)
        return Promise.resolve()
      })
    } else {
      logger.info('track', `Invalid request with token ${token}`)
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/**
 * Function to retrieve all actions of request for token
 * @param token
 * @returns {Promise.<TResult>}
 */
const getAllActionOfToken = function (token) {
  return trackerDao.getAllAction(token).then((result) => {
    return Promise.resolve(result)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/**
 * Function to get stats of actions for token
 * @param token
 * @returns {Promise.<TResult>}
 */
const getStats = function (token) {
  return trackerDao.getStats(token).then((result) => {
    return Promise.resolve(result)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

module.exports = {
  getToken,
  track,
  getAllActionOfToken,
  getStats
}
