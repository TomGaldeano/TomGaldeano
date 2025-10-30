package claseU3;

import java.util.Scanner;

public class H2E11 {

	public static void main(String[] args) {
		int num1 = 0, num2 = 0, cont = 2;
		Scanner entrada = new Scanner(System.in);
		do {
			System.out.println("Introduce el primer numero: ");
			num1 = entrada.nextInt(); 	
			System.out.println("Introduce el segundo numero: ");
			num2 = entrada.nextInt(); 
		} while (num1>num2 || num1<1);
		if (num1%2==0) {
			cont = num1;
		} else {
			cont = num1+1;
		}
		while (cont<=num2) {
			System.out.println(cont);
			cont += 2;
		}
			
		entrada.close();
	}

}
