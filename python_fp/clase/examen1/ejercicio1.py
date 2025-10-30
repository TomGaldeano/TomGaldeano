import random
print("Generando claves en el formato solicitado")
for i in range(4):
    linea = ""
    for j in range(5):
        for k in range(5):
            linea+=str(random.randint(0,9))
        if j!=4:
            linea+="-"
    print(linea)
            