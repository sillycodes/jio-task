
const Router = require('express').Router();
const Booking = require('../API/Controllers/BookingController');
const Parking = require('../API/Controllers/ParkingController');
const Users = require('../API/Controllers/UsersController');
const {AllowAccessTocken, IsUserExist }= require('../API/Middleware/bootstrap');
const ParkingObj = new Parking();
const UsersObj = new Users();
const BookingObj = new Booking;

/**
 * Below are the defined router.
 */

Router.get('/', function (req, res)
{
   res.send('Welcome to Parking Lot')
});



Router.post('/setup-parking-lot', ParkingObj.store);
Router.post('/user', IsUserExist, UsersObj.store)
Router.get('/slots', AllowAccessTocken, ParkingObj.fetchSlots);
Router.post('/book-slot', AllowAccessTocken, BookingObj.create);
Router.put('/book-slot', AllowAccessTocken, BookingObj.update);


module.exports = Router;