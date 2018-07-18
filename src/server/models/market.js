'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var MarketSchema =  Schema({
    _id: String,
    name: String,
    description: String,
    // subscription: String
});

module.exports = mongoose.model('Market', MarketSchema);