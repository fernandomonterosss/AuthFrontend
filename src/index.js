'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3000;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/db_auth', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('La conexion a la base de datos se ha realizado correctamente');

        app.listen(port, () => {
            console.log("El servidor local con node y express esta corriendo...");
        })
    })
    .catch(err => console.log(err));


app.listen(port, 'localhost', () => {
    console.log("Corriendo en el puerto " + port);
})