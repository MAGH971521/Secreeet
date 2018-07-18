'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var SubscriptionSchema =  Schema({
    name: String,
    description: String,
    price: Number,
    marketLimit: Number,
    // subscription: String
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);