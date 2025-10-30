cantidad = input("Introduce la cantidad: ")
valor = float(cantidad[:-1].replace(",","."))
divisa = cantidad[-1]
euro_peso = 27.93
euro_rupia = 102.81
euro_franco = 0.93
if divisa == 'E':
    print(f"{round(float(cantidad[:-1]),2)} euros equivalen a {round(valor*euro_peso,4)} pesos cubanos, {round(valor*euro_rupia,4)} rupias o {round(valor*euro_franco,4)} francos suizos")
elif divisa == 'R':
    print(f"{cantidad[:-1]} rupias equivalen a {round(valor/euro_rupia,4)} euros")
elif divisa == 'F':
    print(f"{cantidad[:-1]} francos suizos equivalen a {round(valor/euro_franco,4)} euros")
else:
    print(f"{cantidad[:-1]} pesos cubanos equivalen a {round(valor/euro_peso,4)} euros")