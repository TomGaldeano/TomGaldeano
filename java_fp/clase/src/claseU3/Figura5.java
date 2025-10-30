package claseU3;

import java.util.Scanner;

public class Figura5 {
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
					System.out.print("*");
				}
				asteristicos +=2;
				System.out.println();
			}
			asteristicos=asteristicos-2;
			for (i = filas-1; i >=1 ; i--) {
				espacios++;
				for (j = 1; j <= espacios; j++) {
					System.out.print(" ");
				}
				asteristicos -=2;
				for (j = 1; j <= asteristicos; j++) {
					System.out.print("*");
				}
				System.out.println();
			}
		}

	}
}
