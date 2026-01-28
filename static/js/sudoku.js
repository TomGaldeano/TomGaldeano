const TAM = 9;
const initial_vars = 31;
const new_sudoku = document.getElementById("nuevo");
const resolver = document.getElementById("resolver");
const comprobar = document.getElementById("comprobar");
let sudoku = Array(TAM).fill().map(() => Array(TAM).fill(0));

function limpiaVerificador(verificador) {
    for (let i = 0; i < TAM; i++) {
        verificador[i] = 0;
    }
}

function sudoku_valido(puzzle) {
    // comprueba si es un sudoku valido
    let temp = Array(9).fill(0);
    let temp2 = Array(9).fill(0);
    let temp3 = Array(9).fill(0);
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) { // genera array con numero de repeticiones de un numero en una fila
            if (puzzle[i][j] != 0) {
                temp[puzzle[i][j] - 1]++;
            }
        }
        for (let j = 0; j < TAM; j++) { // verifica si se repite elemento en la fila
            if (temp[j] > 1) {
                return false;
            }
        }
        limpiaVerificador(temp);
        for (let j = 0; j < TAM; j++) { // genera array con numero de repeticiones de un numero en una columna
            if (puzzle[j][i] != 0) {
                temp[puzzle[j][i] - 1]++;
            }
        }
        for (let j = 0; j < TAM; j++) { // verifica si se repite elemento en la columna
            if (temp[j] > 1) {
                return false;
            }
        }
        limpiaVerificador(temp);
    }

    for (let i = 0; i < TAM; i++) {
        for (let k = 0; k < 3; k++) {
            if (puzzle[i][k] != 0) {
                temp[puzzle[i][k] - 1]++;
            }
            if (puzzle[i][k + 3] != 0) {
                temp2[puzzle[i][k + 3] - 1]++;
            }
            if (puzzle[i][k + 6] != 0) {
                temp3[puzzle[i][k + 6] - 1]++;
            }
        }
        if ((1 + i) % 3 == 0) {
            for (let j = 0; j < TAM; j++) {
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

    return true;
}

function sudoku_acabado(puzzle) {
    // comprueba si un sudouku esta acabado
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            if (puzzle[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function nuevo_sudoku() {
		// limpia
		for (let i = 0; i < TAM; i++) {
			for (let j = 0; j < TAM; j++) {
				sudoku[i][j] = 0;
			}
		}
	}

function mostrar_sudoku() {
    // muestra el sudoku
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) {
            document.querySelector('.Sudoku-item[data-index="' + i + j + '"]').value = sudoku[i][j];
        }
    }
}

function solucionar_sudoku(puzzle) {
    if (sudoku_acabado(puzzle) && sudoku_valido(puzzle)) {
        // Return a deep copy to distinguish from original reference if needed, 
        // though JS pass-by-reference for arrays means we are modifying the object.
        return puzzle;
    }
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) {
            if (puzzle[i][j] === 0) {
                for (let k = 1; k <= TAM; k++) {
                    puzzle[i][j] = k;
                    if (sudoku_valido(puzzle)) {
                        let result = solucionar_sudoku(puzzle);
                        if (result !== null) return result;
                    }
                }
                puzzle[i][j] = 0; // undo
                return null;
            }
        }
    }
    return null;
}
function crea_sudoku() {
    nuevo_sudoku();
    for (let i = 0; i < initial_vars; i++) {
        keep_on = true;
        while (keep_on) {
            let a = Math.floor(Math.random() * 9);
            let b = Math.floor(Math.random() * 9);
            if (sudoku[a][b] == 0) {
                for (let j = 1; j < TAM + 1; j++) {
                    sudoku[a][b] = j;
                    if (sudoku_valido(sudoku)) {
                        keep_on = false;
                        break;

                    }
                    sudoku[a][b] = 0;
                }
            }
        }
    }
    console.log(1);
    mostrar_sudoku();
}
function genera_sudoku() {
    let solucionable = false;
    while (!solucionable) {
        crea_sudoku();
        let sudoku2 = solucionar_sudoku(sudoku);
        if (sudoku2 !== null) {
            solucionable = true;
            sudoku = sudoku2;
        }
    }    
}

function comprobar_sudoku() {
    for(let i = 0;i<TAM;i++){
        for(let j = 0;j<TAM;j++){
            if(document.querySelector('.Sudoku-item[data-index="' + i + j + '"]').value == sudoku[i][j]){
                document.querySelector('.Sudoku-td[data-index="' + i + j + '"]').classList.add("acierto");
                setTimeout(() => document.querySelector('.Sudoku-td[data-index="' + i + j + '"]').classList.remove("acierto"), 2000);
            }else{
                document.querySelector('.Sudoku-td[data-index="' + i + j + '"]').classList.add("error");
                setTimeout(() => document.querySelector('.Sudoku-td[data-index="' + i + j + '"]').classList.remove("error"), 2000);
            }
            
        }
    }
}
genera_sudoku();
new_sudoku.addEventListener("click", () => genera_sudoku());
comprobar.addEventListener("click", () => comprobar_sudoku());
resolver.addEventListener("click", () => mostrar_sudoku());