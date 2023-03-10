require("rootpath")();
const express = require('express');
const app = express();
const morgan = require('morgan');
const config = require("config.json");
var cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');
  

const alumnoCont = require("alumnoController.js");
app.use("/api/alumno",alumnoCont);

const cursoCont = require("cursoController.js");
app.use("/api/curso",cursoCont);

const cursoalumnoCont = require("cursoalumnoController.js");
app.use("/api/curso/insc",cursoalumnoCont);

const userCont = require("userController.js");
app.use("/api/usuario",userCont);

const securityCont = require("security.js");
app.use("/api/security",securityCont.app);

app.listen(config.server.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server iniciado en puerto:${config.server.port}`);
    }
});