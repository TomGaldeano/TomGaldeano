"""
  
4. Escribir un programa que pida por teclado una cadena de texto y la escriba en sin
espacios en blanco (si los hubiera). Además, nos debe de decir el número de espacios
que ha encontrado y suprimido.
5. Escribir un programa que pida por teclado una cadena de texto y la imprima escrita al
reves (es decir, si el usuario escribe Hola Mundo el programa debería de escribir
odnuM aloH)
6. Escribir un programa que pida por teclado una cadena de texto y la separe en dos
distintas. En la primera de ellas estarían las letras que ocupan una posición par y en la
segunda las que ocupan una posición impar. Por ejemplo, si el usuario escribe Hola
Mundo la primera cadena sería Hl ud y la segunda oaMno
7. Escribir un programa que pida por teclado una cadena de texto y la escriba con el
alfabeto típico de los hackers sustituyendo las letras a por el número 4, las letras e por
el número 3, las letras i por el número 1 y las letras o por el número 0. Considera que
las vocales pueden estar escritas en mayúsculas o minúsculas, pero no hace falta que
tengas en cuenta que además podrían ir acentuadas
8. Escribir un programa que reciba una cadena de texto por teclado y la muestre sin
vocales. Por ejemplo, si recibe la cadena “Hola Mundo” debería de devolver “Hl Mnd”.
9. Escribir un programa que nos pida elegir entre cuatro destinos turísticos (Francia,
Italia, Chile o Japón) y dependiendo de nuestra respuesta nos diga cual es la capital de
nuestro destino (París, Roma, Santiago de Chile o Tokio)
10. Escribe un programa que valide si un NIF español introducido por teclado es correcto.
La longitud exacta de la cadena ha de ser de 9 caractéres. Los ocho primeros han de
ser números comprendidos entre el 0 y el 9 y el último una letra que puede estar
escrita en mayúsculas o minúsculas.
11. Mejorar el programa anterior para que detecte si se trata de un NIF o un NIE y nos
comunique, además de si es válido de que tipo es.
José María Morales Vázquez Página 1
Ejercicios genéricos de programación 3
Un NIE es una cadena de 9 caractéres que siempre empieza por X,Y o Z y a
continuación vienen 7 cifras y una letra final. Las letras inicial y final pueden estar
escritas con mayúsculas o con minúsculas
12. Las matrículas españolas constan de un número de cuatro dígitos y tres letras
cualesquiera en mayúsculas a excepción de las vocales, la Ñ y la Q. Escribe un
programa que detecte si una matrícula introducida por teclado es válida o no.
13. Modifica el programa anterior contemplando que entre los números y las letras
podría haber un espacio en blanco (uno solo) o un guión. En ambos casos se
considerará también que la matrícula es válida (si cumple todo lo demás, claro)
14. Modifica el programa que validaba si un NIF era correcto comprobando si la letra que
incorpora lo es. La forma de hacerlo es la siguiente:
15. Escribe un programa que reciba por teclado una fecha en el formato DD/MM/YYYY. El
programa debe de comprobar si la fecha es correcta teniendo en cuenta:
Qué el formato sea el correcto
Que la fecha sea totalmente válida teniendo en cuenta incluso los años que son
bisiestos (aquellos que son divisibles entre cuatro).
"""
def ej1():
    """"
    1. Escribir un programa que pida una contraseña por teclado (dos veces) y si no
    coinciden nos lo vuelva a pedir hasta que lo hagan
    """
    while True:
        pwd1 = input("Introduce la contraseña: ")
        pwd2 = input("Vuelve a introducir la contraseña: ")
        if pwd1 == pwd2:
            print("Contraseñas coinciden.")
            break
        else:
            print("Contraseñas no coinciden. Inténtalo de nuevo.")

def ej2():
    """
    2. Modifica el programa anterior para que cuando coincidan ambas contraseñas nos
    informe del número de intentos inválidos
    """
    invalid_attempts = 0
    while True:
        pwd1 = input("Introduce la contraseña: ")
        pwd2 = input("Vuelve a introducir la contraseña: ")
        if pwd1 == pwd2:
            print(f"Contraseñas coinciden. Número de intentos inválidos: {invalid_attempts}")
            break

def ej3():
    """"
    3. Escribir un programa que nos pida nuestro nombre y apellidos (dos peticiones
    diferentes hechas en ese orden) y nos lo escriba formateado de la siguiente forma:
    Morales Vázquez, José María
    """
    nombre = input("Introduce tu nombre: ")
    apellidos = input("Introduce tus apellidos: ")
    print(f"{apellidos}, {nombre}")

if __name__ == "__main__":  
    pass