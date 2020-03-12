'use strict';

var express = require('express');
var UserController = require('../controllers/userController');

var api = express.Router();
var md_auth = require('../middleware/authenticated');

api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.get('/list-users', UserController.getUsers);
api.get('/user/:id', UserController.getUser);
api.put('/user/:id', UserController.updateUser);
api.delete('/user/:id', [md_auth.ensureAuth], UserController.deleteUser);


module.exports = api;