require("rootpath")();
const express = require('express');
const app = express();

const cursoalumnoDB = require("cursoalumnoDB.js");


app.get('/', getAll);

app.get('/:id_curso', getByCursoId);

app.post('/:id_curso', inscripcion);





function getAll(req, res) {
    cursoalumnoDB.getAll(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function getByCursoId(req, res) {
    cursoalumnoDB.getByCursoId(req.params.id_curso, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}


function inscripcion(req, res) {
    cursoalumnoDB.inscripcion(req.body.id_curso, req.body.id_alumnos, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}


module.exports = app;