"""
4. Escribir un programa que nos pida por teclado dos calificaciones numéricas de un
alumno y nos muestre la media aritmética resultante redondeada sin decimales. Las
notas introducidas deben de estar entre 0 y 10 y admiten decimales. Caso de que una
entrada sea errónea debería de advertirnos de ello y no hacer el cálculo
5. Escribir un programa que nos pida las notas obtenidas en un trimestre y nos muestre
la media ponderada sabiendo que;
1. La primera nota corresponde al trabajo en clase y cuenta como un 5% del total
2. La segunda corresponde a los ejercicios prácticos: 15%
3. La tercera la nota del examen: 80%
El resultado debería de mostrarse de dos formas: redondeado con dos decimales
(nota real) y sin redpmdeada sin decimales (nota de boletín).
6. Modifica el ejercicio anterior para que la nota del boletín se redondee
matemáticamente si es superior a 5 pero se trunquen los decimales si es inferior a 5
7. Escribir un programa que pida un número por teclado y nos imprima la tabla de
multiplicar de dicho número del 1 al 10. Por ejemplo, si introducimos el 74 el
resultado será algo así:
74 x 1 = 74
74 x 2 = 148
...
74 x 10 = 740
8. Escribe un programa que pida un número por teclado y escriba todos sus divisores
separados por comas (y evitando poner una coma al final). Por ejemplo, si el número
introducido es el 14 tu programa debería de mostrar lo siguiente:
Divisores del número 14: 1, 2, 7, 14
9. Escribir un programa que pida números entre el 1 y el 100 por teclado hasta que
escribamos la palabra FIN (con mayúsculas). Si el usuario introduce una entrada
inválida (números superiores a 100, otras cadenas de caracteres que no sean FIN, etc.)
no se tendrá en cuenta pero se mostrará un mensaje de error y el programa seguirá
su curso. Cuando terminamos (al introducir la palabra FIN, recuerda) mostraremos
José María Morales Vázquez Página 1
Ejercicios genéricos de programación 2
por pantalla el numero de entradas válidas que hemos hecho (sin contar esta última
que sólo sirve para finalizar el programa)
10. Modificar el programa anterior para que nos muestre al final la media aritmética de
las entradas válidas
11. Modificar el programa anterior para que, además, nos diga al final cual han sido el
número mayor y el menor que has introducido
12. Realiza un juego en el que debes de acertar un número entre el 1 y el 50 que el
ordenador ha elegido de forma aleatoria. El programa te indicará si has acertado, si te
has pasado o si te has quedado corto. El programa finaliza cuando se acierta o cuando
se superan el número máximo de intentos establecidos en 5.
13. Modifica el programa anterior para que el programa te de todos los intentos que
necesites pero que cuando aciertes te informe de cuantas veces has fallado antes de
lograrlo
14. Modifica el programa anterior para que al final del programa te pida si quieres volver
a jugar y en caso afirmativo comience una nueva partida
15. Modifica el programa anterior para que al iniciar el juego te pida dos parámetros con
objeto de cambiar la dificultad del juego: el número máximo (antes era siempre 50) o
el número de intentos posibles (antes era siempre 5).
16. Escribe un programa que pida por teclado el radio de una circunferencia, admitiendo
valores con decimales y calcule la longitud y el área de la circunferencia (redondeando
a cinco decimales). Si no las recuerdas, las fórmulas son las siguientes:
area = 3.14159 * radio2
longitud = 2 * 3.14159 * radio
17. Escribir un programa que reciba por teclado una temperatura en cualquiera de las
tres unidades básicas (Celcius, Farenheit o Kelvin) y la devuelva en las otras dos.
Tu programa reconocerá la unidad que has usado al introducir la entrada por teclado
porque irá acompañado de una letra que lo indique. Por ejemplo, 12C, 280.57K o
98.6F
Se admitirán decimales en la entrada, (como se ve en los ejemplos anteriores) y se
devolverá el resultado con dos decimales
Las formulas de conversión entre unidades son las siguientes:
Para convertir de ºC a ºF use la fórmula: ºF = ºC x 1.8 + 32.
Para convertir de ºF a ºC use la fórmula: ºC = (ºF-32) ÷ 1.8.
Para convertir de ºK a ºC use la fórmula: ºC = ºK – 273.15
Para convertir de ºC a ºK use la fórmula: ºK = ºC + 273.15.
Para convertir de ºF a ºK use la fórmula: ºK = 5/9 (ºF – 32) + 273.15.
Para convertir de ºK a ºF use la fórmula: ºF = 1.8(ºK – 273.15) + 32.
18. La tabla de tarifas impositivas en España para 2022 es la siguiente:
Escribe un programa que le pida al usuario su sueldo anual (lógicamente puede ser
un número con decimales) y le informe que porcentaje de retención le corresponde, el
importe de la misma y el importe neto restante que cobrará.
"""
def ej1():
    """
    1. Escribir un programa que nos pida tres palabras por teclado en cualquier orden y nos
    las muestre en pantalla ordenadas alfabeticamente en orden ascendente

    """
    palabras = []
    for i in range(3):
        palabra = input("Introduce una palabra: ")
        palabras.append(palabra)
    palabras.sort()
    for i in palabras:
        print(i)

def ej2():
    """
    2. Idem al anterior pero ordenando ahora en orden descendente
    """
    palabras = []
    for i in range(3):
        palabra = input("Introduce una palabra: ")
        palabras.append(palabra)
    palabras.sort(reverse=True)
    for i in palabras:
        print(i)

"""
3. Escribir un programa que pida un número por teclado al usuario que simule ser el
precio de un artículo y escriba el resultado de aplicarle el IVA del 21%. El resultado
debe de estar redondeado a dos decimales.
"""


if __name__ == "__main__":
    ej2()
    pass