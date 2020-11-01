
require('dotenv').config() //Loaded ENV Config.
const config = process.env;
const express = require('express');
const https = require('https');
const cluster = require('cluster');
const fs = require('fs')
const clusterService = require('./cluster/clusterService.js');
const app = express();
const ROUTES = require('./routes/router');
const bodyParser = require('body-parser');
const { RequestDataHandler, ValidateHTTPHeader, VerifyCROSandCSRF } = require('./API/Middleware/bootstrap');
const mongoDBConnection = require('./connections/dbConnection');

// SERVER SETUP START //

/**
 * For Local testing,if you want to turn off master,
 *  negate the below if condition 
 */

if (!cluster.isMaster) {
    clusterService.initializeClustering(cluster);
} else {

    const options = {
        key: fs.readFileSync('./keys/server.key'),
        cert: fs.readFileSync('./keys/server.crt')
    };
    https.createServer(options, app).listen(config.SERVER_PORT);
    const serverUpMsg = `Server up and running on port ${config.SERVER_PORT} !!!!`;
    if (cluster.worker !== undefined) {
        serverUpMsg += ' with process id ' + cluster.worker.process.pid;
    }
    console.log(serverUpMsg);

    //SETUP MIDDLEWARE//
    app.use(RequestDataHandler);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(ValidateHTTPHeader);
    app.use('*', VerifyCROSandCSRF)
    app.use(ROUTES);
    //SETUP MIDDLEWARE END//
}

// SERVER SETUP END //


