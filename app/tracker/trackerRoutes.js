/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

const constants = require('../../util/constants')
const trackerService = require('./trackerService')
const logger = require('../../util/logger')

module.exports = function (app) {

  /**
   * Route to generate unique link for tracking
   */
  app.get('/generateLink', function (req, res, next) {
    trackerService.getToken().then((token) => {
      res.status(200).send(constants.MAIL_TRACKER_URL + token)
    }).catch((err) => {
      next(err)
    })
  })

  /**
   * Route to track request for passed token
   */
  app.get('/track/:token', function (req, res, next) {
    trackerService.track(req).then(() => {
      logger.info('track', `Request processed for tracking token ${req.params.token}`)
    }).catch((err) => {
      next(err)
    })
    res.send(constants.GIF, {'Content-Type': 'image/gif'}, 200)
  })

  /**
   * Route to retrieve token action history data
   */
  app.get('/getTokenActionHistory/:token', function (req, res, next) {
    trackerService.getAllActionOfToken(req.params.token).then((result) => {
      res.send(result)
    }).catch((err) => {
      Promise.reject(err)
    })
  })

  /**
   * Route to retrieve tracking stats of token
   */
  app.get('/getStats/:token', function (req, res, next) {
    trackerService.getStats(req.params.token).then((result) => {
      res.send(result)
    }).catch((err) => {
      Promise.reject(err)
    })
  })
}
