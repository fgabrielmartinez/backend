require("rootpath")();
const express = require('express');
const app = express();

const alumnoDb = require("alumnoDB.js");


app.get('/', getAll);

app.get('/:id', getById);

app.delete('/:id', eliminar);

app.post('/', create);

app.put('/:id', update);


function getAll(req, res) {
    alumnoDb.getAll(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function getById(req, res) {
    alumnoDb.getById(req.params.id,function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function eliminar(req, res) {
    alumnoDb.delete(req.params.id, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.detail.affectedRows == 0) {
                res.status(404).json(result);
            } else {
                res.json(result);
            }
        }
    });
}

function create(req, res) {
    alumnoDb.create(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function update(req, res) {
    alumnoDb.update(req.params.id, req.body, function (result) {
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