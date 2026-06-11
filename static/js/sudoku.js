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
    // comprueba si un sudoku esta acabado (sobre tablero de numeros)
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) {
            if (puzzle[i][j] === 0) {
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
            const cell = document.querySelector('.Sudoku-item[data-index="' + i + j + '"]');
            cell.value = sudoku[i][j] !== 0 ? sudoku[i][j] : "";
        }
    }
}

// Backtracking puro: usado como fallback cuando la propagacion de restricciones
// no es suficiente para resolver el puzzle completamente.
function solucionar_sudoku(puzzle) {
    if (sudoku_acabado(puzzle) && sudoku_valido(puzzle)) {
        return puzzle;
    }
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) {
            if (puzzle[i][j] === 0) {
                for (let k = 1; k <= TAM; k++) {
                    puzzle[i][j] = k;
                    if (sudoku_valido(puzzle)) {
                        const result = solucionar_sudoku(puzzle);
                        if (result !== null) return result;
                    }
                }
                puzzle[i][j] = 0; // deshacer
                return null;
            }
        }
    }
    return null;
}

// Convierte un tablero de Sets a un tablero de numeros.
// Las celdas resueltas (Set de 1 elemento) se convierten a su valor;
// las celdas sin resolver se dejan a 0 para que el backtracking las complete.
function sets_a_numeros(board) {
    return board.map(row =>
        row.map(cell => (cell.size === 1 ? [...cell][0] : 0))
    );
}

// Reduce las posibilidades de cada celda propagando las restricciones
// de filas, columnas y cajas 3x3.
function reduce_board(board, groups) {
    let changed = false;
    for (const group of groups) {
        // Recoge los valores ya fijos en el grupo
        const singles = new Set();
        for (const cell of group) {
            if (cell.size === 1) {
                singles.add([...cell][0]);
            }
        }
        // Elimina esos valores de las celdas aun no resueltas
        for (const cell of group) {
            if (cell.size > 1) {
                for (const num of singles) {
                    if (cell.has(num)) {
                        cell.delete(num);
                        changed = true;
                    }
                }
            }
        }
    }
    return changed;
}

// Solver principal: primero aplica propagacion de restricciones para reducir
// el espacio de busqueda y, si no basta, recurre al backtracking.
function solve_sudoku(puzzle) {
    // Construir tablero de Sets: celdas conocidas -> Set unitario, vacias -> {1..9}
    const board = puzzle.map(row =>
        row.map(val => (val !== 0 ? new Set([val]) : new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])))
    );

    // Construir grupos: filas, columnas y cajas 3x3
    const groups = [];

    for (let i = 0; i < TAM; i++) {
        groups.push(board[i]); // fila i (array de Sets, no envuelto en otro array)
    }
    for (let j = 0; j < TAM; j++) {
        const col = [];
        for (let i = 0; i < TAM; i++) {
            col.push(board[i][j]);
        }
        groups.push(col);
    }
    for (let i = 0; i < TAM; i += 3) {
        for (let j = 0; j < TAM; j += 3) {
            const box = [];
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    box.push(board[i + k][j + l]);
                }
            }
            groups.push(box);
        }
    }

    // Propagar restricciones hasta que no haya cambios
    let changed = true;
    while (changed) {
        changed = reduce_board(board, groups);
    }

    // Convertir el tablero de Sets a numeros
    const numBoard = sets_a_numeros(board);

    // Si la propagacion ya resolvio el puzzle, devolver directamente
    if (sudoku_acabado(numBoard) && sudoku_valido(numBoard)) {
        return numBoard;
    }

    // Si no, usar backtracking sobre el tablero ya reducido (mucho menos trabajo)
    return solucionar_sudoku(numBoard);
}

function crea_sudoku() {
    nuevo_sudoku();
    for (let i = 0; i < initial_vars; i++) {
        let keep_on = true;
        while (keep_on) {
            const a = Math.floor(Math.random() * 9);
            const b = Math.floor(Math.random() * 9);
            if (sudoku[a][b] === 0) {
                for (let j = 1; j <= TAM; j++) {
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
    mostrar_sudoku();
}

function genera_sudoku() {
    let solucionable = false;
    while (!solucionable) {
        crea_sudoku();
        const sudoku2 = solve_sudoku(sudoku);
        if (sudoku2 !== null) {
            solucionable = true;
            sudoku = sudoku2;
        }
    }
}

function comprobar_sudoku() {
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) {
            const input = document.querySelector('.Sudoku-item[data-index="' + i + j + '"]');
            const td = document.querySelector('.Sudoku-td[data-index="' + i + j + '"]');
            const cls = parseInt(input.value) === sudoku[i][j] ? "acierto" : "error";
            td.classList.add(cls);
            setTimeout(() => td.classList.remove(cls), 2000);
        }
    }
}

genera_sudoku();
new_sudoku.addEventListener("click", () => genera_sudoku());
comprobar.addEventListener("click", () => comprobar_sudoku());
resolver.addEventListener("click", () => mostrar_sudoku());