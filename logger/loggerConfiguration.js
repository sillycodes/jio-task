/*global module, process, require */

const LOG_FILE_CATEGORIES = ['debug', 'error', 'access'];

module.exports = {
    config: config
};

function config() {
    var fileAppenders = [],
        loggerConfig = { appenders: [{ type: "clustered", appenders: fileAppenders }] };
    for (var index = 0; index < LOG_FILE_CATEGORIES.length; index++) {
        var fileAppender = {
            "type": "file",
            "absolute": false,
            "filename": "./log/Parking-Lot-" + LOG_FILE_CATEGORIES[index] + ".log",
            "maxLogSize": 10240000,
            "backups": 10,
            "category": LOG_FILE_CATEGORIES[index],
            "layout": {
                "type": "pattern",
                "pattern": "%d{yyyy-MM-dd hh:mm:ss} %p -%m"
            }
        };
        fileAppenders.push(fileAppender);
    }
    return loggerConfig;
}