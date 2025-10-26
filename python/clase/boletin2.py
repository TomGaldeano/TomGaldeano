import random

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

def ej3():
    """
    3. Escribir un programa que pida un número por teclado al usuario que simule ser el
    precio de un artículo y escriba el resultado de aplicarle el IVA del 21%. El resultado
    debe de estar redondeado a dos decimales.
    """
    precio = float(input("Introduce el precio del artículo: "))
    iva = precio * 0.21
    total = precio + iva
    print("El precio con IVA es: {:.2f}".format(total))

def ej4():
    """
    4. Escribir un programa que nos pida por teclado dos calificaciones numéricas de un
    alumno y nos muestre la media aritmética resultante redondeada sin decimales. Las
    notas introducidas deben de estar entre 0 y 10 y admiten decimales. Caso de que una
    entrada sea errónea debería de advertirnos de ello y no hacer el cálculo
    """
    nota1 = float(input("Introduce la primera nota: "))
    nota2 = float(input("Introduce la segunda nota: "))
    if 0 <= nota1 <= 10 and 0 <= nota2 <= 10:
        media = (nota1 + nota2) / 2
        print("La media aritmética es: {}".format(round(media)))
    else:
        print("Error: Las notas deben estar entre 0 y 10.") 

def ej5():
    """
    5. Escribir un programa que nos pida las notas obtenidas en un trimestre y nos muestre
    la media ponderada sabiendo que;
    1. La primera nota corresponde al trabajo en clase y cuenta como un 5% del total
    2. La segunda corresponde a los ejercicios prácticos: 15%
    3. La tercera la nota del examen: 80%
    El resultado debería de mostrarse de dos formas: redondeado con dos decimales
    (nota real) y sin redpmdeada sin decimales (nota de boletín).
    """
    nota_trabajo = float(input("Introduce la nota del trabajo en clase: "))
    nota_ejercicios = float(input("Introduce la nota de los ejercicios prácticos: "))
    nota_examen = float(input("Introduce la nota del examen: "))

    media_ponderada = (nota_trabajo * 0.05) + (nota_ejercicios * 0.15) + (nota_examen * 0.80)
    print("Nota real (redondeada a dos decimales): {:.2f}".format(media_ponderada))
    print("Nota de boletín (sin decimales): {}".format(int(media_ponderada)))

def ej6():
    """
    6. Modifica el ejercicio anterior para que la nota del boletín se redondee
    matemáticamente si es superior a 5 pero se trunquen los decimales si es inferior a 5
    """
    nota_trabajo = float(input("Introduce la nota del trabajo en clase: "))
    nota_ejercicios = float(input("Introduce la nota de los ejercicios prácticos: "))
    nota_examen = float(input("Introduce la nota del examen: "))

    media_ponderada = (nota_trabajo * 0.05) + (nota_ejercicios * 0.15) + (nota_examen * 0.80)
    print("Nota real (redondeada a dos decimales): {:.2f}".format(media_ponderada))
    
    if media_ponderada >= 5:
        nota_boletin = round(media_ponderada)
    else:
        nota_boletin = int(media_ponderada)
    
    print("Nota de boletín: {}".format(nota_boletin))

def ej7():
    """
    7. Escribir un programa que pida un número por teclado y nos imprima la tabla de
    multiplicar de dicho número del 1 al 10. Por ejemplo, si introducimos el 74 el
    resultado será algo así:
    74 x 1 = 74
    74 x 2 = 148
    ...
    74 x 10 = 740
    """
    numero = int(input("Introduce un número para ver su tabla de multiplicar: "))
    for i in range(1, 11):
        print(f"{numero} x {i} = {numero * i}")

def ej8():
    """
    8. Escribe un programa que pida un número por teclado y escriba todos sus divisores
    separados por comas (y evitando poner una coma al final). Por ejemplo, si el número
    introducido es el 14 tu programa debería de mostrar lo siguiente:
    Divisores del número 14: 1, 2, 7, 14
    """
    numero = int(input("Introduce un número para ver sus divisores: "))
    divisores = []
    for i in range(1, numero + 1):
        if numero % i == 0:
            divisores.append(str(i))
    print(f"Divisores del número {numero}: {', '.join(divisores)}")

def ej9():
    """
    9. Escribir un programa que pida números entre el 1 y el 100 por teclado hasta que
    escribamos la palabra FIN (con mayúsculas). Si el usuario introduce una entrada
    inválida (números superiores a 100, otras cadenas de caracteres que no sean FIN, etc.)
    no se tendrá en cuenta pero se mostrará un mensaje de error y el programa seguirá
    su curso. Cuando terminamos (al introducir la palabra FIN, recuerda) mostraremos
    por pantalla el numero de entradas válidas que hemos hecho (sin contar esta última
    que sólo sirve para finalizar el programa)
    """
    contador_validos = 0
    while True:
        entrada = input("Introduce un número entre 1 y 100 (o 'FIN' para terminar): ")
        if entrada == "FIN":
            break
        try:
            numero = int(entrada)
            if 1 <= numero <= 100:
                contador_validos += 1
            else:
                print("Error: El número debe estar entre 1 y 100.")
        except ValueError:
            print("Error: Entrada inválida.")
    print(f"Número de entradas válidas: {contador_validos}")

def ej10():
    """
    10. Modificar el programa anterior para que nos muestre al final la media aritmética de
    las entradas válidas
    """
    contador_validos = 0
    suma_validos = 0
    while True:
        entrada = input("Introduce un número entre 1 y 100 (o 'FIN' para terminar): ")
        if entrada == "FIN":
            break
        try:
            numero = int(entrada)
            if 1 <= numero <= 100:
                contador_validos += 1
                suma_validos += numero
            else:
                print("Error: El número debe estar entre 1 y 100.")
        except ValueError:
            print("Error: Entrada inválida.")
    if contador_validos > 0:
        media = suma_validos / contador_validos
        print(f"Número de entradas válidas: {contador_validos}")
        print(f"Media aritmética de las entradas válidas: {media:.2f}")
    else:
        print("No se introdujeron entradas válidas.")

def ej11():
    """
    11. Modificar el programa anterior para que, además, nos diga al final cual han sido el
    número mayor y el menor que has introducido
    """
    contador_validos = 0
    suma_validos = 0
    mayor = None
    menor = None
    while True:
        entrada = input("Introduce un número entre 1 y 100 (o 'FIN' para terminar): ")
        if entrada == "FIN":
            break
        try:
            numero = int(entrada)
            if 1 <= numero <= 100:
                contador_validos += 1
                suma_validos += numero
                if mayor is None or numero > mayor:
                    mayor = numero
                if menor is None or numero < menor:
                    menor = numero
            else:
                print("Error: El número debe estar entre 1 y 100.")
        except ValueError:
            print("Error: Entrada inválida.")
    if contador_validos > 0:
        media = suma_validos / contador_validos
        print(f"Número de entradas válidas: {contador_validos}")
        print(f"Media aritmética de las entradas válidas: {media:.2f}")
        print(f"Número mayor: {mayor}")
        print(f"Número menor: {menor}")
    else:
        print("No se introdujeron entradas válidas.")

def ej12():
    """
    12. Realiza un juego en el que debes de acertar un número entre el 1 y el 50 que el
    ordenador ha elegido de forma aleatoria. El programa te indicará si has acertado, si te
    has pasado o si te has quedado corto. El programa finaliza cuando se acierta o cuando
    se superan el número máximo de intentos establecidos en 5.
    """
    import random
    numero_secreto = random.randint(1, 50)
    intentos = 0
    max_intentos = 5

    while intentos < max_intentos:
        intento = int(input("Adivina el número entre 1 y 50: "))
        intentos += 1
        if intento < numero_secreto:
            print("Te has quedado corto.")
        elif intento > numero_secreto:
            print("Te has pasado.")
        else:
            print(f"¡Has acertado! El número era {numero_secreto}.")
            break
    else:
        print(f"Has agotado tus intentos. El número era {numero_secreto}.")

def ej13():
    """
    13. Modifica el programa anterior para que el programa te de todos los intentos que
    necesites pero que cuando aciertes te informe de cuantas veces has fallado antes de
    lograrlo
    """
    numero_secreto = random.randint(1, 50)
    intentos = 0

    while True:
        intento = int(input("Adivina el número entre 1 y 50: "))
        intentos += 1
        if intento < numero_secreto:
            print("Te has quedado corto.")
        elif intento > numero_secreto:
            print("Te has pasado.")
        else:
            print(f"¡Has acertado! El número era {numero_secreto}. Has fallado {intentos - 1} veces antes de acertar.")
            break

def ej14():
    """
    14. Modifica el programa anterior para que al final del programa te pida si quieres volver
    a jugar y en caso afirmativo comience una nueva partida
    """
    while True:
        numero_secreto = random.randint(1, 50)
        intentos = 0

        while True:
            intento = int(input("Adivina el número entre 1 y 50: "))
            intentos += 1
            if intento < numero_secreto:
                print("Te has quedado corto.")
            elif intento > numero_secreto:
                print("Te has pasado.")
            else:
                print(f"¡Has acertado! El número era {numero_secreto}. Has fallado {intentos - 1} veces antes de acertar.")
                break

        jugar_otra_vez = input("¿Quieres jugar otra vez? (s/n): ")
        if jugar_otra_vez.lower() != 's':
            break

def ej15():
    """
    15. Modifica el programa anterior para que al iniciar el juego te pida dos parámetros con
    objeto de cambiar la dificultad del juego: el número máximo (antes era siempre 50) o
    el número de intentos posibles (antes era siempre 5).
    """
    while True:
        numero_maximo = int(input("Introduce el número máximo para el juego: "))
        max_intentos = int(input("Introduce el número máximo de intentos: "))
        numero_secreto = random.randint(1, numero_maximo)
        intentos = 0

        while intentos < max_intentos:
            intento = int(input(f"Adivina el número entre 1 y {numero_maximo}: "))
            intentos += 1
            if intento < numero_secreto:
                print("Te has quedado corto.")
            elif intento > numero_secreto:
                print("Te has pasado.")
            else:
                print(f"¡Has acertado! El número era {numero_secreto}. Has fallado {intentos - 1} veces antes de acertar.")
                break
        else:
            print(f"Has agotado tus intentos. El número era {numero_secreto}.")

        jugar_otra_vez = input("¿Quieres jugar otra vez? (s/n): ")
        if jugar_otra_vez.lower() != 's':
            break

def ej16():
    """
    16. Escribe un programa que pida por teclado el radio de una circunferencia, admitiendo
    valores con decimales y calcule la longitud y el área de la circunferencia (redondeando
    a cinco decimales). Si no las recuerdas, las fórmulas son las siguientes:
    area = 3.14159 * radio2
    longitud = 2 * 3.14159 * radio
    """
    radio = float(input("Introduce el radio de la circunferencia: "))
    area = 3.14159 * (radio ** 2)
    longitud = 2 * 3.14159 * radio
    print(f"Área: {round(area, 5):.5f}")
    print(f"Longitud: {round(longitud,5):.5f}")

def ej17():
    """
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
    """
    temeperatura = input("Introduce la temperatura con su unidad (C, F, K): ")
    valor = float(temeperatura[:-1])
    unidad = temeperatura[-1].upper()
    if unidad == 'C':
        f = valor * 1.8 + 32
        k = valor + 273.15
        print(f"{valor:.2f}C son {f:.2f}F y {k:.2f}K")
    elif unidad == 'F':
        c = (valor - 32) / 1.8
        k = (5/9) * (valor - 32) + 273.15
        print(f"{valor:.2f}F son {c:.2f}C y {k:.2f}K")
    elif unidad == 'K':
        c = valor - 273.15
        f = 1.8 * (valor - 273.15) + 32
        print(f"{valor:.2f}K son {c:.2f}C y {f:.2f}F")
    else:
        print("Unidad no reconocida. Usa C, F o K.")

def ej18():
    """
    18. La tabla de tarifas impositivas en España para 2022 es la siguiente:
    Escribe un programa que le pida al usuario su sueldo anual (lógicamente puede ser
    un número con decimales) y le informe que porcentaje de retención le corresponde, el
    importe de la misma y el importe neto restante que cobrará.
    """
    sueldo_anual = float(input("Introduce tu sueldo anual: "))
    if sueldo_anual <= 12450:
        porcentaje = 19
    elif sueldo_anual <= 20200:
        porcentaje = 24
    elif sueldo_anual <= 35200:
        porcentaje = 30
    elif sueldo_anual <= 60000:
        porcentaje = 37
    else:
        porcentaje = 45

    retencion = sueldo_anual * (porcentaje / 100)
    sueldo_neto = sueldo_anual - retencion

    print(f"Porcentaje de retención: {porcentaje}%")
    print(f"Importe de la retención: {retencion:.2f}")
    print(f"Sueldo neto restante: {sueldo_neto:.2f}")

if __name__ == "__main__":
    ej2()
    pass