package claseU3;

import java.util.Scanner;

public class MultiplicaLeer {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner entrada=new Scanner(System.in);
		System.out.println("Introduce un numero");
		int num=entrada.nextInt();
		int doble=num*2;
		System.out.println("El doble de "+num+" es "+doble);
	}

}
