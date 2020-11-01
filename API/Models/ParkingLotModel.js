'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModelAutoIncrementID = require('./counterModel').autoIncrementModelID;

var ParkingLotSchema = new Schema({
    id: { type: Number, unique: true, min: 1},
    lot_number: { type: String },
    is_reserved: { type: Boolean },
    bay_area: {type: String},
    current_status: {type: String},
    status: {type:Boolean, default:1},
    created: { type: Date, default: Date.now },

},{ strict: false });

ParkingLotSchema.pre('save', function(next) {
    if (!this.isNew) {
        next();
        return;
    }
    ModelAutoIncrementID('parking_area', this, next);
});
exports.ParkingLot = mongoose.model('parking_area', ParkingLotSchema);