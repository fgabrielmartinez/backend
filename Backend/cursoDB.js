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

var cursoDb = {};


cursoDb.getAll = function (funCallback) {
    connection.query("SELECT * FROM curso", function (err, result, fields) {
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

cursoDb.getById = function (id, funCallback) {
    connection.query("SELECT * FROM curso WHERE id=?", id, function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.length > 0) {
                funCallback(undefined, result[0]);
            } else {
                funCallback({
                    message: "No se encontro el curso"
                });
            }

        }
    });
}

cursoDb.delete = function (id, funCallback) {
    var query1 = 'DELETE FROM alumno_curso WHERE id_curso = ?'
    connection.query(query1, id)
    var query2 = 'DELETE FROM curso WHERE id = ?'
    connection.query(query2, id, function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined, {
                    message: `No se encontro el curso ${id}`,
                    detail: result
                });
            } else {
                funCallback(undefined, {
                    message: `Se elimino el curso ${id}`,
                    detail: result
                });
            }
        }
    });

}

cursoDb.create = function (curso, funCallback) {
    var query = 'INSERT INTO curso (nombre,descripcion,imagen,anio,activo) VALUES (?,?,?,?,?)'
    var dbParams = [curso.nombre, curso.descripcion, curso.imagen, curso.anio, curso.activo];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                funCallback({
                    message: `Ya existe el curso con el Nombre ${curso.nombre}`,
                    detail: err
                });
            } else {
                funCallback({
                    message: "Surgio un problema, contactese con un administrador. Gracias",
                    detail: err
                });
            }

            console.error(err);
        } else {
            funCallback(undefined, {
                message: `Se creo el curso ${curso.nombre}`,
                detail: result
            });
        }
    });
}


cursoDb.update = function (id, curso, funCallback) {
    var query = 'UPDATE curso SET nombre = ?, descripcion = ?, imagen = ?, anio = ?, activo = ?  WHERE id = ?'
    var dbParams = [curso.nombre, curso.descripcion, curso.imagen, curso.anio, curso.activo, id];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            funCallback({
                code: 3,
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback({
                    code: 2,
                    message: `No se encontro el curso con el id ${id}`,
                    detail: result
                });
            } else {
                funCallback({
                    code: 1,
                    message: `Se modifico el curso ${curso.nombre}`,
                    detail: result
                });
            }
        }
    });

}

cursoDb.inscripcion = function (id, curso, funCallback) {
    
    var parametros = curso.id;
    var query1 = 'DELETE FROM alumno_curso WHERE id_curso = ?';
    connection.query(query1, id)
    for (let i = 0; i < parametros.length; i++) {
        var query = 'INSERT INTO alumno_curso (id_alumno,id_curso) VALUES (?,?)'
        var dbParams = [parametros[i], id];
        connection.query(query, dbParams, function (err, result, fields) {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    funCallback({
                        message: `Ya existe la id ${parametros[i]}`,
                        detail: err
                    });
                } else {
                    funCallback({
                        message: "Surgio un problema, contactese con un administrador. Gracias",
                        detail: err
                    });
                }
                console.error(err);
            } else if (i === (parametros.length - 1)) {
                funCallback(undefined, {
                    message: `Se creo la inscripcion `,
                    detail: result
                });
            }
        });
    }
}

cursoDb.ListarCurso = function (id, funCallback) {
    var query1 = 'SELECT alumno.nombre,alumno.apellido,alumno.dni FROM alumno INNER JOIN alumno_curso  WHERE alumno.id = alumno_curso.id_alumno AND alumno_curso.id_curso = ?'
    connection.query(query1, id, function (err, result, fields) {
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

module.exports = cursoDb;