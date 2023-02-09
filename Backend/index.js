require("rootpath")();
const express = require('express');
const app = express();
const morgan = require('morgan');
const config = require("config.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');
  


app.get("/", function (req, res) {
    res.send("Mi primer ABM con NODE y MYSQL");
});

const personaCont = require("personaController.js");
app.use("/api/persona",personaCont);

const userCont = require("userController.js");
app.use("/api/usuario",userCont);


app.listen(config.server.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server iniciado en puerto:${config.server.port}`);
    }
});