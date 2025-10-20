package claseU3;

import java.util.Scanner;

public class H1E25 {

	public static void main(String[] args) {
		Scanner entrada = new Scanner(System.in);
		System.out.println("Introduce el sueldo");
		float sueldo = entrada.nextFloat();
		System.out.println("Introduce la antiguedad");
		int antiguedad = entrada.nextInt();
		if (antiguedad > 10) {
			System.out.println(sueldo*1.1);
			
		} else if(antiguedad > 5){
			System.out.println(sueldo*1.07);

		} else if (antiguedad > 3) {
			System.out.println(sueldo*1.05);
			
		}else {
			System.out.println(sueldo*1.03);			
		}
	}
}
