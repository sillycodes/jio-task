'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModelAutoIncrementID = require('./counterModel').autoIncrementModelID;

var BookingLog = new Schema({
    id: { type: Number, unique: true, min: 1},
    lot_id: { type: String },
    user_id: {type: String},
    in_time: { type: Date},
    out_time: {type: Date},
    created: { type: Date, default: Date.now },

},{ strict: false });

BookingLog.pre('save', function(next) {
    if (!this.isNew) {
        next();
        return;
    }
    ModelAutoIncrementID('booking', this, next);
});
exports.BookingLog = mongoose.model('booking', BookingLog);