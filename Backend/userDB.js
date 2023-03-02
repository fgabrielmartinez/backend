const mysql = require('mysql');
const config = require("config.json");
const bcrypt= require('bcrypt');
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
    let passwordHashed = bcrypt.hashSync(usuario.password,10);
    var query = 'INSERT INTO usuario (email,nickname,password) VALUES (?,?,?)'
    var dbParams = [usuario.email, usuario.nickname, usuario.password];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `Ya existe el usuario Email ${usuario.email}`,
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

userDb.getAll = function (funCallback) {
    connection.query("SELECT * FROM usuarios", function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            funCallback(undefined, result);
        }
    });
}

userDb.update = function (nickname, usuario, funCallback) {
    let passwordHashed = bcrypt.hashSync(usuario.password,10);
    var query = 'UPDATE usuarios SET email = ? , nickname = ?, password = ? WHERE nickname = ?'
    var dbParams = [usuario.email, usuario.nickname, passwordHashed, nickname];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            funCallback({
                code:3,
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback({
                    code:2,
                    message: `No se encontro la persona ${dni}`,
                    detail: result
                });
            } else {
                funCallback({
                    code:1,
                    message: `Se modifico la persona ${persona.apellido} ${persona.nombre}`,
                    detail: result
                });
            }
        }
    });

}

userDb.findByNickname = function (nickname,funCallback) {
    connection.query("SELECT * FROM usuario WHERE nickname=?",[nickname], function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if(result.length>0){
                funCallback(undefined, result[0]);
            }else{
                funCallback({
                    message: "No se encontro el usuario"
                });
            }
            
        }
    });
}

module.exports = userDb;