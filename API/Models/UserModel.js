'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModelAutoIncrementID = require('./counterModel').autoIncrementModelID;

var UsersSchema = new Schema({
    id: { type: Number, unique: true, min: 1 },
    full_name: { type: String, required: true },
    mobile: { type: Boolean, required: true },
    vehicle_number: { type: String, required: true },
    gender: { type: String, required: true },
    disability: { type: Boolean, required: true },
    is_pregnent: { type: Boolean, required: true },
    access_token: { type: String },
    email_id: { type: String, required: true },
    password: { type: String },
    created: { type: Date, default: Date.now },

}, { strict: false });

UsersSchema.pre('save', function (next)
{
    if (!this.isNew) {
        next();
        return;
    }
    ModelAutoIncrementID('users', this, next);
});
exports.Users = mongoose.model('users', UsersSchema);