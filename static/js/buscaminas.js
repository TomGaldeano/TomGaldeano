// Minesweeper game implementation

class Casilla {
	constructor(tieneMina = false, numMinasCercanas = 0) {
		this.tieneMina = tieneMina;
		this.numMinasCercanas = numMinasCercanas;
		this.estaOculta = true;
		this.estaMarcada = false;
	}
}

class Minesweeper {
	constructor(dimensiones, numMinas) {
		this.dimensiones = dimensiones;
		this.numMinas = numMinas;
		this.numMarcadas = 0;
		this.exploto = false;
		this.marcoMal = false;
		this.iniciarTablero();
	}

	iniciarTablero() {
		this.tablero = Array.from({ length: this.dimensiones }, () =>
			Array.from({ length: this.dimensiones }, () => new Casilla(false, 0))
		);
		this.minar();
		this.calcularMinasCercanas();
	}

	minar() {
		const randInt = (n) => Math.floor(Math.random() * n);
		let placed = 0;
		while (placed < this.numMinas) {
			const x = randInt(this.dimensiones);
			const y = randInt(this.dimensiones);
			if (!this.tablero[x][y].tieneMina) {
				this.tablero[x][y].tieneMina = true;
				placed++;
			}
		}
	}

	calcularMinasCercanas() {
		const dirs = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1],           [0, 1],
			[1, -1],  [1, 0],  [1, 1]
		];
		for (let i = 0; i < this.dimensiones; i++) {
			for (let j = 0; j < this.dimensiones; j++) {
				let minas = 0;
				for (const [dx, dy] of dirs) {
					const nx = i + dx, ny = j + dy;
					if (nx >= 0 && nx < this.dimensiones && ny >= 0 && ny < this.dimensiones) {
						if (this.tablero[nx][ny].tieneMina) minas++;
					}
				}
				this.tablero[i][j].numMinasCercanas = minas;
			}
		}
	}

	descubrirCasilla(fila, columna) {
		if (fila < 1 || fila > this.dimensiones || columna < 1 || columna > this.dimensiones) return false;
		const cell = this.tablero[fila - 1][columna - 1];
		if (!cell.estaOculta) return false;
		if (cell.estaMarcada) return false;
		if (cell.tieneMina) this.exploto = true;
		cell.estaOculta = false;
		return true;
	}

	marcarCasilla(fila, columna) {
		if (fila < 1 || fila > this.dimensiones || columna < 1 || columna > this.dimensiones) return false;
		const cell = this.tablero[fila - 1][columna - 1];
		if (!cell.estaOculta) return false;
		if (cell.estaMarcada) return false;
		if (!cell.tieneMina) this.marcoMal = true;
		cell.estaMarcada = true;
		this.numMarcadas++;
		return true;
	}

	causaTerminacionJuego() {
		if (this.numMarcadas === this.numMinas) return 1;
		if (this.exploto) return 2;
		if (this.marcoMal) return 3;
		return 0;
	}

	imprimirTablero() {
        for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleClick);
            board.appendChild(cell);
        }
        }

		let out = '';
		for (let i = 0; i < this.dimensiones; i++) {
			for (let j = 0; j < this.dimensiones; j++) {
				const c = this.tablero[i][j];
				out += c.estaOculta ? '-' : (c.tieneMina ? '*' : c.numMinasCercanas);
				out += ' ';
			}
			out += '\n';
		}
		console.log(out);
	}
}

// expose for browser usage
window.Casilla = Casilla;
window.Minesweeper = Minesweeper;
let partida = new Minesweeper(8,10)
partida.imprimirTablero()
const easy = document.querySelector("#facil");
const medium = document.querySelector("#medio");
const hard = document.querySelector("#dificil");
const very_hard = document.querySelector("#muy_dificil");
