package claseU3;

import java.util.Scanner;

public class Figura3 {
	public static void main(String[] args) {
		int i, j, filas, espacios, asteristicos = 1;
		Scanner entrada = new Scanner(System.in);
		System.out.println("Numero de asteriscos a imprimir");
		filas = entrada.nextInt();
		espacios = filas;
		entrada.close();
		if (filas > 0) {
			for (i = 1; i <= filas; i++) {
				espacios--;
				if (filas > 0) {
					for (j = 1; j <= espacios; j++) {
						System.out.print(" ");
					}
				}
				for (j = 1; j <= asteristicos; j++) {
					if (!(i==1 || i==filas)) {
						if (j==1 || j==asteristicos) {
							System.out.print("*");
						}else {
							System.out.print(" ");
						}
						
					}else{
						System.out.print("*");
					}
					
				}
				asteristicos +=2;
				System.out.println();
			}
		}

	}
}
