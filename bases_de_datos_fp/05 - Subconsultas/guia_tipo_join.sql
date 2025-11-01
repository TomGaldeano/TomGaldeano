-- ###################################
-- Teoria   ##########################
-- ###################################
USE ejemplos_tipos_join;
SELECT a.id_alumno, a.nombre, m.id_matricula, m.id_curso
FROM alumnos a
JOIN matriculas m
ON m.id_alumno = a.id_alumno
ORDER BY a.id_alumno, m.id_matricula;

SELECT a.id_alumno, a.nombre, m.id_matricula, m.id_curso
FROM alumnos a
INNER JOIN matriculas m
ON m.id_alumno = a.id_alumno
ORDER BY a.id_alumno, m.id_matricula;
-- inner es igual a join normal

SELECT a.id_alumno, a.nombre, m.id_matricula, m.id_curso
FROM alumnos a
LEFT JOIN matriculas m
ON m.id_alumno = a.id_alumno
ORDER BY a.id_alumno, m.id_matricula;
-- left añade filas de null si no existe la columna de la izquierda

SELECT a.id_alumno, a.nombre, m.id_matricula, m.id_curso
FROM alumnos a
RIGHT JOIN matriculas m
ON m.id_alumno = a.id_alumno
ORDER BY a.id_alumno, m.id_matricula;
-- right añade filas de null si no existe la columna de la derecha
SELECT a.id_alumno, a.nombre, m.id_matricula, m.id_curso
FROM alumnos a
LEFT JOIN matriculas m
ON m.id_alumno = a.id_alumno
UNION
SELECT a.id_alumno, a.nombre, m.id_matricula, m.id_curso
FROM alumnos a
RIGHT JOIN matriculas m
ON m.id_alumno = a.id_alumno
WHERE a.id_alumno IS NULL
ORDER BY 1 IS NULL;
-- Este tipo de join se utiliza poco y no viene por defecto en mysql

-- un left es igual a un right dependiendo del orden 

-- ####################################################
-- Ejercicios   #######################################
-- ####################################################
-- ej1 Listado de alumnos con sus id_curso (sólo emparejados).
SELECT 
    a.id_alumno, nombre, id_curso
FROM
    alumnos a
        JOIN
    matriculas m ON a.id_alumno=m.id_alumno;
-- ej2 Alumnos sin ninguna matrícula (anti-join).
SELECT 
    a.id_alumno, nombre
FROM
    alumnos a
        LEFT JOIN
    matriculas m ON a.id_alumno=m.id_alumno
    WHERE id_matricula IS NULL;
-- ej3 Matrículas sin alumno (huérfanas)
SELECT 
    id_matricula, m.id_alumno, id_curso
FROM
    alumnos a
        RIGHT JOIN
    matriculas m ON a.id_alumno=m.id_alumno
    WHERE a.id_alumno IS NULL;
-- ej4 Cursos del catálogo sin ninguna matrícula.
SELECT 
    c.id_curso, nombre_curso
FROM
    cursos c
        LEFT JOIN
    matriculas m ON c.id_curso=m.id_curso
    WHERE m.id_matricula IS NULL;
-- ej5 Número de matrículas por alumno (incluye 0)
SELECT 
    id_matricula, m.id_alumno, id_curso
FROM
    alumnos a
        RIGHT JOIN
    matriculas m ON a.id_alumno=m.id_alumno
    GROUP BY matricula;
-- ej6 Alumnos con más de un curso.

-- ej7 FULL OUTER JOIN emulado (alumnos y sus matrículas, incluyendo huérfanas)

-- ej8 Para cada curso del catálogo, número de alumnos con matrícula válida (alumno y curso existen).

-- Tipo test 1-B 2-B 3-B 4-C 5-B 6-B 7-B 8-B 9-B 10-B

USE tienda_online;
-- Enunciado. Lista todos los productos que nunca han sido vendidos, es decir, aquellos que no aparecen en ninguna fila de detalle_pedido.
select *
from productos p join detalle_pedido dp on p.id_producto=dp.id_producto;

