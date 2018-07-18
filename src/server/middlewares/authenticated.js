'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

const secret = 'surprise_dude';

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(404).send({message: 'Authentication failed: Inexistent authorization'});
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');
    let payload = null
    try {
        payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: "Token expired"
            });
        }
    } catch (error) {
        return res.status(404).send({
            message: "Token doesn\'t exists"
        });
    }

    req.user = payload;

    next();
};