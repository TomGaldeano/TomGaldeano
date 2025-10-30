USE sakila;
-- ==============================================
-- SECCIÓN A) 30 CONSULTAS CON JOIN DE 2 TABLAS
-- ==============================================
-- 1:  Para cada actor, muestra el número total de películas en las que aparece; es decir, cuenta cuántas filas de film_actor corresponden a cada actor.                                                                                                                              perfecto segun la solucion dada pero ha habido que usar right y left join y trangiversar consultas 
SELECT 
    actor.actor_id AS actor_id,
    actor.first_name AS first_name,
    actor.last_name AS last_name,
    COUNT(film_actor.film_id) AS total_films
FROM
    actor
        JOIN
    film_actor USING (actor_id)
GROUP BY actor.actor_id;
-- 2:  Lista solo los actores que participan en 20 o más películas (umbral alto) con su conteo.
SELECT 
    actor.actor_id AS actor_id,
    actor.first_name AS first_name,
    actor.last_name AS last_name,
    COUNT(film_actor.film_id) AS films_20plus
FROM
    actor
        JOIN
    film_actor USING (actor_id)
GROUP BY actor.actor_id
HAVING COUNT(film_actor.film_id) >= 20;
-- 3:  Para cada idioma, indica cuántas películas están catalogadas en ese idioma.
SELECT 
    language_id,
    language.name AS language_name,
    COUNT(language_id) AS films_in_language
FROM
    language
        JOIN
    film USING (language_id)
GROUP BY language_id;
-- 4:  Muestra el promedio de duración (length) de las películas por idioma y filtra aquellos idiomas con duración media estrictamente mayor a 110 minutos.
SELECT 
    language_id,
    language.name AS language_name,
    AVG(film.length) AS avg_length
FROM
    language
        JOIN
    film USING (language_id)
GROUP BY language_id
HAVING AVG(film.length) > 110;
-- 5:  Para cada película, muestra cuántas copias hay en el inventario.
SELECT 
    film_id, title, COUNT(inventory_id) AS copies
FROM
    film
        JOIN
    inventory USING (film_id)
GROUP BY film_id;
-- 6:  Lista solo las películas que tienen al menos 5 copias en inventario.
SELECT 
    film_id, title, COUNT(inventory_id) AS copies_5plus
FROM
    film
        JOIN
    inventory USING (film_id)
GROUP BY film_id
HAVING COUNT(inventory_id) > 4;
-- 7:  Para cada artículo de inventario, cuenta cuántos alquileres se han realizado.
SELECT 
    inventory_id, COUNT(rental_id) AS rentals
FROM
    inventory
        JOIN
    rental USING (inventory_id)
GROUP BY inventory_id;
-- 8:  Para cada cliente, muestra cuántos alquileres ha realizado en total.
SELECT 
    customer_id,
    first_name,
    last_name,
    COUNT(rental_id) AS total_rentals
FROM
    customer
        JOIN
    rental USING (customer_id)
GROUP BY customer_id;     
-- 9:  Lista los clientes con 30 o más alquileres acumulados.
SELECT 
    customer_id,
    first_name,
    last_name,
    COUNT(rental_id) AS rentals_30plus
FROM
    customer
        JOIN
    rental USING (customer_id)
GROUP BY customer_id
HAVING COUNT(rental_id) > 29; 
-- 10:  Para cada cliente, muestra el total de pagos (suma en euros/dólares) que ha realizado.
SELECT 
    customer_id,
    first_name,
    last_name,
    SUM(amount) AS total_amount
FROM
    customer
        JOIN
    payment USING (customer_id)
GROUP BY customer_id; 
-- 11:  Muestra los clientes cuyo importe total pagado es al menos 200.
SELECT 
    customer_id,
    first_name,
    last_name,
    SUM(amount) AS total_amount
FROM
    customer
        JOIN
    payment USING (customer_id)
GROUP BY customer_id
HAVING SUM(amount) > 200; 
-- 12:  Para cada empleado (staff), muestra el número de pagos que ha procesado.
SELECT 
    staff_id,
    first_name,
    last_name,
    COUNT(payment_id) AS payments_processed
FROM
    staff
        JOIN
    payment USING (staff_id)
GROUP BY staff_id;
-- 13:  Para cada empleado, muestra el importe total procesado.
SELECT 
    staff_id,
    first_name,
    last_name,
    SUM(amount) AS total_processed
FROM
    staff
        JOIN
    payment USING (staff_id)
GROUP BY staff_id;
-- 14:  Para cada tienda, cuenta cuántos artículos de inventario tiene.
SELECT 
    store_id, COUNT(store_id) AS total_inventory_items
FROM
    store
        JOIN
    inventory USING (store_id)
GROUP BY store_id;
-- 15:  Para cada tienda, cuenta cuántos clientes tiene asignados.
SELECT 
    store_id, COUNT(store_id) AS customers_in_store
FROM
    store
        JOIN
    customer USING (store_id)
GROUP BY store_id;
-- 16:  Para cada tienda, cuenta cuántos empleados (staff) tiene asignados.
SELECT 
    store_id, COUNT(staff_id) AS staff_in_store
FROM
    store
        JOIN
    staff USING (store_id)
GROUP BY store_id;
-- 17:  Para cada dirección (address), cuenta cuántas tiendas hay ubicadas ahí (debería ser 0/1 en datos estándar).
SELECT 
    address_id, address, COUNT(store_id) AS stores_here
FROM
    store
        JOIN
    address USING (address_id)
GROUP BY address_id;
-- 18:  Para cada dirección, cuenta cuántos empleados residen en esa dirección.
SELECT 
    address_id, address, COUNT(staff_id) AS staff_here
FROM
    staff
        JOIN
    address USING (address_id)
GROUP BY address_id;
-- 19:  Para cada dirección, cuenta cuántos clientes residen ahí.
SELECT 
    address_id, address, COUNT(city_id) AS customers_here
FROM
    customer
        JOIN
    address USING (address_id)
GROUP BY address_id;
-- 20:  Para cada ciudad, cuenta cuántas direcciones hay registradas
SELECT 
    city_id, city, COUNT(address_id) AS addresses_in_city
FROM
    city
        JOIN
    address USING (city_id)
GROUP BY city_id;
-- 21:  Para cada país, cuenta cuántas ciudades existen.
SELECT 
    country_id, country, COUNT(city_id) AS cities_in_country
FROM
    city
        JOIN
    country USING (country_id)
GROUP BY country_id;
-- 22:  Para cada idioma, calcula la duración media de películas y muestra solo los idiomas con media entre 90 y 120 inclusive.
SELECT 
    language_id,
    language.name AS language_name,
    AVG(film.length) AS avg_length
FROM
    language
        JOIN
    film USING (language_id)
GROUP BY language_id
LIMIT 1;
-- 23:  Para cada película, cuenta el número de alquileres que se han hecho de cualquiera de sus copias (usando inventario).
SELECT 
    film_id, title, COUNT(rental_id) AS total_rentals
FROM
    film
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
GROUP BY film_id;
-- 24:  Para cada cliente, cuenta cuántos pagos ha realizado en 2005 (usando el año de payment_date).
SELECT 
    customer_id,
    first_name,
    last_name,
    COUNT(payment_id) AS payments_2005
FROM
    customer
        JOIN
    payment USING (customer_id)
WHERE
    YEAR(payment_date) = 2005
GROUP BY customer_id;
-- 25:  Para cada película, muestra el promedio de tarifa de alquiler (rental_rate) de las copias existentes (es un promedio redundante pero válido).
SELECT 
    film_id, title, AVG(rental_rate) AS avg_rate
FROM
    film join inventory using(film_id)
GROUP BY film_id;
-- 26:  Para cada actor, muestra la duración media (length) de sus películas.
SELECT 
    actor_id,
    first_name,
    last_name,
    AVG(length) AS avg_length_by_actor
FROM
    film
        JOIN
    film_actor USING (film_id)
        JOIN
    actor USING (actor_id)
GROUP BY actor_id;
-- 27:  Para cada ciudad, cuenta cuántos clientes hay (usando la relación cliente->address->city requiere 3 tablas; aquí contamos direcciones por ciudad).
SELECT 
    city_id, city, COUNT(city_id) AS total_addresses
FROM
    customer
        RIGHT JOIN
    address USING (address_id)
        JOIN
    city USING (city_id)
GROUP BY city_id
ORDER BY city_id;
-- 28:  Para cada película, cuenta cuántos actores tiene asociados.
SELECT 
    film_id, title, COUNT(actor_id) AS actors_in_film
FROM
    film
        JOIN
    film_actor USING (film_id)
GROUP BY film_id;
-- 29:  Para cada categoría (por id), cuenta cuántas películas pertenecen a ella (sin nombre de categoría para mantener 2 tablas).
SELECT 
    category_id, COUNT(film_id) AS films_in_category
FROM
    category
        JOIN
    film_category USING (category_id)
GROUP BY category_id;
-- 30:  Para cada tienda, cuenta cuántos alquileres totales se originan en su inventario.
SELECT 
    store_id, COUNT(inventory_id) AS rentals_by_store_inventory
FROM
    rental
        JOIN
    inventory USING (inventory_id)
GROUP BY store_id;
-- ==============================================
-- SECCIÓN B) 30 CONSULTAS CON JOIN DE 3 TABLAS
-- ==============================================
-- 31:  Para cada actor, cuenta cuántas películas tiene y muestra solo los que superan 15 películas.
SELECT 
    actor_id,
    first_name,
    last_name,
    COUNT(film_id) AS films_by_actor
FROM
    actor
        JOIN
    film_actor USING (actor_id)
GROUP BY actor_id
HAVING COUNT(film_id) > 15;
-- 32:  Para cada categoría (por nombre), cuenta cuántas películas hay en esa categoría.
SELECT 
    category_id,
    category.name AS category_name,
    COUNT(film_id) AS films_in_category
FROM
    film_category
        JOIN
    category USING (category_id)
GROUP BY category_id;
-- 33:  Para cada película, cuenta cuántos alquileres se han hecho de sus copias.
SELECT 
    film_id, title, COUNT(rental_id) AS rentals_of_film
FROM
    film
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
GROUP BY film_id;
-- 34:  Para cada cliente, suma el importe pagado en 2005 y filtra clientes con total >= 150.
SELECT 
    customer_id,
    first_name,
    last_name,
    SUM(amount) AS total_2005
FROM
    customer
        JOIN
    payment USING (customer_id)
WHERE
    YEAR(payment_date) = 2005
GROUP BY customer_id
HAVING SUM(amount) >= 150;
-- 35:  Para cada tienda, suma el importe cobrado por todos sus empleados.
SELECT 
    store_id, SUM(amount) AS revenue_by_store_staff
FROM
    store
        JOIN
    staff USING (store_id)
        JOIN
    payment USING (staff_id)
GROUP BY staff_id;
-- 36:  Para cada ciudad, cuenta cuántos empleados residen ahí (staff -> address -> city).
SELECT 
    city_id, city, COUNT(address_id) AS staff_in_city
FROM
    staff
        JOIN
    address USING (address_id)
        JOIN
    city USING (city_id)
GROUP BY address_id;
-- 37:  Para cada ciudad, cuenta cuántas tiendas existen (store -> address -> city).
SELECT 
    city_id, city, COUNT(address_id) AS stores_in_city
FROM
    store
        JOIN
    address USING (address_id)
        JOIN
    city USING (city_id)
GROUP BY address_id;
-- 38:  Para cada actor, calcula la duración media de sus películas del año 2006.
SELECT 
    actor_id, first_name, last_name, AVG(length) AS avg_len_2006
FROM
    film
        JOIN
    film_actor USING (film_id)
        JOIN
    actor USING (actor_id)
WHERE
    release_year = 2006
GROUP BY actor_id;
-- 39:  Para cada categoría, calcula la duración media y muestra solo las que superan 120.
SELECT 
    category_id, name AS category_name, AVG(length) AS avg_len
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
GROUP BY category_id
HAVING AVG(length) > 120;
-- 40:  Para cada idioma, suma las tarifas de alquiler (rental_rate) de todas sus películas.
SELECT 
    language_id,
    language.name AS language_name,
    SUM(rental_rate) AS sum_rates
FROM
    language
        JOIN
    film USING (language_id)
    join inventory using (film_id)
GROUP BY language_id;
-- 41:  Para cada cliente, cuenta cuántos alquileres realizó en fines de semana (SÁB-DO) usando DAYOFWEEK (1=Domingo).
SELECT 
    customer_id,
    first_name,
    last_name,
    COUNT(rental_id) AS weekend_rentals
FROM
    customer
        JOIN
    rental USING (customer_id)
WHERE
    DAYOFWEEK(rental_date) = 1
        OR DAYOFWEEK(rental_date) = 7
GROUP BY customer_id
ORDER BY customer_id;
-- 42:  Para cada actor, muestra el total de títulos distintos en los que participa (equivale a COUNT DISTINCT, sin subconsulta).
SELECT 
    actor_id,
    first_name,
    last_name,
    COUNT(DISTINCT film_id) AS distinct_films
FROM
    actor
        JOIN
    film_actor USING (actor_id)
GROUP BY actor_id
HAVING COUNT(film_id);
-- 43:  Para cada ciudad, cuenta cuántos clientes residen ahí (customer -> address -> city).
SELECT 
    city_id, city, COUNT(address_id) AS customers_in_city
FROM
    customer
        JOIN
    address USING (address_id)
        JOIN
    city USING (city_id)
GROUP BY city_id;
-- 44:  Para cada categoría, muestra cuántos actores distintos participan en películas de esa categoría.
SELECT 
    category_id,
    name AS category_name,
    COUNT(DISTINCT actor_id) AS actors_in_category
FROM
    film_category
        JOIN
    category USING (category_id)
        JOIN
    film USING (film_id)
        JOIN
    film_actor USING (film_id)
GROUP BY category_id;
-- 45:  Para cada tienda, cuenta cuántas copias totales (inventario) tiene de películas en 2006.
SELECT 
    store_id, COUNT(film_id) AS copies_2006
FROM
    inventory
        JOIN
    film USING (film_id)
WHERE
    release_year < 2007
GROUP BY store_id
ORDER BY store_id DESC;
-- 46:  Para cada cliente, suma el total pagado por alquileres cuyo empleado pertenece a la tienda 1.
SELECT 
    customer_id,
    c.first_name,
    c.last_name,
    SUM(amount) AS total_amount
FROM
    customer c
        JOIN
    payment USING (customer_id)
        JOIN
    staff USING (staff_id)
WHERE
    staff_id = 1
GROUP BY customer_id;
-- 47:  Para cada película, cuenta cuántos actores tienen el apellido de longitud >= 5.
SELECT 
    film_id, title, COUNT(actor_id) AS actors_lastname_len5plus
FROM
    film
        JOIN
    film_actor USING (film_id)
        JOIN
    actor USING (actor_id)
WHERE
    LENGTH(last_name) >= 5
GROUP BY film_id;
-- 48:  Para cada categoría, suma la duración total (length) de sus películas.
SELECT 
    category_id,
    name AS category_name,
    SUM(length) AS total_length
FROM
    film_category
        JOIN
    category USING (category_id)
        JOIN
    film USING (film_id)
GROUP BY category_id;
-- 49:  Para cada ciudad, suma los importes pagados por clientes que residen en esa ciudad.
SELECT 
    city_id, city, SUM(amount) AS total_paid
FROM
    customer
        JOIN
    address USING (address_id)
        JOIN
    city USING (city_id)
        JOIN
    payment USING (customer_id)
GROUP BY city_id;
-- 50:  Para cada idioma, cuenta cuántos actores distintos participan en películas de ese idioma.
SELECT 
    language_id,
    name AS language_name,
    COUNT(DISTINCT actor_id) AS actors_in_language
FROM
    language
        JOIN
    film USING (language_id)
        JOIN
    film_actor USING (film_id)
GROUP BY language_id
HAVING COUNT(film_id);  
-- 51:  Para cada tienda, cuenta cuántos clientes activos (active=1) tiene.
SELECT 
    store_id, COUNT(customer_id) AS active_customers
FROM
    store
        JOIN
    customer USING (store_id)
WHERE
    active = 1
GROUP BY store_id;  
-- 52:  Para cada cliente, cuenta en cuántas categorías distintas ha alquilado (aprox. vía film_category; requiere 4 tablas, aquí contamos películas 2006 por inventario).
SELECT 
    customer_id,
    c.first_name,
    c.last_name,
    COUNT(distinct film_id) AS rentals_2006
FROM
    film_category
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
        JOIN
    customer c USING (customer_id)
WHERE
    YEAR(rental_date) = 2006
GROUP BY customer_id;
-- 53:  Para cada empleado, cuenta cuántos clientes diferentes le han pagado.
SELECT 
    staff_id, first_name, last_name, COUNT(DISTINCT customer_id) as distinct_customers_paid
FROM
    staff
        JOIN
    payment USING (staff_id)
GROUP BY staff_id;
-- 54:  Para cada ciudad, cuenta cuántas películas del año 2006 han sido alquiladas por residentes en esa ciudad.
SELECT 
    city_id, city, COUNT(inventory_id) AS rentals_2006_by_city
FROM
    city
        JOIN
    address USING (city_id)
        JOIN
    customer USING (address_id)
        JOIN
    rental USING (customer_id)
WHERE
    YEAR(rental_date) = 2006
GROUP BY city_id;
-- 55:  Para cada categoría, calcula el promedio de replacement_cost de sus películas.
SELECT 
    category_id,
    name AS category_name,
    AVG(replacement_cost) AS avg_replacement_cost
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
GROUP BY category_id;
-- 56:  Para cada tienda, suma los importes cobrados en 2006 (vía empleados de esa tienda).
SELECT 
    store_id, SUM(amount) AS revenue_2006
FROM
    store
        JOIN
    staff USING (store_id)
        JOIN
    payment USING (staff_id)
WHERE
    YEAR(payment_date) = 2006
GROUP BY store_id;
-- 57:  Para cada actor, cuenta cuántas películas tienen título de más de 12 caracteres.
SELECT 
    actor_id, first_name, last_name, COUNT(film_id) as films_title_len_gt12
FROM
    actor
        JOIN
    film_actor USING (actor_id)
        JOIN
    film USING (film_id)
WHERE
    LENGTH(title) > 12
GROUP BY actor_id;
-- 58:  Para cada ciudad, calcula la suma de pagos de 2005 y filtra las ciudades con total >= 300.
-- SELECT 
  --  city_id, SUM(amount) AS city_payments_2005_bigger_300
-- FROM
  --  payment
  --      JOIN
   -- customer USING (customer_id)
   --     JOIN
    -- address USING (address_id)
   --     JOIN
   -- city USING (city_id)
-- WHERE
  --  YEAR(payment_date) = 2005
  --      AND SUM(amount) >= 300
-- GROUP BY city_id;
	-- da error no hay total de pagos por ciudad mayores a 300 sin contar solo con los de 2005
-- 59:  Para cada categoría, cuenta cuántas películas tienen rating 'PG' o 'PG-13'.
SELECT 
    category_id,
    name AS category_name,
    COUNT(film_id) AS films_pg_pg13
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
WHERE
    rating = 'PG' OR rating = 'PG-13'
GROUP BY category_id;
-- 60:  Para cada cliente, calcula el total pagado en pagos procesados por el empleado 2.
SELECT 
    customer_id,
    c.first_name,
    c.last_name,
    SUM(amount) AS total_paid_by_staff2
FROM
    customer c
        JOIN
    payment USING (customer_id)
        JOIN
    staff USING (staff_id)
WHERE
    staff_id = 2
GROUP BY customer_id;
-- ==============================================
-- SECCIÓN C) 20 CONSULTAS CON JOIN DE 4 TABLAS
-- ==============================================
-- 61:  Para cada ciudad, cuenta cuántos clientes hay y muestra solo ciudades con 10 o más clientes.
-- select city_id, city, count(address_id) as customers_in_city
-- from customer join address using (address_id) join city using (city_id) where count(address_id)>10 group by address_id;
-- da error no hay mas de 10 clientes en ninguna ciudad
-- 62:  Para cada actor, cuenta cuántos alquileres totales suman todas sus películas.
SELECT 
    actor_id,
    first_name,
    last_name,
    COUNT(rental_id) AS rentals_for_actor
FROM
    rental
        JOIN
    inventory USING (inventory_id)
        JOIN
    film_actor USING (film_id)
        JOIN
    actor USING (actor_id)
GROUP BY actor_id;
-- 63:  Para cada categoría, suma los importes pagados derivados de películas de esa categoría.
SELECT 
    category_id,
    name AS category_name,
    SUM(amount) AS revenue_by_category
FROM
    payment
        JOIN
    rental USING (rental_id)
        JOIN
    inventory USING (inventory_id)
        JOIN
    film_category USING (film_id)
        JOIN
    category USING (category_id)
GROUP BY category_id;
-- 64:  Para cada ciudad, suma los importes pagados por clientes residentes en esa ciudad en 2005.
SELECT 
    city_id, city, SUM(amount) AS total_paid_2005
FROM
    payment
        JOIN
    customer USING (customer_id)
        JOIN
    address USING (address_id)
        JOIN
    city USING (city_id)
WHERE
    YEAR(payment_date) = 2005
GROUP BY city_id;
-- 65:  Para cada tienda, cuenta cuántos actores distintos aparecen en las películas de su inventario.
SELECT 
    store_id,
    COUNT(DISTINCT actor_id) AS distinct_actors_in_store_inventory
FROM
    store
        JOIN
    inventory USING (store_id)
        JOIN
    film USING (film_id)
        JOIN
    film_actor USING (film_id)
GROUP BY store_id;
-- 66:  Para cada idioma, cuenta cuántos alquileres totales se han hecho de películas en ese idioma.
SELECT 
    language_id,
    name AS language_name,
    COUNT(rental_id) AS rentals_in_language
FROM
    rental
        JOIN
    inventory USING (inventory_id)
        JOIN
    film USING (film_id)
        JOIN
    language USING (language_id)
GROUP BY language_id;
-- 67:  Para cada cliente, cuenta en cuántos meses distintos de 2005 realizó pagos (meses distintos).
SELECT 
    customer_id,
    first_name,
    last_name,
    COUNT(DISTINCT MONTH(payment_date)) AS active_months_2005
FROM
    payment
        JOIN
    customer USING (customer_id)
WHERE
    YEAR(payment_date) = 2005
GROUP BY customer_id;
-- 68:  Para cada categoría, calcula la duración media de las películas alquiladas (considerando solo películas alquiladas).
SELECT 
    category_id,
    name AS category_name,
    AVG(length) AS avg_length_rented
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
GROUP BY category_id;
-- 69:  Para cada país, cuenta cuántos clientes hay (country -> city -> address -> customer).
SELECT 
    country_id,
    country,
    COUNT(customer_id) AS customers_in_country
FROM
    country
        JOIN
    city USING (country_id)
        JOIN
    address USING (city_id)
        JOIN
    customer USING (address_id)
GROUP BY country_id;
-- 70:  Para cada país, suma los importes pagados por sus clientes.
SELECT 
    country_id, country, SUM(amount) AS total_paid_by_country
FROM
    country
        JOIN
    city USING (country_id)
        JOIN
    address USING (city_id)
        JOIN
    customer USING (address_id)
        JOIN
    payment USING (customer_id)
GROUP BY country_id;
-- 71:  Para cada tienda, cuenta cuántas categorías distintas existen en su inventario.
SELECT 
    store_id,
    COUNT(DISTINCT category_id) AS distinct_categories_in_store
FROM
    film_category
        JOIN
    inventory USING (film_id)
        JOIN
    store USING (store_id)
GROUP BY store_id;
-- 72:  Para cada tienda, suma la recaudación por categoría (resultado agregado por tienda y categoría).
SELECT 
    p.staff_id AS store_id,
    category_id,
    name AS category_name,
    SUM(amount) AS revenue
FROM
    store
        JOIN
    inventory USING (store_id)
        JOIN
    film_category USING (film_id)
        JOIN
    category USING (category_id)
        JOIN
    rental USING (inventory_id)
        JOIN
    payment p USING (rental_id)
GROUP BY p.staff_id , category_id
ORDER BY category_id , p.staff_id DESC;
-- no iva con store_id
-- 73:  Para cada actor, cuenta en cuántas tiendas distintas se han alquilado sus películas.
SELECT 
    actor_id,
    first_name,
    last_name,
    COUNT(DISTINCT store_id) AS stores_with_actor_films_rented
FROM
    actor
        JOIN
    film_actor USING (actor_id)
        JOIN
    inventory USING (film_id)
        JOIN
    store USING (store_id)
GROUP BY actor_id;
-- 74:  Para cada categoría, cuenta cuántos clientes distintos han alquilado películas de esa categoría.
SELECT 
    category_id,
    name AS category_name,
    COUNT(DISTINCT customer_id) AS distinct_customers
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
GROUP BY category_id;
-- 75:  Para cada idioma, cuenta cuántos actores distintos participan en películas alquiladas en ese idioma.
SELECT 
    language_id, name AS language_name, COUNT(DISTINCT actor_id) as actors_in_rented_language_films
FROM
    language
        JOIN
    film USING (language_id)
        JOIN
    film_actor USING (film_id)
GROUP BY language_id;
-- 76:  Para cada país, cuenta cuántas tiendas hay (país->ciudad->address->store).
SELECT 
    country_id, country, COUNT(store_id) AS stores_in_country
FROM
    country
        JOIN
    city USING (country_id)
        JOIN
    address USING (city_id)
        JOIN
    store USING (address_id)
GROUP BY country_id;
-- 77:  Para cada cliente, cuenta los alquileres en los que la devolución (return_date) fue el mismo día del alquiler.
SELECT 
    c.customer_id,
    first_name,
    last_name,
    COUNT(rental_id) AS same_day_returns
FROM
    inventory i
        LEFT JOIN
    rental r ON i.inventory_id = r.inventory_id
        LEFT JOIN
    customer c ON r.customer_id = c.customer_id
WHERE
    DATE(rental_date) = DATE(return_date)
GROUP BY c.customer_id;
-- 78:  Para cada tienda, cuenta cuántos clientes distintos realizaron pagos en 2005.
SELECT 
    store_id,
    COUNT(DISTINCT customer_id) AS distinct_customers_2005
FROM
    staff
        JOIN
    payment USING (staff_id)
WHERE
    YEAR(payment_date) = 2005
GROUP BY store_id;
-- 79:  Para cada categoría, cuenta cuántas películas con título de longitud > 15 han sido alquiladas.
SELECT 
    category_id, name AS category_name, COUNT(inventory_id) as rentals_long_title
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
WHERE
    LENGTH(title) > 15
GROUP BY category_id;
-- 80:  Para cada país, suma los pagos procesados por los empleados de las tiendas ubicadas en ese país.
SELECT 
    country_id, country, SUM(amount) AS revenue_by_country_staff
FROM
    country
        JOIN
    city USING (country_id)
        JOIN
    address USING (city_id)
        JOIN
    store USING (address_id)
        JOIN
    staff USING (store_id)
        JOIN
    payment USING (staff_id)
GROUP BY store_id;
-- ==============================================
-- SECCIÓN D) 20 CONSULTAS EXTRA (DIFICULTAD +), <=4 JOINS
-- ==============================================
-- 81:  Para cada cliente, muestra el total pagado con IVA teórico del 21% aplicado (total*1.21), redondeado a 2 decimales.
SELECT 
    customer_id,
    first_name,
    last_name,
    round(SUM(amount * 1.21),2) AS total_with_vat_21
FROM
    customer
        JOIN
    payment USING (customer_id)
GROUP BY customer_id;
-- 82:  Para cada hora del día (0-23), cuenta cuántos alquileres se iniciaron en esa hora.
SELECT 
    HOUR(rental_date) AS rental_hour,
    COUNT(rental_id) AS rentals_in_hour
FROM
    rental
GROUP BY HOUR(rental_date)
ORDER BY HOUR(rental_date);
-- 83:  Para cada tienda, muestra la media de length de las películas alquiladas en 2005 y filtra las tiendas con media >= 100.
SELECT 
    store_id, AVG(length) AS avg_length_2005
FROM
    store
        JOIN
    inventory USING (store_id)
        JOIN
    film USING (film_id)
        JOIN
    rental USING (inventory_id)
WHERE
    YEAR(rental_date) = 2005
GROUP BY store_id
HAVING AVG(length) > 100;
-- 84:  Para cada categoría, muestra la media de replacement_cost de las películas alquiladas un domingo.
SELECT 
    category_id, name AS category_name, AVG(replacement_cost) AS avg_replacement_sundays
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
WHERE
    DAYOFWEEK(rental_date) = 1
GROUP BY category_id; 
-- 85:  Para cada empleado, muestra el importe total por pagos realizados entre las 00:00 y 06:00 (inclusive 00:00, exclusivo 06:00).
SELECT 
    staff_id,
    first_name,
    last_name,
    SUM(amount) AS night_shift_amount
FROM
    staff
        JOIN
    payment USING (staff_id)
WHERE
    HOUR(payment_date) < 6
GROUP BY staff_id;
-- 86:  Para cada actor, cuenta cuántas de sus películas tienen un título que contiene la palabra 'LOVE' (mayúsculas).
SELECT 
    actor_id,
    first_name,
    last_name,
    COUNT(film_id) AS films_with_love
FROM
    actor
        JOIN
    film_actor USING (actor_id)
        JOIN
    film USING (film_id)
WHERE
    title LIKE ('%LOVE%')
GROUP BY actor_id
ORDER BY actor_id;
-- 87:  Para cada idioma, muestra el total de pagos de alquileres de películas en ese idioma.
SELECT 
    language_id,
    name AS language_name,
    SUM(amount) AS total_amount_in_language
FROM
    language
        JOIN
    film USING (language_id)
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
        JOIN
    payment USING (rental_id)
GROUP BY language_id;
-- 88:  Para cada cliente, cuenta en cuántos días distintos de 2005 realizó algún alquiler.
SELECT 
    c.customer_id,
    first_name,
    last_name,
    COUNT(DISTINCT DATE(rental_date)) AS active_days_2005
FROM
    customer c
        JOIN
    rental USING (customer_id)
        JOIN
    payment USING (rental_id)
WHERE
    YEAR(rental_date) = 2005
GROUP BY customer_id;
-- 89:  Para cada categoría, calcula la longitud media de títulos (número de caracteres) de sus películas alquiladas.
SELECT 
    category_id,
    name AS category_name,
    AVG(LENGTH(title)) AS avg_title_len_rented
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
WHERE
    rental_date IS NOT NULL
GROUP BY category_id;
-- 90:  Para cada tienda, cuenta cuántos clientes distintos alquilaron en el primer trimestre de 2006 (enero-marzo).
SELECT 
    store_id,
    COUNT(DISTINCT r.customer_id) AS distinct_customers_q1_2006
FROM
    store
        JOIN
    inventory USING (store_id)
        JOIN
    rental r USING (inventory_id)
WHERE
    YEAR(rental_date) = 2006
        AND MONTH(rental_date) < 4
GROUP BY store_id;
-- 91:  Para cada país, cuenta cuántas categorías diferentes han sido alquiladas por clientes residentes en ese país.
SELECT 
    country_id,
    country,
    COUNT(DISTINCT category_id) AS distinct_categories_rented_by_country
FROM
    country
        JOIN
    city USING (country_id)
        JOIN
    address USING (city_id)
        JOIN
    customer USING (address_id)
        JOIN
    rental USING (customer_id)
        JOIN
    inventory USING (inventory_id)
        JOIN
    film_category USING (film_id)
GROUP BY country_id;
-- 92:  Para cada cliente, muestra el importe medio de sus pagos redondeado a 2 decimales, solo si ha hecho al menos 10 pagos.
SELECT 
    c.customer_id,
    first_name,
    last_name,
    ROUND(AVG(amount), 2) AS avg_payment
FROM
    customer c
        JOIN
    rental USING (customer_id)
        JOIN
    payment USING (rental_id)
GROUP BY rental.customer_id
HAVING COUNT(payment_id) > 10;
-- 93:  Para cada categoría, muestra el número de películas con replacement_cost > 20 que hayan sido alquiladas al menos una vez.
SELECT 
    category_id, name AS category_name, COUNT(distinct film_id) as pricey_rented_films
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
		JOIN
	inventory USING (film_id)
		JOIN
	rental USING (inventory_id)
WHERE
    replacement_cost > 20
GROUP BY category_id;
-- 94:  Para cada tienda, suma los importes pagados en fines de semana.
SELECT 
    store_id,
    SUM(amount) AS weekend_revenue
FROM
    store
        JOIN
    staff USING (store_id)
        JOIN
    payment USING (staff_id)
WHERE
    DAYOFWEEK(payment_date) = 1
        OR DAYOFWEEK(payment_date) = 7
GROUP BY store_id;
-- 95:  Para cada actor, cuenta cuántas películas suyas fueron alquiladas por al menos 5 clientes distintos (se cuenta alquileres y luego se filtra por HAVING).
SELECT 
    actor_id,
    first_name,
    last_name,
    COUNT(DISTINCT customer_id) AS distinct_customers
FROM
    actor
        JOIN
    film_actor USING (actor_id)
        JOIN
    inventory USING (film_id)
        JOIN
    rental USING (inventory_id)
GROUP BY actor_id
HAVING COUNT(DISTINCT customer_id) > 5;
-- 96:  Para cada idioma, muestra el número de películas cuyo título empieza por la letra 'A' y que han sido alquiladas.
SELECT 
    language_id,
    name AS language_name,
    COUNT(DISTINCT film_id) AS films_starting_A_rented
FROM
    language
        JOIN
    film USING (language_id)
        JOIN
    inventory USING (film_id)
WHERE
    title LIKE ('A%')
        AND INVENTORY_IN_STOCK(inventory_id) = 1
GROUP BY language_id;
-- 97:  Para cada país, suma el importe total de pagos realizados por clientes residentes y filtra países con total >= 1000.
SELECT 
    country_id, country, SUM(amount) AS total_amount
FROM
    country
        right JOIN
    city USING (country_id)
       left JOIN
    address USING (city_id)
        left JOIN
    customer USING (address_id)
       right JOIN
    payment USING (customer_id)
GROUP BY country_id	
HAVING SUM(amount) >= 1000;
-- 98:  Para cada cliente, cuenta cuántos días han pasado entre su primer y su último alquiler en 2005 (diferencia de fechas), mostrando solo clientes con >= 5 alquileres en 2005.
--     (Se evita subconsulta calculando sobre el conjunto agrupado por cliente y usando MIN/MAX de rental_date en 2005.
SELECT 
    c.customer_id,
    first_name,
    last_name,
    DATEDIFF(MAX(rental_date), MIN(rental_date)) AS days_between_first_last_2005
FROM
    customer c
        JOIN
    rental USING (customer_id)
        JOIN
    payment USING (rental_id)
WHERE
    YEAR(payment_date) = 2005
GROUP BY c.customer_id
HAVING COUNT(rental_id) >= 5;
-- 99:  Para cada tienda, muestra la media de importes cobrados por transacción en el año 2006, con dos decimales.
SELECT 
    store_id, ROUND(AVG(amount), 2) AS avg_payment_2006
FROM
    store
        JOIN
    staff USING (store_id)
        JOIN
    payment USING (staff_id)
WHERE
    YEAR(payment_date) = 2006
GROUP BY store_id;
-- 100:  Para cada categoría, calcula la media de duración (length) de películas alquiladas en 2006 y ordénalas descendentemente por dicha media.
SELECT 
    category_id,
    name AS category_name,
    AVG(length) AS avg_length_rented_2006
FROM
    category
        JOIN
    film_category USING (category_id)
        JOIN
    film USING (film_id)
        JOIN
    inventory USING (film_id)
		JOIN
	rental USING (inventory_id)
WHERE
year(rental_date)= 2006
GROUP BY category_id
ORDER BY AVG(length) DESC;