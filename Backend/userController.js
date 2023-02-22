require("rootpath")();
const express = require('express');
const app = express();
const userDb = require("userDB.js");
const securityCont = require("security.js");

app.post('/',securityCont.verificarToken, create);



function create(req, res) {
    userDb.create(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}


module.exports = app;