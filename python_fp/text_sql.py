import os
FOLDER = "/home/alumno/TomGaldeano/bases_de_datos_fp/05 - Subconsultas"

filename= "guia_sub_consultas"
file = os.path.join(FOLDER, filename+".pdf")
f = open(file,"r")
a = f.readlines()
f.close()
file = os.path.join(FOLDER, filename+".sql")
with open(file, "w") as f:
    for i in a:
        f.write("-- "+i)