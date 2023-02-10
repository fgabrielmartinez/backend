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

var alumnoDb = {};


alumnoDb.getAll = function (funCallback) {
    connection.query("SELECT * FROM alumno", function (err, result, fields) {
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

alumnoDb.getByDni = function (dni,funCallback) {
    connection.query("SELECT * FROM alumno WHERE dni=?",dni, function (err, result, fields) {
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
                    message: "No se encontro el alumno"
                });
            }
            
        }
    });
}

alumnoDb.create = function (alumno, funCallback) {
    var query = 'INSERT INTO alumno (dni,nombre,apellido) VALUES (?,?,?)'
    var dbParams = [alumno.dni, alumno.nombre, alumno.apellido];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `Ya existe el alumno DNI ${alumno.dni}`,
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
                message: `Se creo el alumno ${alumno.apellido} ${alumno.nombre}`,
                detail: result
            });
        }
    });
}

/**
 * 
 * @param {*} dni 
 * @param {*} alumno 
 * @param {*} funCallback 
 *         retorna:
 *              code = 1 (EXITO)
 *              code = 2 (NOT FOUND) (NO encontro elemento)
 *              code = 3 (ERROR)
 * 
 */
alumnoDb.update = function (dni, alumno, funCallback) {
    var query = 'UPDATE personas SET dni = ? , nombre = ?, apellido = ? WHERE dni = ?'
    var dbParams = [alumno.dni, alumno.nombre, alumno.apellido, dni];
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
                    message: `Se modifico el alumno ${alumno.apellido} ${alumno.nombre}`,
                    detail: result
                });
            }
        }
    });

}


alumnoDb.delete = function(dni,funCallback){
    var query = 'DELETE FROM alumno WHERE dni = ?'
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
                    message: `No se encontro el alumno ${dni}`,
                    detail: result
                });
            } else {
                funCallback(undefined,{
                    message: `Se elimino el alumno ${dni}`,
                    detail: result
                });
            }
        }
    });
}


module.exports = alumnoDb;