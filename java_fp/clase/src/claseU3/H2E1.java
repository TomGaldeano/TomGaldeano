package claseU3;

import java.util.Scanner;

public class H2E1 extends clase1 {
	public static void main(String[] args) {
		int i, num;
		System.out.println("introduce un numero por teclado");
		Scanner entrada = new Scanner(System.in);
		num = entrada.nextInt();
		entrada.close();
		if (num>0) {
					if (num== 1 || num == 2 || num== 3) {
			System.out.println("es primo");
		} else {
			for (i=2;i <= (int) Math.sqrt(num)+1;i++){
				if (num%i == 0) {
					System.out.println("No es primo");
					break;
				}
			}
			System.out.println("Es primo");
		}
		
	}
		else {
			System.out.println("No es un numero valido");
		}
	}
}
