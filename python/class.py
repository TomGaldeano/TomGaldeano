import random

print("Hello world") #comment
"""
esto es un bloque de texto
"""
'''
comment block
'''
def class_stuff():
    edad = 50
    sueldo = 2200,55
    apellidos = "Morales Vazquez"
    contratado = True
    precio = 75.5
    pvp = precio*1.21
    print("el pvp es",pvp, end="", sep="---")
    print(5//2)
    print(5%2)
    x= 0
    x += 1

#class_stuff()
"""
nombre = input("cual es tu nombre?: ")
print("Tu nombre es", nombre)
edad = int(input("cuantos años tienes?:"))
print(f"Tu nombre es {nombre} y tienes {edad} años")
edad += 1
"""

dado = random.randint(a=1,b=6)
dado2 = random.randint(1,6)
print(dado,dado2)
cont=1
while dado != dado2:
    ado = random.randint(a=1,b=6)
    dado2 = random.randint(1,6)
    print(dado,dado2)
    cont += 1
if cont == 1: print("solo una tirada")
print(cont)

"""
a = str(("23, 15, 18, 12, 4"))
a=a.split(", ")
print(type(a),a)
"""

def fibonnaci(n=25):
    a = 0
    b = 1
    i = 2
    print(f"1-{a}")
    print(f"2-{b}")
    while (i<n):
        i += 1
        c = a + b
        a = b
        b = c
        print(f"{i}-{b}")
