/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

const sqlite = require('../../database/sqlite')
const Promise = require('bluebird')

/**
 * Function to save token to database
 * @param token
 * @returns {Promise.<TResult>}
 */
const save = function (token) {
  const sql = `insert into token_detail values ('${token}', ${Date.now()}, 0, 0, null, null)`
  return sqlite.executeQuery(sql).then(() => {
    Promise.resolve()
  }).catch((err) => {
    Promise.reject(err)
  })
}

/**
 * Function to check whether token is valid or not
 * @param token
 * @returns {Promise.<TResult>}
 */
const isValidToken = function (token) {
  const sql = `select count(*) as count from token_detail where token = '${token}'`
  return sqlite.executeCountQuery(sql).then((result) => {
    return Promise.resolve(result.count > 0 ? true : false)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/**
 * Function to save request details for tracking open action
 * @param requestDetail
 * @returns {Promise.<TResult>}
 */
const saveRequestDetails = function (requestDetail) {
  return _isUniqueAction(requestDetail.token, requestDetail.ip).then((isUnique) => {
    let sql
    if (isUnique) {
      sql = `update token_detail set total_action = total_action + 1, unique_action = unique_action + 1, last_unique_action_at = ${Date.now()}, last_action_at = ${Date.now()} where token = '${requestDetail.token}'`
    } else {
      sql = `update token_detail set total_action = total_action + 1, last_action_at = ${Date.now()} where token = '${requestDetail.token}'`
    }
    const tokenAction = `insert into token_action (token, ip_address, user_agent, other, created_at) values ('${requestDetail.token}', '${requestDetail.ip}', '${requestDetail.userAgent}', '${requestDetail.other}', ${Date.now()})`
    return sqlite.executeQuery(tokenAction).then(() => {
      return sqlite.executeQuery(sql).then(() => {
        return Promise.resolve()
      })
    })
  }).catch((err) => {
    Promise.reject(err)
  })
}

/**
 * Function to check whether request with token is unique or not
 * @param token
 * @param ip
 * @returns {Promise.<TResult>}
 * @private
 */
const _isUniqueAction = function (token, ip) {
  const sql = `select count(*) as count from token_action where token = '${token}' and ip_address = '${ip}'`
  return sqlite.executeCountQuery(sql).then((result) => {
    return Promise.resolve(result.count > 0 ? false : true)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/**
 * Function to retrieve all data of open action for given token
 * @param token
 * @returns {Promise.<TResult>}
 */
const getAllAction = function (token) {
  const sql = `select * from token_action where token = '${token}'`
  return sqlite.executeSelectQuery(sql).then((result) => {
    return Promise.resolve(result)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/**
 * Function to fetch stats of given token
 * @param token
 * @returns {Promise.<TResult>}
 */
const getStats = function (token) {
  const sql = `select * from token_detail where token = '${token}'`
  return sqlite.executeSelectQuery(sql).then((result) => {
    return Promise.resolve(result)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

module.exports = {
  save,
  isValidToken,
  saveRequestDetails,
  getAllAction,
  getStats
}