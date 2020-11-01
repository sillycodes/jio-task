/**
 * Log4js file
 * While startup of node app you can pass argument logLevel=ERROR or DEBUG or WARN or INFO
 */
/*global module, process, require*/
const log4js = require('log4js');
const nconf = require('nconf');

//Configuration of logs files
const path = require('path');
const loggerConfiguration = require('./loggerConfiguration.js');
const local_path = path.resolve(__dirname, '../');
log4js.configure(loggerConfiguration.config(), { cwd: local_path });

// creating the Logger

const loggers = {};

/** Creating a common function to handle log category
 * @param name name of the category to log to
 */
function getLogHandler(name) {
    if (loggers[name] == null) {
        const loggerInstance = log4js.getLogger(name);
        const logLevelToUse = determineLogLevelToUse();
        if (logLevelToUse !== undefined) {
            loggerInstance.setLevel(logLevelToUse);
        }
        loggers[name] = loggerInstance;
    }
    return loggers[name];
}

module.exports = {
    debug: debug,
    error: error,
    logRequest: logRequest,
    access: access
};

function determineLogLevelToUse() {
    var logLevelToUse = nconf.get('logLevel');
    return logLevelToUse;
}

function concanMsgFile(message, callerFileName) {
    if (callerFileName != null) {
        return callerFileName + message;
    } else {
        return message;
    }
}

function debug(message, callerFileName) {
    (getLogHandler('debug')).debug(concanMsgFile(message, callerFileName));
}

function error(message, callerFileName) {
    (getLogHandler('error')).error(concanMsgFile(message, callerFileName));
}

function access(message, callerFileName) {
    (getLogHandler('access')).error(concanMsgFile(message, callerFileName));
}

function logRequest(req, fileName) {
    debug('Request headers ' + JSON.stringify(req.headers), fileName);
    if (req.qs !== undefined) {
        debug('Request query parameters' + JSON.stringify(req.qs), fileName);
    } else if (req.body !== undefined) {
        debug('Request body' + JSON.stringify(req.body), fileName);
    }
}