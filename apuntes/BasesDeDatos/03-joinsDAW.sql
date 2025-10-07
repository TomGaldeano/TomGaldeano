USE tienda_online;

SELECT * FROM clientes;

SELECT * FROM productos;

-- Obtén el listado de los pedidos que han solicitado más de 3 productos distintos
SELECT 
    id_pedido, COUNT(id_producto) AS num_prod_distintos
FROM
    detalle_pedido
GROUP BY id_pedido
HAVING COUNT(*) > 3; /* filtro posterior al agrupamiento. Lo normal es que vaya con una función de agregación*/

SELECT * FROM detalle_pedido;

/* ENUNCIADO :
8) Mirando en la tabla detalle_pedido, ¿se ha producido 
algún cambio de precio que pueda verse en esa tabla?*/

-- SOLUCIÓN: NO HA HABIDO NINGÚN CAMBIO DE PRECIO
SELECT 
    id_producto, MAX(precio_unitario), MIN(precio_unitario)
FROM
    detalle_pedido
GROUP BY id_producto
HAVING MAX(precio_unitario) != MIN(precio_unitario);

-- Obtén los pedidos de 2023 que se han pagado por tarjeta
/* 
1) Tablas necesarias. 
2) Columnas que relacionan. Si no se relacionan directamente, buscar tablas intermedias.
3) Filtros (where)
4) ¿Agrupaciones? Si las hay, agregaciones.
5) Filtro post-agregado (HAVING)
6) ¿Ordenación?

*/
select * from pedidos
join pagos on pedidos.id_pedido=pagos.id_pedido
where year(pedidos.fecha_pedido)=2023 and pagos.metodo_pago = "tarjeta" 
order by fecha_pedido ASC;

-- Obtén los pedidos pendientes que se han pagado por tarjeta
select * From pedidos join pagos on pedidos.id_pedido = pagos.id_pedido
 where metodo_pago="tarjeta" and estado="pendiente";
-- Obtén los nombres de los productos que ha pedido Ana Torres
select clientes.nombre from clientes join pedidos on clientes.id_cliente=pedidos.id_cliente
join detalle_pedido on pedidos.id_pedido=detalle_pedido.id_pedido
join productos on detalle_pedido.id_producto=productos.id_producto
where clientes.nombre = "Ana Torres";

-- PARTE 2
-- ¿Cuántos pedidos se han comprado por clientes de Argentina?
-- ¿Cuántos productos se han comprado por clientes de Argentina?
-- ¿Cuántos productos se han comprado por pais de origen del cliente?