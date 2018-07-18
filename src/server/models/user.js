'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var UserSchema =  Schema({
    name: String,
    surname: String,
    birth: {
        type: Date, 
        default: Date.now
    },
    updated: {
        type: Date, 
        default: Date.now
    },
    nick: String,
    email: String,
    pswd: String,
    image: String,
    markets: [{
        type: Schema.ObjectId,
        ref: "Market"
    }],
    subscription: {
        type: Schema.ObjectId,
        ref: "Subscription"
    }
    // subscription: String
});

module.exports = mongoose.model('User', UserSchema);