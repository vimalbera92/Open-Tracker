/**
 * Created by vimalbera on 06/01/18.
 */
'use strict'

const ERR_MSG = 'No error message hence printing default message'
const LogLevel = {
  ERROR: 'ERROR',
  INFO: 'INFO',
  FATAL: 'FATAL',
  WARN: 'WARN'
}

function _getCallerFile() {
  // preserve original function
  const originalFunction = Error.prepareStackTrace
  try {
    var err = new Error();
    var callerfile;
    var currentfile;

    Error.prepareStackTrace = function (err, stack) { return stack; };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if(currentfile !== callerfile) {
        callerfile = callerfile.split('/').pop().slice(0, -3)
        break
      }
    }
  } catch (err) {}
  Error.prepareStackTrace = originalFunction
  return callerfile;
}

const log = function (logLevel, action, msg, err) {

  const file = _getCallerFile()

  const log = {
    logLevel: logLevel,
    timestamp: new Date().getTime() // log time
  }

  if(file) {
    log.class = file
  }

  if (action) {
    log.action = action
  }

  if (msg) {
    log.msg = msg
  }

  if (err) {
    // if error log has no message, it will print the default message
    log.msg = msg || ERR_MSG
    log.error = err.stack || JSON.stringify(err)
  }

  if (log.logLevel === LogLevel.ERROR || log.logLevel === LogLevel.FATAL) {
    console.error(JSON.stringify(log)) // eslint-disable-line no-console
  } else {
    console.log(JSON.stringify(log)) // eslint-disable-line no-console
  }
}

// log info
const info = function info (action, msg) {
  log(LogLevel.INFO, action, msg)
}

// log error
const err = function err (action, msg, err) {
  log(LogLevel.ERROR, action, msg, err)
}

// log fatal error
const fatal = function fatal (action, msg, err) {
  log(LogLevel.FATAL, action, msg, err)
}

// log warnings
const warn = function warn (action, msg, err) {
  log(LogLevel.WARN, action, msg, err)
}

module.exports = { info, err, fatal, warn }