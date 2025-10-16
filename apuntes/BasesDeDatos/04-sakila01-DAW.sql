use sakila;

-- Curiosidad:
SELECT * FROM tienda_online.clientes;

SELECT *
FROM actor
LIMIT 5;

-- 1) Cinco actores con más películas
SELECT first_name, last_name, COUNT(film_actor.film_id) AS num_films
FROM
    actor
        JOIN
    film_actor ON actor.actor_id = film_actor.actor_id
GROUP BY film_actor.actor_id
ORDER BY COUNT(film_actor.film_id) DESC
LIMIT 5;

-- 2) Películas que nunca han sido alquiladas
select count(distinct inventory_id) from inventory;
select count(distinct inventory_id) from rental;
select i.film_id, i.inventory_id from inventory i join rental r on i.inventory_id=r.inventory_id where r.staff_id = Null;
-- 3) País con más clientes
select count(c.customer_id), co.country from customer c join address a on c.address_id = a.address_id join city ci on a.city_id = ci.city_id 
join country co on co.country_id = ci.country_id group by co.country order by count(c.customer_id) desc limit 1;
-- 4) Tres películas con mayores ingresos por alquiler con nombre pelicula y pago
select f.title, avg(p.amount) as income
from film f join inventory i on f.film_id=i.film_id join rental r on r.inventory_id = i.inventory_id join payment p on p.rental_id = r.rental_id
group by f.title order by avg(p.amount) desc limit 3;
-- 5) Ingreso promedio por alquiler en cada tienda. probar varias consultas para aegurar que no hay errores
select s.store_id, avg(p.amount) as avg_income
from store s join inventory i on s.store_id=i.store_id join rental r on r.inventory_id = i.inventory_id join payment p on p.rental_id = r.rental_id
group by s.store_id order by avg(p.amount) desc;
-- STORE -> CUSTOMER -> RENTAL -> PAYMENT
select s.store_id, avg(p.amount) as avg_income
from store s join customer c on c.store_id=s.store_id join rental r on r.customer_id = c.customer_id join payment p on p.rental_id = r.rental_id
group by s.store_id order by avg(p.amount) desc;
-- STORE -> CUSTOMER -> PAYMENT
select s.store_id, avg(p.amount) as avg_income
from store s join customer c on s.store_id=c.store_id join payment p on p.customer_id = c.customer_id
group by s.store_id order by avg(p.amount) desc;
-- STORE -> staff USING(STORE_ID) ->PAYMENT
select s.store_id, avg(p.amount) as avg_income
from store s join staff using(store_id) join payment p on p.staff_id = staff.staff_id
group by s.store_id order by avg(p.amount) desc;
-- 6) Ventas totales por categoría ordenadas
select c.name, sum(p.amount) as income
from category c join film_category fc on fc.category_id= c.category_id join film f on fc.film_id=f.film_id join inventory i on f.film_id=i.film_id join rental r on r.inventory_id = i.inventory_id join payment p on p.rental_id = r.rental_id
group by c.name order by sum(p.amount) desc;
-- 7) Actores con al menos diez películas de categorías distintas
select a.first_name, a.last_name, count(distinct c.name) as different_genres
from actor a join film_actor ac on a.actor_id=ac.actor_id join film f on ac.film_id=f.film_id 
join film_category fc on f.film_id=fc.film_id join category c on fc.category_id=c.category_id
group by a.actor_id having count(distinct c.name);
-- 8) Tiendas con más stock disponible
select * from store
-- 9) Diez películas con mayor diferencia entre coste de reposición y tarifa de alquiler
-- 10) Películas con más de tres actores y duración menor a 90 minutos
-- 11) Cliente que más ha gastado
