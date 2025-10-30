package claseU3;

import java.util.Scanner;

public class H1E21_switch {

	public static void main(String[] args) {
		Scanner entrada = new Scanner(System.in);
		double lado1, lado2, lado3;
		int opcion;
		do {
			System.out.println("Las opciones son Equilátero(1), Isósceles(2), Escaleno(3) y salir(4)");
			opcion = entrada.nextInt();
			switch (opcion) {
				case 1:
					System.out.println("Introduce 1 lado");
					lado1 = entrada.nextDouble();
					System.out.println("Permimetro: " + lado1 * 3);
					break;
				case 2:
					System.out.println("Introduce 1 de los lados iguales");
					lado1 = entrada.nextDouble();
					System.out.println("Introduce el lado diferente");
					lado2 = entrada.nextDouble();
					System.out.println("Permimetro: " + (lado1 * 2 + lado2));
					break;
				case 3:
					System.out.println("Introduce 1 lado");
					lado1 = entrada.nextDouble();
					System.out.println("Introduce otro lado diferente");
					lado2 = entrada.nextDouble();
					System.out.println("Introduce el ultimo lado");
					lado3 = entrada.nextDouble();
					System.out.println("Permimetro: " + (lado1 + lado2 + lado3));
					break;
				case 4:
					System.out.println("Has salido");
					break;
				default:
					System.out.println("Opcion incorrecta");
			}
		} while (opcion != 4);
		entrada.close();
	}

}