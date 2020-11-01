
const Router = require('express').Router();
const Parking  = require('../API/Controllers/ParkingController');
const Users = require('../API/Controllers/UsersController')
const ParkingObj = new Parking();
const UsersObj = new Users();

/**
 * Below are the defined router.
 */

 Router.get('/', function(req, res){
    res.send('Welcome to Parking Lot')
 });



 Router.post('/setup-parking-lot', ParkingObj.store);
 Router.post('/user', UsersObj.store)


 module.exports = Router;