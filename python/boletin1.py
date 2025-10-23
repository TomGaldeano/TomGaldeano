import random
"""
5. Escribir un programa que pida por teclado un número al usuario y diga si es par o impar
6. Escribir un programa que pida por teclado un número al usuario y diga si es divisible por 3 o
no.
7. Escribir un programa que pida un número por teclado al usuario que simule ser el precio de
un artículo y escriba el resultado de aplicarle el IVA del 21%
8. Escribir un programa que reciba por teclado el importe de una cantidad a pagar en euros
(puede tener decimales) y el número de meses que contamos para pagarla (tiene que ser un
número entero) y nos devuelva el dinero que tendríamos que pagar cada mes. No aplicamos
intereses de ningún tipo y redondeamos a dos decimales.
9. Escribir un programa que genere un número aleatorio entre el 0 y el 50 y lo muestre
10. Escribir un programa que genere dos números aleatorios simultáneamente entre el 1 y el 6
(simulando una tirada de dos dados)
11. Modificar el programa anterior para que tu programa tire dos dados de forma continuada
hasta que el número que salga en ambos sea el mismo. En ese momento debería de parar la
ejecución e informarnos de cuantas tiradas ha tenido que hacer para llegar a ese resultado
12. Escribir un programa que sirva como asistente para un juego de rol. Tu programa debería de
pedir por teclado el número de dados que se van a tirar y el número de caras de estos (4, 6,
8, 12, etc.) A continuación debería de hacer la tirada y mostrarla.
13. Modifica el programa anterior para que no admita dados con un número de caras impares
(¡no existen!). En el caso de meter un número impar de caras el programa debería de
informarnos de que es erróneo y volver a preguntarnos por este dato.
José María Morales Vázquez Página 1
Ejercicios genéricos de programación 1
14. Escribir un programa que nos pida dos números por teclado y genere un número aleatorio
comprendido entre ambos. Por el momento no te preocupes de que el primer número
siempre debería de ser menor que el segundo, simplemente no los metas en un orden
incorrecto.
15. Modificar el programa del punto anterior para que si el primer número que metemos es
mayor que el segundo funcione correctamente. Es decir, si metemos en primer lugar el 50 y
en segundo el 10 nos debería de generar un número aleatorio entre el 10 y el 50 (y no entre el
50 y el 10 que no tiene mucha lógica…)
16. Escribir un programa que genere seis números aleatorios entre el 1 y el 49 (simulando una
lotería primitiva). Por el momento no te preocupes de que algunos números puedan salir
repetidos. Ya resolveremos eso más adelante.
17. Escribir un programa que nos permita generar una quiniela. Para ello nos debe generar
quince números aleatorios entre el 1 y el 3. Recuerda que los resultados válidos son 1 X o 2,
así que si te sale un 3 lo que tienes que imprimir en pantalla es una X
18. Escribe un programa que genere números aleatorios entre el 1 y el 1000 sin parar y que sólo
se detenga cuando salga el 666. Los números que ha tenido que generar tu programa hasta
aparecer el 666 son los que restan para el apocalipsis. Tu programa debería de indicarlo con
un mensaje tétrico (¡Faltan 236 días para que se acabe todo! por ejemplo)
19. Escribir un programa que pida un número por teclado y nos muestre sus divisores
20. Escribir un programa que nos pida tres números por teclado en cualquier orden y nos los
muestre en pantalla ordenados de menor a mayor
21. Escribir un programa que pida por teclado un número al usuario y calcule si es primo o no
22. Escribir un programa que genere un número primo aleatorio entre el 10.000.000 y el
50.000.000
23. Escribir un programa que te escriba todos los números primos que hay entre el 1 y el 100
24. Modifica el programa anterior para que sea el usuario quién introduzca dos números y se nos
muestre los primos que hay entre ambos
25. Escribir un programa que reciba por teclado un número y muestre sucesivamente el
resultado de ir dividiéndolo por dos sucesivamente hasta llegar a un número igual o menor a
1. Caso de ser necesario los resultados se mostrarán con dos decimales. Un ejemplo de una
ejecución correcta después de introducir el número 34 sería esta:
Haz introducido el número 34
17
8.5
4.25
2.12
1.06
0.53
"""
def ej1():
    """
    1. Escribir un programa donde se muestren los 10 primeros números enteros
    """
    for i in range(1,11):
        print(i)

def ej2():
    """
    2. Escribir un programa donde se muestren los 50 primeros números pares
    """
    for i in range(2,51,2):
        print(i)

def ej3():
    """
    3. Escribir un programa donde se muestren los 5 primeros números múltiplos de uno dado por
    el usuario (se introducirá por teclado)
    """
    a = random.randint(1,6)
    for i in range (1,6):
        print(a*i)

def ej4():
    """
    4. Escribir un programa donde se muestren todos los números divisibles por 7 menores a
    10000
    """
    for i in range(7,10000,7):
        print(i)

"""
5. Escribir un programa que pida por teclado un número al usuario y diga si es par o impar
"""
value = int(input("dame un numero"))
if value%2 == 0:
    print("es par")
else: 
    print("es impar")