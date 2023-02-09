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

var personaDb = {};


personaDb.getAll = function (funCallback) {
    connection.query("SELECT * FROM personas", function (err, result, fields) {
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

personaDb.getByDni = function (dni,funCallback) {
    connection.query("SELECT * FROM personas WHERE dni=?",dni, function (err, result, fields) {
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
                    message: "No se encontro la persona"
                });
            }
            
        }
    });
}

personaDb.create = function (persona, funCallback) {
    var query = 'INSERT INTO personas (dni,nombre,apellido) VALUES (?,?,?)'
    var dbParams = [persona.dni, persona.nombre, persona.apellido];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `Ya existe la persona DNI ${persona.dni}`,
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
                message: `Se creo la persona ${persona.apellido} ${persona.nombre}`,
                detail: result
            });
        }
    });
}

/**
 * 
 * @param {*} dni 
 * @param {*} persona 
 * @param {*} funCallback 
 *         retorna:
 *              code = 1 (EXITO)
 *              code = 2 (NOT FOUND) (NO encontro elemento)
 *              code = 3 (ERROR)
 * 
 */
personaDb.update = function (dni, persona, funCallback) {
    var query = 'UPDATE personas SET dni = ? , nombre = ?, apellido = ? WHERE dni = ?'
    var dbParams = [persona.dni, persona.nombre, persona.apellido, dni];
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


personaDb.delete = function(dni,funCallback){
    var query = 'DELETE FROM personas WHERE dni = ?'
    connection.query(query, dni, function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,{
                    message: `No se encontro la persona ${dni}`,
                    detail: result
                });
            } else {
                funCallback(undefined,{
                    message: `Se elimino la persona ${dni}`,
                    detail: result
                });
            }
        }
    });
}


module.exports = personaDb;