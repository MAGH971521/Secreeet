'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'surprise_dude';

exports.createToken = (user) => {
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        birth: user.birth,
        nick: user.nick,
        email: user.email,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
};