const mysql = require('mysql');
const config = require("config.json");

//conectarnos a nuestra DB
var connection = mysql.createConnection(config.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DB Conectada correctamente");
    }
});
//fin de conexion db

var userDb = {};

userDb.create = function (usuario, funCallback) {
    var query = 'INSERT INTO usuarios (email,nickname,password) VALUES (?,?,?)'
    var dbParams = [usuario.email, usuario.nickname, usuario.password];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `Ya existe el usuario DNI ${usuario.email}`,
                    detail: err
                });
            }else{
                funCallback({
                    message: "Surgio un problema, contactese con un administrador. Gracias",
                    detail: err
                });
            }
            
            console.error(err);
        } else {
            funCallback(undefined, {
                message: `Se creo el usuario ${usuario.nickname}`,
                detail: result
            });
        }
    });
}


module.exports = userDb;