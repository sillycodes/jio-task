const Logger = require('../../logger/loggerService');
const config = process.env;
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/UserModel').Users;

/**
 * This method to handle and chunk the request data
 */
function RequestDataHandler(request, response, next)
{
    var data = '';
    request.on('data', function (chunk)
    {
        data += chunk;
    });
    request.on('end', function ()
    {
        request.rawBody = data;
    });
    next();
}


/**
 * To Set Headers
 */
function ValidateHTTPHeader(request, response, next)
{
    response.header("Cache-Control", "no-cache, no-store, must-revalidate");
    response.header("Pragma", "no-cache");
    response.header("Expires", 0);
    response.header("Date", new Date());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    if (request.method === 'OPTIONS') {
        response.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
        return response.status(200).json({});
    }
    next();
}

function VerifyCROSandCSRF(request, response, next)
{
    if (request.originalUrl === '/' || request.originalUrl === '/user' || request.originalUrl === '/setup-parking-lot') {
        next();
    } else {
        validateCrosAndCsrf(request, response, next);
    }
}

function validateCrosAndCsrf(request, response, next)
{
    const origin = sendAllowedOrigin(request);
    if (origin == '') {
        const errorResponse = 'Invalid request, access denied. Please add domain to whitelist config';
        sendErrorResponseBack(request, response, 403, errorResponse);
    } else {
        verifyToken(request, response, next)
        // sendSuccessResponseBack(request, response, apiResponse);
    }
}

function sendAllowedOrigin(request)
{
    const whitelist = config.ALLOWED_DOMAINS_LIST;
    var origin = '';
    if (request.header('origin') !== undefined && request.header('origin') !== '') {
        origin = extractOrigin(request.header('origin'));
    } else if (request.header('Referer') !== undefined && request.header('Referer') !== '') {
        origin = extractOrigin(request.header('Referer'));
    }

    if (whitelist.indexOf(origin) !== -1) {
        return origin;
    } else {
        Logger.error("error", __filename + ' Request orginates from forbidden domain ' + request.header('origin'));
        return '';
    }
}

function extractOrigin(referrerURL)
{
    var origin = '';
    if (referrerURL !== undefined) {
        const index = referrerURL.indexOf('.com');
        if (referrerURL === config.ORIGIN_URL || referrerURL.indexOf(config.ORIGIN_URL) !== -1) {
            origin = config.ORIGIN_URL;
        } else if (index !== -1) {
            origin = referrerURL.substring(0, index + 4);
        }
    }
    return origin;
}

function sendErrorResponseBack(request, response, statusCode, errorResponse)
{
    const apiResponse = {
        statusCode: statusCode,
        error: 'invalid_request',
        error_description: errorResponse
    };
    response.status(statusCode).send(apiResponse);
    response.end();
}

function verifyToken(req, res, next)
{
    var token = req.header('auth-token') || req.header('x-access-token') || req.header('authorization');

    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (!token) {
        sendErrorResponseBack(req, res, 403, "Access denied, Auth tocken not available");
        return;
    }
    try {
        // const verified = jwt.verify(token,'superSecret');
        const decoded = jwt.decode(token, 'superSecret');
        console.log(decoded);
        if (decoded.exp <= Date.now()) {
            sendErrorResponseBack(req, res, 400, "Access token has expired");
        } else {
            next();
        }
    } catch (e) {
        sendErrorResponseBack(req, res, 400, "Invalid Token");
    }
}

function AllowAccessTocken(request, response, next)
{
    const access_tocken = request.header.access_tocken;
    UserModel.findOne({ access_tocken: access_tocken }, { created: false, password: false, __v: false, token: false, _id: false }).then(data =>
    {
        request.body.user = data;
        next();
    }).catch(err =>
    {
        return response.status(400).send({
            status: "Error",
            message: `Token is not valid, Please refresh your tocken or try login again!`,
        }).end();
    });
}

function isUserExist(request, response, next)
{

    const email = request.body.email_id;
    UserModel.findOne({ email_id: email }, { created: false, password: false, __v: false, token: false, _id: false }).then(data =>
    {
        if (data.id) {
            return response.status(400).send({
                status: "Error",
                message: `The requested user already exit, Try LoginIn!`,
            }).end();
        }
        next();
    }).catch(err =>
    {
        return response.status(400).send({
            status: "Error",
            message: `Token is not valid, Please refresh your tocken or try login again!`,
        }).end();
    });
}

module.exports = {
    RequestDataHandler: RequestDataHandler,
    ValidateHTTPHeader: ValidateHTTPHeader,
    VerifyCROSandCSRF: VerifyCROSandCSRF,
    AllowAccessTocken: AllowAccessTocken,
    IsUserExist: isUserExist
}