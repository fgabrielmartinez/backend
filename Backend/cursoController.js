require("rootpath")();
const express = require('express');
const app = express();
const securityCont = require("security.js");
const cursoDb = require("cursoDB.js");


app.get('/', getAll);

app.get('/:id', getById);

app.get('/byid/:id', ListarCurso);

app.delete('/:id',securityCont.verificarToken, eliminar);

app.post('/',securityCont.verificarToken, create);

app.put('/:id',securityCont.verificarToken, update);







function getAll(req, res) {
    cursoDb.getAll(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function getById(req, res) {
    cursoDb.getById(req.params.id, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function eliminar(req, res) {
    cursoDb.delete(req.params.id, function (err, result) {
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
    cursoDb.create(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function update(req, res) {
    cursoDb.update(req.params.id, req.body, function (result) {
        if (result.code == 3) {
            res.status(500).send(err);
        } else if (result.code == 2) {
            res.status(404).json(result);
        } else {
            res.json(result);
        }
    });
}


function inscripcion(req, res) {
    cursoDb.inscripcion(req.params.id, req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function ListarCurso(req, res) {
    cursoDb.ListarCurso(req.params.id, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

module.exports = app;