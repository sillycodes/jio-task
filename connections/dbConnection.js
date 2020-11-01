'use strict';
const mongoose = require('mongoose');
const env = process.env;
const logger = require('../logger/loggerService.js');
var FILE_NAME = '[dbConnection.js] ';

mongoose.connect('mongodb://' + env.HOST + '/' + env.DB, {
    /** Uncomment below lines if your DB has username and passowrd and set into the .env file */
    // auth: {
    //     user: env.USERNAME,
    //     password: env.PASSWORD,
    // },
    useNewUrlParser: true
}).then(
    () => {
        console.log("Database connected");
        logger.debug(" [Database connected]", __filename)
    },
    err => {
        /** handle initial connection error */
        console.log(" [Error in database connection.] ", err);
        logger.error(`Error in database connection.${err}`, __filename)
    }
);
mongoose.set('useCreateIndex', true);

var db = mongoose.connection;
exports.mongoose = mongoose;
exports.db = db;