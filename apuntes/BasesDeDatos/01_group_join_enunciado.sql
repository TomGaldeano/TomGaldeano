Use sakila;
-- ==============================================
-- SECCIÓN A) 30 CONSULTAS CON JOIN DE 2 TABLAS
-- ==============================================
-- 1:  Para cada actor, muestra el número total de películas en las que aparece; es decir, cuenta cuántas filas de film_actor corresponden a cada actor.
select actor.actor_id as actor_id, actor.first_name as first_name, actor.last_name as last_name, count(film_actor.film_id) as total_films
from actor join film_actor using(actor_id) group by actor.actor_id;
-- 2:  Lista solo los actores que participan en 20 o más películas (umbral alto) con su conteo.
select actor.actor_id as actor_id, actor.first_name as first_name, actor.last_name as last_name, count(film_actor.film_id) as films_20plus
from actor join film_actor using(actor_id) group by actor.actor_id having count(film_actor.film_id)>20;
-- 3:  Para cada idioma, indica cuántas películas están catalogadas en ese idioma.
select language_id, language.name as language_name, count(language_id) as films_in_language
from language join film using (language_id) group by language_id;
-- 4:  Muestra el promedio de duración (length) de las películas por idioma y filtra aquellos idiomas con duración media estrictamente mayor a 110 minutos.
select language_id, language.name as language_name, avg(film.length) as avg_length
from language join film using (language_id) group by language_id having avg(film.length) > 110;
-- 5:  Para cada película, muestra cuántas copias hay en el inventario.
select film_id, title, count(inventory_id) as copies
from film join inventory using(film_id) group by film_id;
-- 6:  Lista solo las películas que tienen al menos 5 copias en inventario.
select film_id, title, count(inventory_id) as copies
from film join inventory using(film_id) group by film_id having count(inventory_id)>4;
-- 7:  Para cada artículo de inventario, cuenta cuántos alquileres se han realizado.
select inventory_id, count(rental_id) as rentals 
from inventory join rental using(inventory_id) group by inventory_id;
-- 8:  Para cada cliente, muestra cuántos alquileres ha realizado en total.
select customer_id, first_name,last_name,count(rental_id) as total_rentals 
from customer join rental using(customer_id) group by customer_id;     
-- 9:  Lista los clientes con 30 o más alquileres acumulados.
select customer_id, first_name,last_name,count(rental_id) as total_rentals 
from customer join rental using(customer_id) group by customer_id having count(rental_id)>29; 
-- 10:  Para cada cliente, muestra el total de pagos (suma en euros/dólares) que ha realizado.
select customer_id, first_name,last_name,sum(amount) as total_amount
from customer join payment using(customer_id) group by customer_id; 
-- 11:  Muestra los clientes cuyo importe total pagado es al menos 200.
select customer_id, first_name,last_name,sum(amount) as total_amount
from customer join payment using(customer_id) group by customer_id having sum(amount)>200; 
-- 12:  Para cada empleado (staff), muestra el número de pagos que ha procesado.
select staff_id, first_name, last_name, count(payment_id) as payments_processed 
from staff join payment using (staff_id) group by staff_id;
-- 13:  Para cada empleado, muestra el importe total procesado.
select staff_id, first_name, last_name, sum(amount) as payments_processed 
from staff join payment using (staff_id) group by staff_id;
-- 14:  Para cada tienda, cuenta cuántos artículos de inventario tiene.
select store_id, count(store_id) as total_inventory_items
from store join inventory using(store_id) group by store_id;
-- 15:  Para cada tienda, cuenta cuántos clientes tiene asignados.
select store_id, count(store_id) as customers_in_store
from store join customer using(store_id) group by store_id;
-- 16:  Para cada tienda, cuenta cuántos empleados (staff) tiene asignados.
select store_id, count(staff_id) as staff_in_store
from store join staff using(store_id) group by store_id;
-- 17:  Para cada dirección (address), cuenta cuántas tiendas hay ubicadas ahí (debería ser 0/1 en datos estándar).
select address_id, address, count(store_id) as stores_here from  store join address using (address_id) group by address_id;
-- 18:  Para cada dirección, cuenta cuántos empleados residen en esa dirección.
select address_id, address, count(staff_id) as staff_here from  staff join address using (address_id) group by address_id;
-- 19:  Para cada dirección, cuenta cuántos clientes residen ahí.
select address_id, address, count(city_id) as customers_here from  customer join address using (address_id) group by address_id;
-- 20:  Para cada ciudad, cuenta cuántas direcciones hay registradas
select city_id, city, count(address_id) as addresses_in_city from  city join address using (city_id) group by city_id;
-- 21:  Para cada país, cuenta cuántas ciudades existen.
select country_id, country, count(city_id) as addresses_in_city from  city join country using (country_id) group by country_id;
-- 22:  Para cada idioma, calcula la duración media de películas y muestra solo los idiomas con media entre 90 y 120 inclusive.
select language_id, language.name as language_name, avg(film.length) as avg_length
from language join film using (language_id) group by language_id limit 1;
-- 23:  Para cada película, cuenta el número de alquileres que se han hecho de cualquiera de sus copias (usando inventario).
select film_id, title, count(rental_id) as total_rentals
from film join inventory using(film_id) join rental using(inventory_id) group by film_id;
-- 24:  Para cada cliente, cuenta cuántos pagos ha realizado en 2005 (usando el año de payment_date).
select customer_id, first_name, last_name, count(payment_id) as payments_2005
from customer join payment using(customer_id) where year(payment_date)=2005 group by customer_id;
-- 25:  Para cada película, muestra el promedio de tarifa de alquiler (rental_rate) de las copias existentes (es un promedio redundante pero válido).
select film_id, title, avg(rental_rate) as avg_rate from film group by film_id;
-- 26:  Para cada actor, muestra la duración media (length) de sus películas.
select actor_id, first_name, last_name, avg(length) as avg_length_by_actor
from film join film_actor using(film_id) join actor using (actor_id) group by actor_id;
-- 27:  Para cada ciudad, cuenta cuántos clientes hay (usando la relación cliente->address->city requiere 3 tablas; aquí contamos direcciones por ciudad).
select city_id, city, count(address_id) as total_addresses
from customer join address using (address_id) join city using (city_id) group by city_id order by city_id;
-- 28:  Para cada película, cuenta cuántos actores tiene asociados.
select film_id, title, count(actor_id) as actors_in_film
from film join film_actor using(film_id) group by film_id;
-- 29:  Para cada categoría (por id), cuenta cuántas películas pertenecen a ella (sin nombre de categoría para mantener 2 tablas).
select category_id, count(film_id) as films_in_category
from category join film_category using(category_id) group by category_id;
-- 30:  Para cada tienda, cuenta cuántos alquileres totales se originan en su inventario.
select store_id, count(inventory_id) as rentals_by_store
from rental join inventory using(inventory_id)  group by store_id;
-- ==============================================
-- SECCIÓN B) 30 CONSULTAS CON JOIN DE 3 TABLAS
-- ==============================================
-- 31:  Para cada actor, cuenta cuántas películas tiene y muestra solo los que superan 15 películas.
select actor_id, first_name, last_name, count(film_id) as films_by_actor
from actor join film_actor using(actor_id) group by actor_id having count(film_id) > 15;
-- 32:  Para cada categoría (por nombre), cuenta cuántas películas hay en esa categoría.
select category_id, category.name as category_name, count(film_id) as films_in_category
from film_category join category using(category_id) group by category_id;
-- 33:  Para cada película, cuenta cuántos alquileres se han hecho de sus copias.
select film_id, title, count(rental_id) as total_rentals
from film join inventory using(film_id) join rental using(inventory_id) group by film_id;
-- 34:  Para cada cliente, suma el importe pagado en 2005 y filtra clientes con total >= 150.
select customer_id, first_name, last_name, sum(amount) as total_2005
from customer join payment using(customer_id) where year(payment_date)=2005 group by customer_id having sum(amount) >= 150;
-- 35:  Para cada tienda, suma el importe cobrado por todos sus empleados.
select store_id, sum(amount) as payments_processed 
from store join staff using (store_id) join payment using(staff_id) group by staff_id;
-- 36:  Para cada ciudad, cuenta cuántos empleados residen ahí (staff -> address -> city).
select city_id, city, count(address_id) as staff_in_city
from staff join address using (address_id) join city using (city_id) group by address_id;
-- 37:  Para cada ciudad, cuenta cuántas tiendas existen (store -> address -> city).
select city_id, city, count(address_id) as stores_in_city
from store join address using (address_id) join city using (city_id) group by address_id;
-- 38:  Para cada actor, calcula la duración media de sus películas del año 2006.
select actor_id, first_name, last_name, avg(length) as avg_len_2006
from film join film_actor using(film_id) join actor using (actor_id) where release_year = 2006 group by actor_id;
-- 39:  Para cada categoría, calcula la duración media y muestra solo las que superan 120.
select category_id, name as category_name, avg(length) as avg_len
from category join film_category using(category_id) join film using(film_id) group by category_id having avg(length)>120;
-- 40:  Para cada idioma, suma las tarifas de alquiler (rental_rate) de todas sus películas.
select language_id, language.name as language_name, sum(rental_rate*rental_duration) as sum_rates
from language join film using (language_id) group by language_id;
-- 41:  Para cada cliente, cuenta cuántos alquileres realizó en fines de semana (SÁB-DO) usando DAYOFWEEK (1=Domingo).
select customer_id, first_name, last_name, count(rental_id) as weekend_rentals
from customer join rental using(customer_id) where dayofweek(rental_date) = 1 or dayofweek(rental_date) = 7 group by customer_id
order by customer_id;
-- 42:  Para cada actor, muestra el total de títulos distintos en los que participa (equivale a COUNT DISTINCT, sin subconsulta).
select actor_id, first_name, last_name, count(distinct film_id) as distinct_films
from actor join film_actor using(actor_id) group by actor_id having count(film_id);
-- 43:  Para cada ciudad, cuenta cuántos clientes residen ahí (customer -> address -> city).
select city_id, city, count(address_id) as customers_in_city
from customer join address using (address_id) join city using (city_id) group by address_id;
-- 44:  Para cada categoría, muestra cuántos actores distintos participan en películas de esa categoría.
select category_id, name as category_name, count(distinct actor_id) as actors_in_category
from film_category join category using(category_id) join film using(film_id)
 join film_actor using(film_id) group by category_id;
-- 45:  Para cada tienda, cuenta cuántas copias totales (inventario) tiene de películas en 2006.
select store_id, count(film_id) as copies_2006
from  inventory join film using(film_id)
 where release_year < 2007 group by store_id order by store_id desc;
-- 46:  Para cada cliente, suma el total pagado por alquileres cuyo empleado pertenece a la tienda 1.
select customer_id, c.first_name, c.last_name, sum(amount) as total_amount
from customer c join payment using(customer_id) join staff using(staff_id) where staff_id = 1
group by customer_id;
-- 47:  Para cada película, cuenta cuántos actores tienen el apellido de longitud >= 5.
select film_id, title, count(actor_id) as actors_lastname_len5plus
from film join film_actor using(film_id) join actor using(actor_id)
 where length(last_name) >= 5 group by film_id;
-- 48:  Para cada categoría, suma la duración total (length) de sus películas.
select category_id, name as category_name, sum(length) as total_length
from film_category join category using(category_id) join film using(film_id)
  group by category_id;
-- 49:  Para cada ciudad, suma los importes pagados por clientes que residen en esa ciudad.
select city_id, city, sum(amount) as total_paid
from customer join address using (address_id) join city using (city_id)
join payment using(customer_id) group by address_id;
-- 50:  Para cada idioma, cuenta cuántos actores distintos participan en películas de ese idioma.
select language_id, name as language_name,  count(distinct actor_id) as actors_in_language
from language join film using(language_id) join film_actor using(film_id) 
group by language_id having count(film_id);  
-- 51:  Para cada tienda, cuenta cuántos clientes activos (active=1) tiene.
select store_id, count(customer_id) as active_customers
from store join customer using(store_id) where active = 1 group by store_id;  
-- 52:  Para cada cliente, cuenta en cuántas categorías distintas ha alquilado (aprox. vía film_category; requiere 4 tablas, aquí contamos películas 2006 por inventario).
select customer_id, c.first_name, c.last_name, count(distinct category_id) as rentals_2006
from film_category join film using(film_id) join inventory using(film_id) join rental using(inventory_id)
join customer c using(customer_id) where year(rental_date) = 2006 group by customer_id;
-- 53:  Para cada empleado, cuenta cuántos clientes diferentes le han pagado.
select staff_id, first_name, last_name, count(distinct customer_id)
from staff join payment using(staff_id) group by staff_id;
-- 54:  Para cada ciudad, cuenta cuántas películas del año 2006 han sido alquiladas por residentes en esa ciudad.
select city_id, city, count(inventory_id) as rentals_2006_by_city
from city join address using(city_id) join customer using(address_id)
join rental using(customer_id) where year(rental_date) = 2006 group by city_id;
-- 55:  Para cada categoría, calcula el promedio de replacement_cost de sus películas.
select category_id, name as category_name, avg(replacement_cost) as avg_replacement_cost
from category join film_category using(category_id) join film using (film_id) group by category_id;
-- 56:  Para cada tienda, suma los importes cobrados en 2006 (vía empleados de esa tienda).
select store_id, sum(amount) as revenue_2006
from store join staff using(store_id)
join payment using(staff_id) where year(payment_date) = 2006 group by store_id;
-- 57:  Para cada actor, cuenta cuántas películas tienen título de más de 12 caracteres.
select actor_id, first_name, last_name, count(film_id)
from actor join film_actor using(actor_id) join film using(film_id) where length(title)>12 
group by actor_id;
-- 58:  Para cada ciudad, calcula la suma de pagos de 2005 y filtra las ciudades con total >= 300.
-- select city_id, sum(amount) as city_payments_2005_bigger_300
-- from payment join customer using (customer_id) join address using(address_id) 
-- join city using (city_id) where year(payment_date) = 2005 and sum(amount)>=300 group by city_id;
	-- da error no hay total de pagos por ciudad mayores a 300 sin contar solo con los de 2005
-- 59:  Para cada categoría, cuenta cuántas películas tienen rating 'PG' o 'PG-13'.
select category_id, name as category_name, count(film_id) as avg_replacement_cost
from category join film_category using(category_id) join film using (film_id) where rating="PG" or rating="PG-13"group by category_id;
-- 60:  Para cada cliente, calcula el total pagado en pagos procesados por el empleado 2.
select customer_id, c.first_name, c.last_name, sum(amount) as total_amount
from customer c join payment using(customer_id) join staff using(staff_id) where staff_id = 2
group by customer_id;
-- ==============================================
-- SECCIÓN C) 20 CONSULTAS CON JOIN DE 4 TABLAS
-- ==============================================
-- 61:  Para cada ciudad, cuenta cuántos clientes hay y muestra solo ciudades con 10 o más clientes.
-- select city_id, city, count(address_id) as customers_in_city
-- from customer join address using (address_id) join city using (city_id) where count(address_id)>10 group by address_id;
-- da error no hay mas de 10 clientes en ninguna ciudad
-- 62:  Para cada actor, cuenta cuántos alquileres totales suman todas sus películas.
select actor_id, first_name, last_name, count(rental_id) as rentals_for_actor
from rental join inventory using(inventory_id) join film_actor using (film_id) 
join actor using(actor_id) group by actor_id;
-- 63:  Para cada categoría, suma los importes pagados derivados de películas de esa categoría.
select category_id, name as category_name, sum(amount) as rentals_for_actor
from payment join rental using(rental_id) join inventory using(inventory_id) 
join film_category using (film_id) 
join category using(category_id) group by category_id;
-- 64:  Para cada ciudad, suma los importes pagados por clientes residentes en esa ciudad en 2005.
select city_id, city, sum(amount) as total_paid_2025
from payment  join customer using(customer_id) join address using(address_id)
join city using (city_id) where year(payment_date) = 2005
group by city_id;
-- 65:  Para cada tienda, cuenta cuántos actores distintos aparecen en las películas de su inventario.
select store_id, count( distinct actor_id) as distinct_actors_in_store_inventory
from store join inventory using(store_id) join film using(film_id)
join film_actor using (film_id) group by store_id;
-- 66:  Para cada idioma, cuenta cuántos alquileres totales se han hecho de películas en ese idioma.
select language_id, name as language_name, count(rental_id) as rentals_in_language
from rental join inventory using(inventory_id) join film using(film_id)
join language using (language_id) group by language_id;
-- 67:  Para cada cliente, cuenta en cuántos meses distintos de 2005 realizó pagos (meses distintos).
select customer_id, first_name, last_name, count(distinct month(payment_date)) as active_months_2025
from payment  join customer using(customer_id)  where year(payment_date) = 2005
group by customer_id;
-- 68:  Para cada categoría, calcula la duración media de las películas alquiladas (considerando solo películas alquiladas).
select category_id, name as category_name, avg(length) as avg_length_rented
from category join film_category using(category_id) join film using(film_id)
join inventory using (film_id) join rental using(inventory_id) group by category_id;
-- 69:  Para cada país, cuenta cuántos clientes hay (country -> city -> address -> customer).
select country_id, country, count(customer_id) as customers_in_country
from country join city using(country_id) join address using(city_id) 
join customer using(address_id) group by country_id;
-- 70:  Para cada país, suma los importes pagados por sus clientes.
select country_id, country, sum(amount) as total_paid_by_country
from country join city using(country_id) join address using(city_id) 
join customer using(address_id) join payment using (customer_id) group by country_id;
-- 71:  Para cada tienda, cuenta cuántas categorías distintas existen en su inventario.
select store_id, count(distinct category_id) as distinct_categories_in_store
from film_category join inventory using(film_id) join store using(store_id) 
group by store_id;
-- 72:  Para cada tienda, suma la recaudación por categoría (resultado agregado por tienda y categoría).
select store_id, category_id, name as category_name, sum(amount) as revenue
from store join inventory using(store_id)
join film_category using (film_id) join category using(category_id)
join rental using (inventory_id) join payment using(rental_id)
group by store_id, category_id order by category_id;
-- 73:  Para cada actor, cuenta en cuántas tiendas distintas se han alquilado sus películas.
select actor_id, first_name, last_name, count(distinct store_id) as stores_with_actor_films_rented
from actor join film_actor using(actor_id) join inventory using(film_id) 
join store using (store_id) group by actor_id;
-- 74:  Para cada categoría, cuenta cuántos clientes distintos han alquilado películas de esa categoría.
select category_id, name as category_name, count(distinct customer_id) as didtinct_customers
from category join film_category using (category_id) join inventory using(film_id)
join rental using (inventory_id) group by category_id;
-- 75:  Para cada idioma, cuenta cuántos actores distintos participan en películas alquiladas en ese idioma.
select language_id, name as language_name, count(distinct actor_id)
from language join film using (language_id) join film_actor using (film_id) group by language_id;
-- 76:  Para cada país, cuenta cuántas tiendas hay (país->ciudad->address->store).
select country_id, country, count(store_id) as stores_in_country
from country join city using (country_id) join address using (city_id) 
join store using (address_id) group by country_id;
-- 77:  Para cada cliente, cuenta los alquileres en los que la devolución (return_date) fue el mismo día del alquiler.
select customer_id, first_name, last_name, count(rental_id) as same_day_returns
from customer join rental using (customer_id)
where date(rental_date)=date(return_date) group by customer_id;
-- 78:  Para cada tienda, cuenta cuántos clientes distintos realizaron pagos en 2005.
select store.store_id, count(distinct customer_id) as distinct_customer_2025
from store join customer using (address_id) join payment using (customer_id)
where year(payment_date) = 2005 group by store.store_id;
-- 79:  Para cada categoría, cuenta cuántas películas con título de longitud > 15 han sido alquiladas.
select category_id, name as category_name, count(inventory_id)
from category join film_category using (category_id) join film using (film_id)
join inventory using (film_id) join rental using(inventory_id)
where length(title) > 15 group by category_id;
-- 80:  Para cada país, suma los pagos procesados por los empleados de las tiendas ubicadas en ese país.
select country_id,country, sum(amount) as revenue_by_country_staff
from country join city using(country_id) join address using(city_id) 
join store using (address_id) join staff using (store_id)
join payment using (staff_id) 
group by store_id;
-- ==============================================
-- SECCIÓN D) 20 CONSULTAS EXTRA (DIFICULTAD +), <=4 JOINS
-- ==============================================
-- 81:  Para cada cliente, muestra el total pagado con IVA teórico del 21% aplicado (total*1.21), redondeado a 2 decimales.
select customer_id, first_name, last_name, sum(amount*1.21)
from customer join payment using (customer_id) group by customer_id;
-- 82:  Para cada hora del día (0-23), cuenta cuántos alquileres se iniciaron en esa hora.
select hour(rental_date) as rental_hour, count(rental_id) as rentals_in_hour
from rental group by hour(rental_date) order by hour(rental_date);
-- 83:  Para cada tienda, muestra la media de length de las películas alquiladas en 2005 y filtra las tiendas con media >= 100.
select store_id, avg(length) as avg_length_2005
from store join inventory using (store_id) join film using (film_id)
group by store_id having avg(length)>100;
-- 84:  Para cada categoría, muestra la media de replacement_cost de las películas alquiladas un domingo.
select category_id, name as category_name, avg(replacement_cost)
from category join film_category using(category_id) JOIN film USING(film_id)
JOIN inventory USING(film_id) JOIN rental USING(inventory_id)
WHERE DAYOFWEEK(rental_date)=1 GROUP BY category_id; 
-- 85:  Para cada empleado, muestra el importe total por pagos realizados entre las 00:00 y 06:00 (inclusive 00:00, exclusivo 06:00).
select staff_id, first_name, last_name 
from staff
-- 86:  Para cada actor, cuenta cuántas de sus películas tienen un título que contiene la palabra 'LOVE' (mayúsculas).
select actor_id, first_name, last_name, count(film_id) as films_with
from actor
-- 87:  Para cada idioma, muestra el total de pagos de alquileres de películas en ese idioma.
select language_id, name as language_name
from language
-- 88:  Para cada cliente, cuenta en cuántos días distintos de 2005 realizó algún alquiler.
select customer_id
from customer
-- 89:  Para cada categoría, calcula la longitud media de títulos (número de caracteres) de sus películas alquiladas.
select category_id, first_name, last_name
from category
-- 90:  Para cada tienda, cuenta cuántos clientes distintos alquilaron en el primer trimestre de 2006 (enero-marzo).
select store_id
from store
-- 91:  Para cada país, cuenta cuántas categorías diferentes han sido alquiladas por clientes residentes en ese país.
select country_id, country
from country
-- 92:  Para cada cliente, muestra el importe medio de sus pagos redondeado a 2 decimales, solo si ha hecho al menos 10 pagos.
select custoemr_id, first_name, last_name
from customer
-- 93:  Para cada categoría, muestra el número de películas con replacement_cost > 20 que hayan sido alquiladas al menos una vez.
SELECT category_id, name AS category_name, COUNT(film_id)
FROM category JOIN film_category USING(category_id) JOIN film USING(film_id)
WHERE replacement_cost > 20 GROUP BY category_id;
-- 94:  Para cada tienda, suma los importes pagados en fines de semana.
select store_id
from store
-- 95:  Para cada actor, cuenta cuántas películas suyas fueron alquiladas por al menos 5 clientes distintos (se cuenta alquileres y luego se filtra por HAVING).
select actor_id
from actor
-- 96:  Para cada idioma, muestra el número de películas cuyo título empieza por la letra 'A' y que han sido alquiladas.
select language_id
from language
-- 97:  Para cada país, suma el importe total de pagos realizados por clientes residentes y filtra países con total >= 1000.
select country_id
from country
-- 98:  Para cada cliente, cuenta cuántos días han pasado entre su primer y su último alquiler en 2005 (diferencia de fechas), mostrando solo clientes con >= 5 alquileres en 2005.
--     (Se evita subconsulta calculando sobre el conjunto agrupado por cliente y usando MIN/MAX de rental_date en 2005).
select customer_id
from customer
-- 99:  Para cada tienda, muestra la media de importes cobrados por transacción en el año 2006, con dos decimales.
select store_id
from store
-- 100:  Para cada categoría, calcula la media de duración (length) de películas alquiladas en 2006 y ordénalas descendentemente por dicha media.
select category_id
from category
-- 72 77 78 83