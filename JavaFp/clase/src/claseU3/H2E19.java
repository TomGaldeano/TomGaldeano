package claseU3;

import java.util.Scanner;

public class H2E19 {

	public static void main(String[] args) {
		final int MAX_NUM = 10;
		int cont=0;
		Scanner entrada = new Scanner(System.in);
		System.out.println("Introduce numer para sacar la tabla de multiplicar");
		int num = entrada.nextInt();
		while(cont<=MAX_NUM) {			
			System.out.print(cont*num+" ");
			cont ++;
		}
		entrada.close();

	}

}
