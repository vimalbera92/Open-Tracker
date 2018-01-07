/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

/**
 * Constants used throught the application
 */
const CONSTANTS = {}

CONSTANTS.APP_PORT = 8000

CONSTANTS.BASE_URL = process.env.BASE_URL || 'localhost:8000/'

CONSTANTS.MAIL_TRACKER_URL = `${CONSTANTS.BASE_URL}track/`

CONSTANTS.GIF = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')
module.exports = CONSTANTS