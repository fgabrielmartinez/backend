CREATE SCHEMA integrador ;

USE integrador;

CREATE TABLE usuario (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  nickname VARCHAR(50),
  password VARCHAR(50),
  rol VARCHAR(50) 
  );
  
CREATE TABLE alumno (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  apellido VARCHAR(255),
  dni VARCHAR(10),
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id)
  );

CREATE TABLE curso(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  descripcion VARCHAR (1000),
  imagen VARCHAR (1000),
  anio INT,
  activo boolean
  );

CREATE TABLE alumno_curso(
  id_alumno INT,
  FOREIGN KEY (id_alumno) REFERENCES alumno(id),
  id_curso INT,
  FOREIGN KEY (id_curso) REFERENCES curso(id)
  );

INSERT INTO usuario(nickname,password,email,rol) VALUES ('admin', 'admin','admin@admin.com','admin');

INSERT INTO usuario(nickname,password,email,rol) VALUES ('docente', 'docente','docente@docente.com','docente');

