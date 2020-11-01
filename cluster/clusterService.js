/*global module, process, require */

var logger = require('../logger/loggerService.js');
var FILE_NAME = '[clusterService.js] ';

module.exports = {
    initializeClustering : initializeClustering
};

function initializeClustering(cluster) {
    var workers = [], worker;
    var numWorkers = require('os').cpus().length;
    var actualNoofworkers = numWorkers - 1;

    logger.error('Master cluster setting up ' + actualNoofworkers + ' workers...', FILE_NAME);

    for (var i = 0; i < numWorkers-1; i++) {
        worker = cluster.fork();
        workers[worker.process.pid] = worker;
    }

    cluster.on('online', function (worker) {
        logger.error('Worker ' + worker.process.pid + ' is online', FILE_NAME);
    });

    var killWorkers = function(reason) {
        return function(reason) {
            logger.error('Killing worker due to ' + reason, FILE_NAME);
            for(var w in workers) {
                logger.error('Killed worker ' + w.pid, FILE_NAME);
                w.kill();
                delete workers[w.process.pid];
            }
            logger.error('Shutting down master process', FILE_NAME);
            process.exit(1);
        };
    };

    process.on('uncaughtException', killWorkers('uncaughtException'));
    process.on('exit', killWorkers('exit'));

    cluster.on('exit', function(deadworker) {
        logger.error('Worker ' + deadworker.process.pid + ' died', FILE_NAME);
        delete workers[deadworker.process.pid];
        worker = cluster.fork();
        logger.error('Started a new worker with id ' + worker.process.pid, FILE_NAME);
        workers[worker.process.pid] = worker;
        logger.error('Number of active workers ' + Object.keys(workers).length, FILE_NAME);
    });
}