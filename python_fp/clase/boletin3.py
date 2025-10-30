import re
from datetime import datetime

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

def ej4():
    """
    4. Escribir un programa que pida por teclado una cadena de texto y la escriba en sin
    espacios en blanco (si los hubiera). Además, nos debe de decir el número de espacios
    que ha encontrado y suprimido.
    """
    texto = input("Introduce una cadena de texto: ")
    sin_espacios = texto.replace(" ", "")
    num_espacios = len(texto) - len(sin_espacios)
    print(f"Cadena sin espacios: '{sin_espacios}'")
    print(f"Número de espacios eliminados: {num_espacios}")

def ej5():
    """
    5. Escribir un programa que pida por teclado una cadena de texto y la imprima escrita al
    reves (es decir, si el usuario escribe Hola Mundo el programa debería de escribir
    odnuM aloH)
    """
    texto = input("Introduce una cadena de texto: ")
    texto_reves = texto[::-1]
    print(f"Cadena al revés: '{texto_reves}'")

def ej6():
    """
    6. Escribir un programa que pida por teclado una cadena de texto y la separe en dos
    distintas. En la primera de ellas estarían las letras que ocupan una posición par y en la
    segunda las que ocupan una posición impar. Por ejemplo, si el usuario escribe Hola
    Mundo la primera cadena sería Hl ud y la segunda oaMno
    """
    texto = input("Introduce una cadena de texto: ")
    pares = texto[::2]
    impares = texto[1::2]
    print(f"Letras en posiciones pares: '{pares}'")
    print(f"Letras en posiciones impares: '{impares}'")

def ej7():
    """
    7. Escribir un programa que pida por teclado una cadena de texto y la escriba con el
    alfabeto típico de los hackers sustituyendo las letras a por el número 4, las letras e por
    el número 3, las letras i por el número 1 y las letras o por el número 0. Considera que
    las vocales pueden estar escritas en mayúsculas o minúsculas, pero no hace falta que
    tengas en cuenta que además podrían ir acentuadas
    """
    texto = input("Introduce una cadena de texto: ")
    texto_hacker = (texto.replace('a', '4').replace('A', '4')
                          .replace('e', '3').replace('E', '3')
                          .replace('i', '1').replace('I', '1')
                          .replace('o', '0').replace('O', '0'))
    print(f"Cadena en alfabeto hacker: '{texto_hacker}'")

def ej8():
    """
    8. Escribir un programa que reciba una cadena de texto por teclado y la muestre sin
    vocales. Por ejemplo, si recibe la cadena “Hola Mundo” debería de devolver “Hl Mnd”.
    """
    texto = input("Introduce una cadena de texto: ")
    sin_vocales = ''.join([letra for letra in texto if letra.lower() not in 'aeiou'])
    print(f"Cadena sin vocales: '{sin_vocales}'")

def ej9():
    """
    9. Escribir un programa que nos pida elegir entre cuatro destinos turísticos (Francia,
    Italia, Chile o Japón) y dependiendo de nuestra respuesta nos diga cual es la capital de
    nuestro destino (París, Roma, Santiago de Chile o Tokio)
    """
    destinos = {
        "Francia": "París",
        "Italia": "Roma",
        "Chile": "Santiago de Chile",
        "Japón": "Tokio"}
    destino = input("Elige un destino turístico (Francia, Italia, Chile, Japón): ")
    capital = destinos.get(destino, "Destino no válido")
    print(f"La capital de {destino} es: {capital}")

def ej10():
    """
    10. Escribe un programa que valide si un NIF español introducido por teclado es correcto.
    La longitud exacta de la cadena ha de ser de 9 caractéres. Los ocho primeros han de
    ser números comprendidos entre el 0 y el 9 y el último una letra que puede estar
    escrita en mayúsculas o minúsculas.
    """
    nif = input("Introduce un NIF español: ")
    if len(nif) == 9 and nif[:-1].isdigit() and nif[-1].isalpha():
        print("NIF válido")
    else:
        print("NIF no válido")

def ej11():
    """
    11. Mejorar el programa anterior para que detecte si se trata de un NIF o un NIE y nos
    comunique, además de si es válido de que tipo es.
    Un NIE es una cadena de 9 caractéres que siempre empieza por X,Y o Z y a
    continuación vienen 7 cifras y una letra final. Las letras inicial y final pueden estar
    escritas con mayúsculas o con minúsculas
    """
    id_number = input("Introduce un NIF o NIE: ")
    if len(id_number) == 9:
        if id_number[0].upper() in 'XYZ' and id_number[1:8].isdigit() and id_number[-1].isalpha():
            print("NIE válido")
        elif id_number[:-1].isdigit() and id_number[-1].isalpha():
            print("NIF válido")
        else:
            print("ID no válido")
    else:
        print("ID no válido")

def ej12():
    """
    12. Las matrículas españolas constan de un número de cuatro dígitos y tres letras
    cualesquiera en mayúsculas a excepción de las vocales, la Ñ y la Q. Escribe un
    programa que detecte si una matrícula introducida por teclado es válida o no.
    """
    matricula = input("Introduce una matrícula española: ")
    if (len(matricula) == 7 and matricula[:4].isdigit() and
        all(letra.isupper() and letra not in 'AEIOUÑQ' for letra in matricula[4:])):
        print("Matrícula válida")
    else:
        print("Matrícula no válida")

def ej13():
    """
    13. Modifica el programa anterior contemplando que entre los números y las letras
    podría haber un espacio en blanco (uno solo) o un guión. En ambos casos se
    considerará también que la matrícula es válida (si cumple todo lo demás, claro)
    """
    matricula = input("Introduce una matrícula española: ").replace(" ", "").replace("-", "")
    if (len(matricula) == 7 and matricula[:4].isdigit() and
        all(letra.isupper() and letra not in 'AEIOUÑQ' for letra in matricula[4:])):
        print("Matrícula válida")
    else:
        print("Matrícula no válida")

def ej14():
    """
    14. Modifica el programa que validaba si un NIF era correcto comprobando si la letra que
    incorpora lo es. La forma de hacerlo es la siguiente:
    """
    letras_nif = "TRWAGMYFPDXBNJZSQVHLCKE"
    nif = input("Introduce un NIF español: ")
    if (len(nif) == 9 and nif[:-1].isdigit() and nif[-1].isalpha()):
        numero = int(nif[:-1])
        letra_correcta = letras_nif[numero % 23]
        if nif[-1].upper() == letra_correcta:
            print("NIF válido")
        else:
            print("NIF no válido: letra incorrecta")
    else:
        print("No es un NIF")

def ej15():
    """
    15. Escribe un programa que reciba por teclado una fecha en el formato DD/MM/YYYY. El
    programa debe de comprobar si la fecha es correcta teniendo en cuenta:
    Qué el formato sea el correcto
    Que la fecha sea totalmente válida teniendo en cuenta incluso los años que son
    bisiestos (aquellos que son divisibles entre cuatro).
    """
    fecha = input("Introduce una fecha en formato DD/MM/YYYY: ")
    if re.match(r'^\d{2}/\d{2}/\d{4}$', fecha):
        dia, mes, anio = map(int, fecha.split('/'))
        try:
            datetime(anio, mes, dia)
            print("Fecha válida")
        except ValueError:
            print("Fecha no válida")
    else:
        print("Formato de fecha incorrecto")

if __name__ == "__main__": 
    pass
    ej1()