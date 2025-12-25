package java_pj;

import java.util.Arrays;
import java.util.Scanner;

public class Sudoku {
	static final int TAM = 9;
	private static Scanner in = new Scanner(System.in);
	private static int[][] sudoku = new int[TAM][TAM];

	private static void limpiaVerificador(int[] verificador) {
		for (int i = 0; i < TAM; i++) {
			verificador[i] = 0;
		}

	}

	private static boolean sudoku_valido(int[][] puzzle) {
		// comprueba si es un sudoku valido
		int[] temp = { 0, 0, 0, 0, 0, 0, 0, 0, 0 }, temp2 = { 0, 0, 0, 0, 0, 0, 0, 0, 0 },
				temp3 = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };
		for (int i = 0; i < TAM; i++) {
			for (int j = 0; j < TAM; j++) { // genera array con numero de repeticiones de un numero en una fila
				if (puzzle[i][j] != 0) {
					temp[puzzle[i][j] - 1]++;
				}
			}
			for (int j = 0; j < TAM; j++) { // verifica si se repite elemento en la fila
				if (temp[j] > 1) {
					return false;
				}
			}
			limpiaVerificador(temp);
			for (int j = 0; j < TAM; j++) { // genera array con numero de repeticiones de un numero en una columna
				if (puzzle[j][i] != 0) {
					temp[puzzle[j][i] - 1]++;
				}
			}
			for (int j = 0; j < TAM; j++) { // verifica si se repite elemento en la columna
				if (temp[j] > 1) {
					return false;
				}
			}
			limpiaVerificador(temp);
		}

		for (int i = 0; i < TAM; i++) {
			for (int k = 0; k < 3; k++) {
				if (puzzle[i][k] != 0) {
					temp[puzzle[i][k] - 1]++;
				}
				if (puzzle[i][k + 3] != 0) {
					temp2[puzzle[i][k + 3] - 1]++;
				}
				if (puzzle[i][k + 6] != 0) {
					temp3[puzzle[i][k + 6] - 1]++;
				}
				if ((1 + i) % 3 == 0) {
					for (int j = 0; j < TAM; j++) {
						if (temp[j] > 1) {
							return false;
						}
						if (temp2[j] > 1) {
							return false;
						}
						if (temp3[j] > 1) {
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

	private static boolean sudoku_acabado(int[][] puzzle) {
		// comprueba si un sudouku esta acabado
		for (int i = 0; i < TAM; i++) {
			for (int j = 0; j < puzzle[i].length; j++) {
				if (puzzle[i][j] == 0) {
					return false;
				}
			}
		}
		return true;
	}

	private static void nuevo_sudoku() {
		// crea un nuevo sudoku
		for (int i = 0; i < TAM; i++) {
			for (int j = 0; j < sudoku[i].length; j++) {
				if (sudoku[i][j] == 0) {

				}
			}
		}
	}

	public static void mostrar_sudoku() {
		// muestra el sudoku
		System.out.println(" -------------------------");
		for (int i = 0; i < TAM; i++) {
			System.out.print(" | ");
			for (int j = 0; j < sudoku[i].length; j++) {
				System.out.print(sudoku[i][j] + " ");
				if ((j + 1) % 3 == 0) {
					System.out.print("| ");
				}
			}
			System.out.println();
			if ((i + 1) % 3 == 0) {
				System.out.println(" -------------------------");
			}
		}

	}

	public static int[][] solucionar_sudoku(int[][] puzzle) {
		// da la opcion al usuario de completar el sudoku
		if (sudoku_acabado(puzzle) && sudoku_valido(puzzle)) {
			return puzzle;
		}
		for (int i = 0; i < TAM; i++) {
			for (int j = 0; j < TAM; j++) {
				if (puzzle[i][j] == 0) {
					for (int k = 1; k <= TAM; k++) {
						puzzle[i][j] = k;
						if (sudoku_valido(puzzle)) {
							int[][] res = solucionar_sudoku(puzzle);
							if (res != null) return res;
						}
						puzzle[i][j] = 0; // undo
					}
					return null;
				}
			}
		}
		return null;
	}

	public static void main(String[] args) {
		int[][] solvedSudoku = {
				{ 5, 3, 4, 6, 7, 8, 9, 1, 2 },
				{ 6, 7, 2, 1, 9, 5, 3, 4, 8 },
				{ 1, 9, 8, 3, 4, 2, 5, 6, 7 },
				{ 8, 5, 9, 7, 6, 1, 4, 2, 3 },
				{ 4, 2, 6, 8, 5, 3, 7, 9, 1 },
				{ 7, 1, 3, 9, 2, 4, 8, 5, 6 },
				{ 9, 6, 1, 5, 3, 7, 2, 8, 4 },
				{ 2, 8, 7, 4, 1, 9, 6, 3, 5 },
				{ 3, 4, 5, 2, 8, 6, 1, 7, 9 }
		};
		int[][] unsolvedSudoku = {
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0 },
				{ 0, 0, 0, 1, 9, 5, 3, 4, 8 },
				{ 1, 9, 8, 3, 4, 2, 5, 6, 7 },
				{ 8, 5, 9, 7, 6, 1, 4, 2, 3 },
				{ 4, 2, 6, 8, 5, 3, 7, 9, 1 },
				{ 7, 1, 3, 9, 2, 4, 8, 5, 6 },
				{ 9, 6, 1, 5, 3, 7, 2, 8, 4 },
				{ 2, 8, 7, 4, 1, 9, 6, 3, 5 },
				{ 3, 4, 5, 2, 8, 6, 1, 7, 9 }
		};
		nuevo_sudoku();
		mostrar_sudoku();
		unsolvedSudoku = solucionar_sudoku(unsolvedSudoku);
		sudoku = unsolvedSudoku;
		mostrar_sudoku();
		if (sudoku_valido(solvedSudoku)) {
			System.out.println("valido");
		} else {
			System.out.println("no valido");
		}
		if (sudoku_valido(unsolvedSudoku)) {
			System.out.println("valido");
		} else {
			System.out.println("no valido");
		}
		if (Arrays.deepEquals(unsolvedSudoku,solvedSudoku)) {
			System.out.println("Funciona ole ole ole");
		} else {
			System.out.println("algo falla amigo");
		}
	}

}
