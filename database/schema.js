/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'
/**
 * Constants related to database schema
 */
const SCHEMA = {}

SCHEMA.TOKEN_TABLE_QUERY = 'Create table token_detail (token TEXT PRIMARY KEY, created_at INTEGER, unique_action INTEGER, total_action INTEGER, last_unique_action_at INTEGER, last_action_at INTEGER)'
SCHEMA.TOKEN_ACTION_QUERY = 'Create table token_action (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, ip_address TEXT, user_agent TEXT, other TEXT, created_at INTEGER)'

module.exports = SCHEMA