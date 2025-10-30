package claseU3;

import java.util.Scanner;

public class Figura4 {
	public static void main(String[] args) {
		int i,j,filas, columnas;
		Scanner entrada = new Scanner(System.in);
		System.out.println("Numero de asteriscos a imprimir");
		filas= entrada.nextInt();
		columnas = filas;
		entrada.close();
		if (filas>0) {
			for (i=1;i<=filas;i++) {
				 for(j=1; j<=columnas;j++) {
				if (i==1 || i==filas) {
					System.out.print("*");
				}else if (j==1 || j==columnas) {
					System.out.print("*");
				} else {
					System.out.print(" ");
				}

			}
			System.out.println();
			}
		}

		}
}
