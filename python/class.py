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
dado2 = random.randint(1,49)
print(dado,dado2)

tirada = random.randint(1,6)
if tirada<3:
    print("fallado")
elif tirada <5:
    print("herido")
else:
    print("matado")

count=0
keep_on = True
while keep_on:
    count += 1
    if random.randint(1,6) == 6:
        print(count)
        keep_on=False
"""
a = str(("23, 15, 18, 12, 4"))
a=a.split(", ")
print(type(a),a)
"""
for i in [""]:
    for j in [1,2,2]:
        print(j)