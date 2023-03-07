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

var cursoalumnoDB = {};


cursoalumnoDB.getAll = function (funCallback) {
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

cursoalumnoDB.getByCursoId = function (id_curso, funCallback) {
    connection.query("SELECT * FROM alumno_curso WHERE id_curso=?", id_curso, function (err, result, fields) {
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



cursoalumnoDB.inscripcion = function (id_curso, id_alumnos, funCallback) {

    connection.query('DELETE FROM alumno_curso WHERE id_curso = ?', id_curso, function (err, result, fields) {
        if (err) {
            funCallback({
                code: 3,
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            let insert = 'INSERT INTO alumno_curso (id_curso,id_alumno) VALUES'
            for (var i = 0; i < id_alumnos.length; i++) {
                insert = insert + `(${id_curso},${id_alumnos[i]}),`
            }
            insert = insert.substring(0, insert.length - 1);
            connection.query(insert, function (err, result, fields) {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        funCallback({
                            message: `Ya existe el alumno`,
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
                        message: `Se creo la inscripcion `,
                        detail: result
                    });
                }
            });
        }
    });


}




module.exports = cursoalumnoDB;