package claseU3;


public class H0E2 {
	public static void main(String[] args) {
		/*
		 * Desarrolle un algoritmo que permita leer tres valores y almacenarlos en las variables
A, B y C respectivamente. El algoritmo debe imprimir cuál es el mayor y cuál es el
menor. Recuerde constatar que los tres valores introducidos por el teclado sean valores
distintos. Presente un mensaje de alerta en caso de que se detecte la introducción de
valores iguales.
		 */
		int A,B,C;
		A=1;
		B=3;
		C=5;
		if (A==B || B==C) {
			System.out.println("error");
			
		} else if(A<B && B<C){
			System.out.println(A);
			System.out.println(B);
			System.out.println(C);
		}else if (A<B && B>C) {
			System.out.println(A);
			System.out.println(C);
			System.out.println(B);
		}else if (A>B && B>C) {
			System.out.println(C);
			System.out.println(B);
			System.out.println(A);
		}else {
			System.out.println(C);
			System.out.println(A);
			System.out.println(B);
		}
	}
}
