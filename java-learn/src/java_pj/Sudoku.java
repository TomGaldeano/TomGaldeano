package java_pj;

import java.util.Scanner;

public class Sudoku {
	static final int TAM = 9;
	static Scanner in = new Scanner(System.in);
	static int[][] sudoku = new int[TAM][TAM];
	public static void limpiaVerificador(int[] verificador) {
		for (int i = 0;i<TAM;i++) {
			verificador[i]=0;
		}
		
	}
	
	public static boolean sudoku_valido(int[][] puzzle) {
		// comprueba si es un sudoku valido
		int[] temp = {0, 0, 0, 0, 0, 0, 0, 0, 0},temp2 = {0, 0, 0, 0, 0, 0, 0, 0, 0},temp3 = {0, 0, 0, 0, 0, 0, 0, 0, 0};
		for (int i = 0;i<TAM;i++) {
			for (int j = 0;j<TAM;j++) { // genera array con numero de repeticiones de un numero en una fila
				temp[puzzle[i][j]-1]++;
			}
			for (int j = 0;j<TAM;j++) { // verifica si se repite elemento en la fila
				if(temp[j]>1) {
					return false;
				}
			}
			limpiaVerificador(temp);
			for (int j = 0;j<TAM;j++) { // genera array con numero de repeticiones de un numero en una columna
				temp[puzzle[j][i]-1]++;
			}
			for (int j = 0;j<TAM;j++) { // verifica si se repite elemento en la columna
				if(temp[j]>1) {
					return false;
				}
			}
			limpiaVerificador(temp);		
		}
		
		for (int i = 0;i<TAM;i++) {
			for(int k =0;k<3;k++){
				temp[puzzle[i][k]]++;
				temp2[puzzle[i][k+3]]++;
				System.out.print(k+6);
				System.out.print(puzzle[i][6]);
				temp3[puzzle[i][k+6]]++;
				if ((1+i)%3==0) {
					for (int j = 0;j<TAM;j++) {
						if(temp[j]>1) {
							return false;
						}
						if (temp2[j]>1) {
							return false;
						}
						if (temp3[j]>1) {
							return false;
						}
					}
					limpiaVerificador(temp);
					limpiaVerificador(temp2);
					limpiaVerificador(temp3);
				}	
			}
			
		}

		return true;
	}
	public static boolean sudoku_acabado (int[][] puzzle) {
		// comprueba si un sudouku esta acabado
		for(int i = 0;i<TAM;i++) {
			for(int j = 0;j<sudoku[i].length;j++) {
				if (sudoku[i][j]==0) {
					return false;
				}
			}
		}
		return true;
	}
	public static void nuevo_sudoku() {	
		// crea un nuevo sudoku
		for(int i = 0;i<TAM;i++) {
			for(int j = 0;j<sudoku[i].length;j++) {
				if (sudoku[i][j]==0) {
					
				}
			}
		}
	}
	public static void mostrar_sudoku() {
		// muestra el sudoku
		System.out.println(" -------------------------");
		for(int i = 0;i<TAM;i++) {
			System.out.print(" | ");
			for(int j = 0;j<sudoku[i].length;j++) {
				System.out.print(sudoku[i][j]+" ");
				if ((j+1)%3==0) {
					System.out.print("| ");
				}
			}
			System.out.println();
			if ((i+1)%3==0) {
				System.out.println(" -------------------------");
			}
		}	
		
	}
	public static void rellenar_sudoku() {
		// da la opcion al usuario de completar el sudoku
		
	}
	
	public static void main(String[] args) {
		int[][] solvedSudoku = {
			    {5, 3, 4, 6, 7, 8, 9, 1, 2},
			    {6, 7, 2, 1, 9, 5, 3, 4, 8},
			    {1, 9, 8, 3, 4, 2, 5, 6, 7},
			    {8, 5, 9, 7, 6, 1, 4, 2, 3},
			    {4, 2, 6, 8, 5, 3, 7, 9, 1},
			    {7, 1, 3, 9, 2, 4, 8, 5, 6},
			    {9, 6, 1, 5, 3, 7, 2, 8, 4},
			    {2, 8, 7, 4, 1, 9, 6, 3, 5},
			    {3, 4, 5, 2, 8, 6, 1, 7, 9}
			};
		int[][] solvedSudoku2 = {
			    {3, 3, 4, 6, 7, 8, 9, 1, 2},
			    {6, 7, 2, 1, 9, 5, 3, 4, 8},
			    {1, 9, 8, 3, 4, 2, 5, 6, 7},
			    {8, 5, 9, 7, 6, 1, 4, 2, 3},
			    {4, 2, 6, 8, 5, 3, 7, 9, 1},
			    {7, 1, 3, 9, 2, 4, 8, 5, 6},
			    {9, 6, 1, 5, 3, 7, 2, 8, 4},
			    {2, 8, 7, 4, 1, 9, 6, 3, 5},
			    {3, 4, 5, 2, 8, 6, 1, 7, 9}
			};
		nuevo_sudoku();
		mostrar_sudoku();		
		if (sudoku_valido(solvedSudoku)) {
			System.out.println("valido");
		}else {
			System.out.println("no valido");
		}		
		if (sudoku_valido(solvedSudoku2)) {
			System.out.println("valido");
		}else {
			System.out.println("no valido");
		}
				

	}

}
