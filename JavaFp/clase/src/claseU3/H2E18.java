package claseU3;

import java.util.Scanner;

public class H2E18 {

	public static void main(String[] args) {
		final int MAX_NUM = 10;
		int cont=0, j = 0;
		while(cont<=MAX_NUM) {	
			while(j<=MAX_NUM) {
			System.out.print(cont*j+" ");
			j ++;
		}
			j=0;
			cont ++;
			System.out.println();
		}	

	}

}