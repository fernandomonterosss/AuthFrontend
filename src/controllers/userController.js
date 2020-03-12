'use strict';


// Modulos
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs');
var path = require('path');

// Modelos
var User = require('../models/user');

// Servicio
var jwt = require('../services/jwt');

// Acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la accion pruebas',
        user: req.user
    })
}

function saveUser(req, res) {
    // Crear el objeto usuario
    var user = new User();

    // Recoger parametros de peticion
    var params = req.body;

    if (params.password && params.name && params.surname && params.email) {
        // Asignar valores al objeto usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';


        // Find
        User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
            if (err) {
                res.status(500).send({ message: 'Error al comprobar el usuario' });
            } else {
                if (!issetUser) {
                    // Cifrar la contraseña
                    bcrypt.hash(params.password, null, null, function(err, hash) {
                        user.password = hash;

                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al guardar el usuario' });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                                } else {
                                    res.status(200).send({ user: userStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({ message: 'El usuario no puede registrarse' });
                }
            }
        });
    } else {
        res.status(200).send({ message: 'Introduce los datos correctamente' });
    }
}

function login(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error al comprobar el usuario' });
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {

                        // Comprobar y generar token
                        if (params.gettoken) {
                            // Devolver token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            console.log('envio esto');
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ message: 'El usuario no ha podido loguearse correctamente' });
                    }
                });
            } else {
                res.status(404).send({ message: 'El usuario no ha podido loguearse' });
            }
        }
    });
}

function getUsers(req, res) {
    User.find({}).exec((err, users) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición',
            })
        } else {
            if (!users) {
                res.status(404).send({
                    message: 'No hay usuarios',
                })
            } else {
                res.status(200).send({
                    users
                })
            }
        }
    });
}

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId).exec((err, user) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición',
            })
        } else {
            if (!user) {
                res.status(404).send({
                    message: 'El usuario no existe',
                })
            } else {
                res.status(200).send({
                    user
                })
            }
        }
    });
}



function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    delete update.password;

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición',
            })
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    message: 'No se ha actualizado el usuario',
                })
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}

function deleteUser(req, res) {
    var userId = req.params.id;

    User.findByIdAndRemove(userId, (err, userRemoved) => {
        if (err) {
            res.status(200).send({ message: 'Error en la petición' });
        } else {
            if (!userRemoved) {
                res.status(404).send({ message: 'No se ha borrado el user' });
            } else {
                res.status(200).send({ user: userRemoved });
            }
        }
    });
}


module.exports = {
    pruebas,
    saveUser,
    login,
    getUsers,
    updateUser,
    getUser,
    deleteUser
};