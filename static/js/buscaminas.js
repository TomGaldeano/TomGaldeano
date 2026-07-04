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
		this.juegoGanado = false;
		this.juegoTerminado = false;
		this.primerClick = true;
		this.tiempoInicio = null;
		this.timerInterval = null;
		this.iniciarTablero();
		this.board = document.querySelector("#tablero");
		this.renderizar();
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

	// Guarantee first click is safe — relocate mine if needed
	asegurarPrimerClick(fila, col) {
		if (!this.tablero[fila][col].tieneMina) return;

		this.tablero[fila][col].tieneMina = false;

		// Place the mine somewhere else
		const randInt = (n) => Math.floor(Math.random() * n);
		let placed = false;
		while (!placed) {
			const x = randInt(this.dimensiones);
			const y = randInt(this.dimensiones);
			if (!this.tablero[x][y].tieneMina && !(x === fila && y === col)) {
				this.tablero[x][y].tieneMina = true;
				placed = true;
			}
		}

		// Recalculate neighbors
		this.calcularMinasCercanas();
	}

	// Flood-fill reveal for cells with 0 adjacent mines
	revelarFlood(fila, col) {
		const dirs = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1],           [0, 1],
			[1, -1],  [1, 0],  [1, 1]
		];

		const stack = [[fila, col]];
		while (stack.length > 0) {
			const [r, c] = stack.pop();
			if (r < 0 || r >= this.dimensiones || c < 0 || c >= this.dimensiones) continue;
			const cell = this.tablero[r][c];
			if (!cell.estaOculta || cell.estaMarcada) continue;

			cell.estaOculta = false;

			if (cell.numMinasCercanas === 0 && !cell.tieneMina) {
				for (const [dx, dy] of dirs) {
					stack.push([r + dx, c + dy]);
				}
			}
		}
	}

	clickIzquierdo(fila, col) {
		if (this.juegoTerminado) return;

		const cell = this.tablero[fila][col];
		if (!cell.estaOculta || cell.estaMarcada) return;

		// First click: start timer & ensure safety
		if (this.primerClick) {
			this.primerClick = false;
			this.asegurarPrimerClick(fila, col);
			this.iniciarTimer();
		}

		if (cell.tieneMina) {
			cell.estaOculta = false;
			this.exploto = true;
			this.juegoTerminado = true;
			this.pararTimer();
			this.revelarMinas();
			this.renderizar();
			this.mostrarMensaje("💥 ¡BOOM! Has pisado una mina.", "derrota");
			return;
		}

		this.revelarFlood(fila, col);
		this.renderizar();
		this.comprobarVictoria();
	}

	clickDerecho(fila, col) {
		if (this.juegoTerminado) return;

		const cell = this.tablero[fila][col];
		if (!cell.estaOculta) return;

		if (cell.estaMarcada) {
			cell.estaMarcada = false;
			this.numMarcadas--;
		} else {
			cell.estaMarcada = true;
			this.numMarcadas++;
		}
		this.renderizar();
		this.comprobarVictoria();
	}

	comprobarVictoria() {
		// Win condition: all non-mine cells are revealed
		let celdasOcultas = 0;
		for (let i = 0; i < this.dimensiones; i++) {
			for (let j = 0; j < this.dimensiones; j++) {
				if (this.tablero[i][j].estaOculta && !this.tablero[i][j].tieneMina) {
					celdasOcultas++;
				}
			}
		}
		if (celdasOcultas === 0) {
			this.juegoGanado = true;
			this.juegoTerminado = true;
			this.pararTimer();
			// Auto-flag remaining mines
			for (let i = 0; i < this.dimensiones; i++) {
				for (let j = 0; j < this.dimensiones; j++) {
					if (this.tablero[i][j].tieneMina) {
						this.tablero[i][j].estaMarcada = true;
					}
				}
			}
			this.numMarcadas = this.numMinas;
			this.renderizar();
			this.mostrarMensaje("🎉 ¡Victoria! Has despejado el campo.", "victoria");
		}
	}

	revelarMinas() {
		for (let i = 0; i < this.dimensiones; i++) {
			for (let j = 0; j < this.dimensiones; j++) {
				if (this.tablero[i][j].tieneMina) {
					this.tablero[i][j].estaOculta = false;
				}
			}
		}
	}

	iniciarTimer() {
		this.tiempoInicio = Date.now();
		const timerEl = document.querySelector("#timer-display");
		if (timerEl) timerEl.textContent = "0";
		this.timerInterval = setInterval(() => {
			if (timerEl) {
				const elapsed = Math.floor((Date.now() - this.tiempoInicio) / 1000);
				timerEl.textContent = String(elapsed).padStart(3, '0');
			}
		}, 1000);
	}

	pararTimer() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = null;
		}
	}

	mostrarMensaje(texto, tipo) {
		// Update face on reset button
		if (typeof updateFace === 'function') {
			updateFace(tipo === 'victoria' ? 'win' : 'lose');
		}
	}

	// Number colors matching classic Minesweeper
	getNumeroColor(n) {
		const colores = {
			1: '#2563eb', // blue
			2: '#16a34a', // green
			3: '#dc2626', // red
			4: '#7c3aed', // purple
			5: '#b45309', // dark orange
			6: '#0891b2', // teal
			7: '#1f2937', // dark
			8: '#6b7280', // gray
		};
		return colores[n] || '#000';
	}

	renderizar() {
		this.board.innerHTML = "";
		this.board.style.display = "grid";

		// Calculate cell size based on dimensions
		const maxBoardSize = Math.min(500, window.innerWidth - 40);
		const cellSize = Math.max(20, Math.floor(maxBoardSize / this.dimensiones));
		const boardWidth = cellSize * this.dimensiones;

		this.board.style.width = boardWidth + "px";
		this.board.style.gridTemplateColumns = `repeat(${this.dimensiones}, ${cellSize}px)`;
		this.board.style.gridTemplateRows = `repeat(${this.dimensiones}, ${cellSize}px)`;
		this.board.style.gap = "0px";
		this.board.style.margin = "0 auto";
		this.board.style.userSelect = "none";

		for (let row = 0; row < this.dimensiones; row++) {
			for (let col = 0; col < this.dimensiones; col++) {
				const cellData = this.tablero[row][col];
				const cell = document.createElement('div');
				cell.dataset.row = row;
				cell.dataset.col = col;
				cell.classList.add("ms-cell");
				cell.style.width = cellSize + "px";
				cell.style.height = cellSize + "px";
				cell.style.lineHeight = cellSize + "px";
				cell.style.fontSize = Math.max(10, cellSize - 8) + "px";

				if (cellData.estaOculta) {
					cell.classList.add("ms-hidden");

					if (cellData.estaMarcada) {
						cell.classList.add("ms-flagged");
						cell.textContent = "🚩";
					}
				} else {
					cell.classList.add("ms-revealed");

					if (cellData.tieneMina) {
						cell.classList.add("ms-mine");
						cell.textContent = "💣";
					} else if (cellData.numMinasCercanas > 0) {
						cell.textContent = cellData.numMinasCercanas;
						cell.style.color = this.getNumeroColor(cellData.numMinasCercanas);
						cell.style.fontWeight = "bold";
					}
				}

				// Left click — reveal
				cell.addEventListener("click", (e) => {
					e.preventDefault();
					this.clickIzquierdo(row, col);
				});

				// Right click — flag/unflag
				cell.addEventListener("contextmenu", (e) => {
					e.preventDefault();
					this.clickDerecho(row, col);
				});

				this.board.appendChild(cell);
			}
		}

		// Update mine counter
		const counterEl = document.querySelector("#mine-counter");
		if (counterEl) {
			counterEl.textContent = String(this.numMinas - this.numMarcadas).padStart(3, '0');
		}
	}
}

// expose for browser usage
window.Casilla = Casilla;
window.Minesweeper = Minesweeper;

// Initialize default game
let partida = new Minesweeper(8, 10);

// Difficulty buttons
const easy = document.querySelector("#facil");
const medium = document.querySelector("#medio");
const hard = document.querySelector("#dificil");
const very_hard = document.querySelector("#muy_dificil");

function nuevaPartida(dim, minas) {
	if (partida) partida.pararTimer();
	const msgEl = document.querySelector("#game-message");
	if (msgEl) { msgEl.style.display = "none"; msgEl.className = "game-message"; }
	const timerEl = document.querySelector("#timer-display");
	if (timerEl) timerEl.textContent = "000";
	partida = new Minesweeper(dim, minas);

	// Highlight active difficulty
	document.querySelectorAll(".game-button").forEach(btn => btn.classList.remove("active-difficulty"));
}

easy.addEventListener("click", () => {
	nuevaPartida(8, 10);
	easy.classList.add("active-difficulty");
});
medium.addEventListener("click", () => {
	nuevaPartida(12, 25);
	medium.classList.add("active-difficulty");
});
hard.addEventListener("click", () => {
	nuevaPartida(16, 40);
	hard.classList.add("active-difficulty");
});
very_hard.addEventListener("click", () => {
	nuevaPartida(20, 65);
	very_hard.classList.add("active-difficulty");
});

// Reset button
const resetBtn = document.querySelector("#reset-btn");
let currentDim = 8, currentMinas = 10;

if (resetBtn) {
	resetBtn.addEventListener("click", () => {
		nuevaPartida(currentDim, currentMinas);
		// Re-highlight current difficulty
		const map = { 8: easy, 12: medium, 16: hard, 20: very_hard };
		if (map[currentDim]) map[currentDim].classList.add("active-difficulty");
	});
}

// Override nuevaPartida to track current settings
const _nuevaPartida = nuevaPartida;
nuevaPartida = function(dim, minas) {
	currentDim = dim;
	currentMinas = minas;
	_nuevaPartida(dim, minas);
	updateFace("playing");
};

function updateFace(state) {
	if (!resetBtn) return;
	switch(state) {
		case "playing": resetBtn.textContent = "😊"; break;
		case "win":     resetBtn.textContent = "😎"; break;
		case "lose":    resetBtn.textContent = "💀"; break;
	}
}

// Mark default active
easy.classList.add("active-difficulty");