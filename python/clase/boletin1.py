import random

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

def ej5():
    """
    5. Escribir un programa que pida por teclado un número al usuario y diga si es par o impar
    """
    value = int(input("dame un numero"))
    if value%2 == 0:
        print("es par")
    else: 
        print("es impar")

def ej6():
    """"
    6. Escribir un programa que pida por teclado un número al usuario y diga si es divisible por 3 o
no.
    """
    value = int(input("dame un numero"))
    if value%3 == 0:
        print("es divisible por 3")
    else: 
        print("no es divisible por 3")

def ej7():
    """"
    7. Escribir un programa que pida un número por teclado al usuario que simule ser el precio de
    un artículo y escriba el resultado de aplicarle el IVA del 21%
    """
    price = float(input("dame el precio del articulo"))
    iva = price * 0.21
    total = price + iva
    print(f"el precio con IVA es {round(total,2)} euros")

def ej8():
    """""
    8. Escribir un programa que reciba por teclado el importe de una cantidad a pagar en euros
    (puede tener decimales) y el número de meses que contamos para pagarla (tiene que ser un
    número entero) y nos devuelva el dinero que tendríamos que pagar cada mes. No aplicamos
      intereses de ningún tipo y redondeamos a dos decimales.
    """
    amount = float(input("dame la cantidad a pagar"))
    months = int(input("dame el numero de meses para pagar"))
    monthly_payment = round(amount / months, 2)
    print(f"el pago mensual es de {monthly_payment} euros")

def ej9():
    """
    9. Escribir un programa que genere un número aleatorio entre el 0 y el 50 y lo muestre
    """
    number = random.randint(0,50)
    print(number)

def ej10():
    """
    10. Escribir un programa que genere dos números aleatorios simultáneamente entre el 1 y el 6
    (simulando una tirada de dos dados)
    """
    die1 = random.randint(1,6)
    die2 = random.randint(1,6)
    print(f"los dados han sacado {die1} y {die2}")

def ej11():
    """
    11. Modificar el programa anterior para que tu programa tire dos dados de forma continuada
    hasta que el número que salga en ambos sea el mismo. En ese momento debería de parar la
    ejecución e informarnos de cuantas tiradas ha tenido que hacer para llegar a ese resultado
    """
    count = 0
    while True:
        die1 = random.randint(1,6)
        die2 = random.randint(1,6)
        count += 1
        if die1 == die2:
            break
    print(f"han sido necesarias {count} tiradas para obtener un doble {die1}")

def ej12():
    """
    12. Escribir un programa que sirva como asistente para un juego de rol. Tu programa debería de
    pedir por teclado el número de dados que se van a tirar y el número de caras de estos (4, 6,
    8, 12, etc.) A continuación debería de hacer la tirada y mostrarla.
    """
    num_dice = int(input("dame el numero de dados a tirar"))
    num_faces = int(input("dame el numero de caras de los dados"))
    rolls = []
    for _ in range(num_dice):
        roll = random.randint(1, num_faces)
        rolls.append(roll)
    print(f"has sacado los siguientes numeros: {rolls}")

def ej13():
    """
    13. Modifica el programa anterior para que no admita dados con un número de caras impares
    (¡no existen!). En el caso de meter un número impar de caras el programa debería de
    informarnos de que es erróneo y volver a preguntarnos por este dato.
    """
    num_dice = int(input("dame el numero de dados a tirar"))
    num_faces = int(input("dame el numero de caras de los dados"))
    rolls = []
    if num_faces % 2 != 0:
        print("numero de caras invalido, debe ser par")
        for _ in range(num_dice):
            roll = random.randint(1, num_faces)
            rolls.append(roll)
    print(f"has sacado los siguientes numeros: {rolls}")

def ej14():
    """
    14. Escribir un programa que nos pida dos números por teclado y genere un número aleatorio
    comprendido entre ambos. Por el momento no te preocupes de que el primer número
    siempre debería de ser menor que el segundo, simplemente no los metas en un orden
    incorrecto.
    """
    num1 = int(input("dame el primer numero"))
    num2 = int(input("dame el segundo numero"))
    rand_num = random.randint(num1, num2)
    print(f"el numero aleatorio generado es {rand_num}")

def ej15():
    """
    15. Modificar el programa del punto anterior para que si el primer número que metemos es
    mayor que el segundo funcione correctamente. Es decir, si metemos en primer lugar el 50 y
    en segundo el 10 nos debería de generar un número aleatorio entre el 10 y el 50 (y no entre el
    50 y el 10 que no tiene mucha lógica…)
    """
    num1 = int(input("dame el primer numero"))
    num2 = int(input("dame el segundo numero"))
    lower = min(num1, num2)
    upper = max(num1, num2)
    rand_num = random.randint(lower, upper)
    print(f"el numero aleatorio generado es {rand_num}")

def ej16():
    """
    16. Escribir un programa que genere seis números aleatorios entre el 1 y el 49 (simulando una
    lotería primitiva). Por el momento no te preocupes de que algunos números puedan salir
    repetidos. Ya resolveremos eso más adelante.
    """
    lottery_numbers = []
    for _ in range(6):
        number = random.randint(1, 49)
        lottery_numbers.append(number)
    print(f"los numeros de la loteria son: {lottery_numbers}")

def ej17():
    """
    17. Escribir un programa que nos permita generar una quiniela. Para ello nos debe generar
    quince números aleatorios entre el 1 y el 3. Recuerda que los resultados válidos son 1 X o 2,
    así que si te sale un 3 lo que tienes que imprimir en pantalla es una X
    """
    quiniela = []
    for _ in range(15):
        result = random.randint(1, 3)
        if result == 3:
            quiniela.append('X')
        else:
            quiniela.append(str(result))
    print(f"los resultados de la quiniela son: {quiniela}")

def ej18():
    """
    18. Escribe un programa que genere números aleatorios entre el 1 y el 1000 sin parar y que sólo
    se detenga cuando salga el 666. Los números que ha tenido que generar tu programa hasta
    aparecer el 666 son los que restan para el apocalipsis. Tu programa debería de indicarlo con
    un mensaje tétrico (¡Faltan 236 días para que se acabe todo! por ejemplo)
    """
    count = 0
    while True:
        number = random.randint(1, 1000)
        count += 1
        if number == 666:
            break
    print(f"¡Faltan {count} días para que se acabe todo!")

def ej19():
    """
    19. Escribir un programa que pida un número por teclado y nos muestre sus divisores
    """
    number = int(input("dame un numero"))
    divisors = []
    for i in range(1, number + 1):
        if number % i == 0:
            divisors.append(i)
    print(f"los divisores de {number} son: {divisors}")

def ej20():
    """
    20. Escribir un programa que nos pida tres números por teclado en cualquier orden y nos los
    muestre en pantalla ordenados de menor a mayor
    """
    nums = []
    for _ in range(3):
        num = float(input("dame un numero"))
        nums.append(num)
    nums.sort()
    print(f"los numeros ordenados de menor a mayor son: {nums}")

def ej21():
    """
    21. Escribir un programa que pida por teclado un número al usuario y calcule si es primo o no
    """
    number = int(input("dame un numero"))
    if number < 2:
        print(f"{number} no es primo")
        return
    for i in range(2, int(number**0.5) + 1):
        if number % i == 0:
            print(f"{number} no es primo")
            return
    print(f"{number} es primo")

def ej22():
    """
    22. Escribir un programa que genere un número primo aleatorio entre el 10.000.000 y el
    50.000.000
    """
    while True:
        number = random.randint(10000000, 50000000)
        is_prime = True
        for i in range(2, int(number**0.5) + 1):
            if number % i == 0:
                is_prime = False
                break
        if is_prime:
            print(f"el numero primo aleatorio generado es: {number}")
            break

def ej23():
    """
    23. Escribir un programa que te escriba todos los números primos que hay entre el 1 y el 100
    """
    primes = []
    for num in range(2, 101):
        is_prime = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
    print(f"los numeros primos entre 1 y 100 son: {primes}")

def ej24():
    """
    24. Modifica el programa anterior para que sea el usuario quién introduzca dos números y se nos
    muestre los primos que hay entre ambos
    """
    lower = int(input("dame el numero inferior"))
    upper = int(input("dame el numero superior"))
    primes = []
    for num in range(lower, upper + 1):
        is_prime = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime and num >= 2:
            primes.append(num)
    print(f"los numeros primos entre {lower} y {upper} son: {primes}")

def ej25():
    """
    25. Escribir un programa que reciba por teclado un número y muestre sucesivamente el
    resultado de ir dividiéndolo por dos sucesivamente hasta llegar a un número igual o menor a
    1.
    """
    number = float(input("dame un numero"))
    print(f"Haz introducido el número {number}")
    while number >= 1:
        number /= 2
        print(f"{number:.2f}")

if __name__ == "__main__":
    pass