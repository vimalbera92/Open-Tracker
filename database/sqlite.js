/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

const sqlite3 = require('sqlite3').verbose()
const constants = require('../util/constants')
const Promise = require('bluebird')
const logger = require('../util/logger')
const schema = require('./schema')

let db
/**
 * Function to create tables on initializing application
 * @returns {Promise.<TResult>}
 * @private
 */
const _createTables = function () {
  const execQuery = Promise.promisify(db.run, {context: db})
  return execQuery(schema.TOKEN_TABLE_QUERY)
    .then(() => {
      return execQuery(schema.TOKEN_ACTION_QUERY)
    })
    .catch((err) => {
      Promise.reject(err)
    })
}

/**
 * Function to execute query which returns no result
 * @param sql
 */
const executeQuery = function (sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

/**
 * Function to execute count query
 * @param sql
 */
const executeCountQuery = function (sql) {
  return new Promise((resolve, reject) => {
    db.each(sql, function (err, count) {
      if (err) {
        return reject(err)
      }
      return resolve(count)
    })
  })
}

/**
 * Function to execute select query which return multiple rows
 * @param sql
 */
const executeSelectQuery = function (sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, function (err, rows) {
      if (err) {
        return reject(err)
      }
      return resolve(rows)
    })
  })
}

/**
 * Function to initialize database on application start
 */
const init = function () {
  db = new sqlite3.Database(':memory:')
  _createTables().then(() => {
    logger.info('startup', 'db connected successfully')
    Promise.resolve()
  }).catch((err) => {
    Promise.reject(err)
  })
}

module.exports = {
  init,
  executeQuery,
  executeCountQuery,
  executeSelectQuery
}
