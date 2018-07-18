'use strict'

const express = require('express');
const UserController = require('./../controllers/user');
const md_auth = require('./../middlewares/authenticated');
const multiparty = require('connect-multiparty');

const md_upload = multiparty({uploadDir: './../misc/uploads/users'});


const api = express.Router();

api.get('/user/:id',md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.get('/user-image/:id', UserController.getImageUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.put('/update/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;