texto1="Examen 1TO1"
texto2="Octubre-2025"
resultado = texto1[6:]+texto2[7:]+texto1[:6]+" "+texto2[:7]
resultado_final = f"{resultado} ({len(resultado)})"
print(resultado_final)