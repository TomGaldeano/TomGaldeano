package claseU3;

import java.util.Scanner;

public class H1E21 {

	public static void main(String[] args) {
		Scanner entrada = new Scanner(System.in);
		System.out.println("Las opciones son Equilátero(1), Isósceles(2) y\n Escaleno(3)");
		int opcion = entrada.nextInt();
		if (opcion==1) {
			System.out.println("Introduce 1 lado");
			int lado1 = entrada.nextInt();
			System.out.println("Permimetro: "+lado1*3);
		} else if(opcion==2){
			System.out.println("Introduce 1 de los lados iguales");
			int lado1 = entrada.nextInt();
			System.out.println("Introduce el lado diferente");
			int lado2 = entrada.nextInt();
			System.out.println("Permimetro: "+(lado1*2+lado2));
		}else if (opcion==3) {
			System.out.println("Introduce 1 lado");
			int lado1 = entrada.nextInt();
			System.out.println("Introduce otro lado diferente");
			int lado2 = entrada.nextInt();
			System.out.println("Introduce el ultimo lado");
			int lado3 = entrada.nextInt();
			System.out.println("Permimetro: "+(lado1+lado2+lado3));
		}
		
	}

}