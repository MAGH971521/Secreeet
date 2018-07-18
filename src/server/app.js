'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Routes loading
const userRoute = require('./routes/user');

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Core

// Paths
app.use('/api/user', userRoute);

app.get('/testing', (req, res) => {
    res.status(200).send({
        message: "Testing... 1...2...3"
    })
})


// Export
module.exports = app;