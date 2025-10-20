package claseU3;

import java.util.Scanner;

public class H1E01 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner entrada=new Scanner(System.in);
		System.out.println("Introduce un numero del 1 al 5");
		int num = entrada.nextInt();
		if (num<6 && num >1) {
			if (num==4) {
				System.out.println("No es primo");
			} else {
				System.out.println("Es primo");
			}
		} else {
			System.out.println("el numero no es vailido");
		}
	}

}
