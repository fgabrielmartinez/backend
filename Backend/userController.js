require("rootpath")();
const express = require('express');
const app = express();

const userDb = require("userDB.js");
const securityCont = require("security.js");

app.get('/', getAll);
app.post('/',securityCont.verificarToken, create);
app.put('/:nickname',securityCont.verificarToken, update);


function getAll(req, res) {
    userDb.getAll(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function create(req, res) {
    userDb.create(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function update(req, res) {
    userDb.update(req.params.nickname, req.body, function (result) {
        if (result.code == 3) {
            res.status(500).send(err);
        } else if (result.code == 2) {
            res.status(404).json(result);
        } else {
            res.json(result);
        }
    });
}


module.exports = app;