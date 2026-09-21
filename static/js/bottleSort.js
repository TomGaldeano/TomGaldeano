/**
 * Water Sort / Bottle Filling Puzzle Game
 * HTML5 Canvas interactive puzzle with animations, sound effects, and undo.
 */

(function () {
  'use strict';

  // --- Color Palette ---
  const COLOR_PALETTE = [
    { name: 'Red', hex: '#e74c3c', light: '#ff6b6b', dark: '#c0392b' },
    { name: 'Blue', hex: '#3498db', light: '#54a0ff', dark: '#2980b9' },
    { name: 'Green', hex: '#2ecc71', light: '#55efc4', dark: '#27ae60' },
    { name: 'Orange', hex: '#e67e22', light: '#f39c12', dark: '#d35400' },
    { name: 'Purple', hex: '#9b59b6', light: '#a29bfe', dark: '#8e44ad' },
    { name: 'Cyan', hex: '#00cec9', light: '#81ecec', dark: '#00b894' },
    { name: 'Pink', hex: '#fd79a8', light: '#ff9ff3', dark: '#e84393' },
    { name: 'Gold', hex: '#f1c40f', light: '#ffeaa7', dark: '#d4ac0d' }
  ];

  const DIFFICULTIES = {
    easy: { colors: 3, empty: 1, name: 'Easy', multiplier: 1 },
    medium: { colors: 4, empty: 1, name: 'Medium', multiplier: 1.5 },
    hard: { colors: 6, empty: 1, name: 'Hard', multiplier: 2.2 },
    expert: { colors: 8, empty: 2, name: 'Expert', multiplier: 3.5 }
  };

  const CAPACITY = 4;

  // --- Sound Effects using Web Audio API ---
  class SoundEffects {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playSelect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    playDeselect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.07);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }

    playInvalid() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(120, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }

    playPour() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const count = 3;
      for (let i = 0; i < count; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = 300 + Math.random() * 200;
        osc.frequency.setValueAtTime(startFreq, now + i * 0.1);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 150, now + i * 0.1 + 0.15);
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.15);
      }
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C, E, G, C5, E5, G5
      const now = this.ctx.currentTime;
      notes.forEach((note, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now + index * 0.12);
        gain.gain.setValueAtTime(0.25, now + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 0.35);
      });
    }
  }

  // --- Confetti particle for victory ---
  class ConfettiParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)].hex;
      this.vx = (Math.random() - 0.5) * 12;
      this.vy = -Math.random() * 10 - 4;
      this.gravity = 0.25;
      this.rotation = Math.random() * 360;
      this.vRotation = (Math.random() - 0.5) * 10;
      this.opacity = 1;
      this.decay = Math.random() * 0.008 + 0.004;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.vRotation;
      this.opacity -= this.decay;
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  // --- Main Game Class ---
  class BottleSortGame {
    constructor() {
      this.canvas = document.getElementById('bottleCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.sound = new SoundEffects();
      this.currentDifficulty = 'easy';

      // State
      this.bottles = [];      // Array of arrays containing color IDs (0 to N-1)
      this.initialState = []; // Saved for restart
      this.undoStack = [];    // Array of snapshots for undo
      this.selectedIndex = null;
      this.moves = 0;
      this.timerSeconds = 0;
      this.timerInterval = null;
      this.gameWon = false;
      this.scoreTracked = false;

      // Layout coordinates for bottles
      this.bottleLayouts = [];

      // Animations
      this.animating = false;
      this.pourAnimation = null;
      this.shakeBottleIndex = null;
      this.shakeOffset = 0;
      this.shakeStartTime = 0;
      this.confetti = [];

      // Setup DOM elements
      this.hudMoves = document.getElementById('hudMoves');
      this.hudTimer = document.getElementById('hudTimer');
      this.hudDifficulty = document.getElementById('hudDifficulty');
      this.hudStatus = document.getElementById('hudStatus');

      this.initDPI();
      this.bindEvents();
      this.startNewGame(this.currentDifficulty);

      // Start rendering loop
      this.lastFrameTime = performance.now();
      requestAnimationFrame(this.gameLoop.bind(this));
    }

    initDPI() {
      // Crisp canvas rendering for HiDPI/Retina screens
      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = 900;
      const logicalHeight = 540;

      this.canvas.width = logicalWidth * dpr;
      this.canvas.height = logicalHeight * dpr;
      this.canvas.style.width = '100%';
      this.canvas.style.maxWidth = `${logicalWidth}px`;
      this.canvas.style.height = 'auto';

      this.ctx.scale(dpr, dpr);
      this.logicalWidth = logicalWidth;
      this.logicalHeight = logicalHeight;
    }

    bindEvents() {
      // Window resize
      window.addEventListener('resize', () => {
        this.computeBottleLayouts();
      });

      // Canvas click / touch
      const handleInput = (e) => {
        e.preventDefault();
        if (this.animating || this.gameWon) return;

        const rect = this.canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }

        const scaleX = this.logicalWidth / rect.width;
        const scaleY = this.logicalHeight / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        this.handleClickAt(x, y);
      };

      this.canvas.addEventListener('click', handleInput);
      this.canvas.addEventListener('touchstart', handleInput, { passive: false });

      // Action Buttons
      const btnUndo = document.getElementById('btnUndo');
      if (btnUndo) btnUndo.addEventListener('click', () => this.undo());

      const btnRestart = document.getElementById('btnRestart');
      if (btnRestart) btnRestart.addEventListener('click', () => this.restartCurrentPuzzle());

      const btnNewGame = document.getElementById('btnNewGame');
      if (btnNewGame) btnNewGame.addEventListener('click', () => this.startNewGame(this.currentDifficulty));

      const btnSound = document.getElementById('btnSound');
      if (btnSound) {
        btnSound.addEventListener('click', () => {
          const on = this.sound.toggle();
          btnSound.textContent = on ? '🔊 Sound: ON' : '🔈 Sound: OFF';
          btnSound.style.opacity = on ? '1' : '0.6';
        });
      }

      // Difficulty buttons
      const diffButtons = document.querySelectorAll('#diffButtons [data-diff]');
      diffButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const diff = e.target.getAttribute('data-diff');
          if (diff && DIFFICULTIES[diff]) {
            diffButtons.forEach((b) => b.classList.remove('active-diff'));
            e.target.classList.add('active-diff');
            this.startNewGame(diff);
          }
        });
      });
    }

    startTimer() {
      this.stopTimer();
      this.timerSeconds = 0;
      this.updateTimerDisplay();
      this.timerInterval = setInterval(() => {
        if (!this.gameWon) {
          this.timerSeconds++;
          this.updateTimerDisplay();
        }
      }, 1000);
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    updateTimerDisplay() {
      if (!this.hudTimer) return;
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      this.hudTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateHUD() {
      if (this.hudMoves) this.hudMoves.textContent = this.moves;
      if (this.hudDifficulty) this.hudDifficulty.textContent = DIFFICULTIES[this.currentDifficulty].name;
      if (this.hudStatus) {
        if (this.gameWon) {
          this.hudStatus.textContent = '🎉 Solved!';
          this.hudStatus.style.color = '#2ecc71';
        } else if (this.selectedIndex !== null) {
          this.hudStatus.textContent = 'Selected';
          this.hudStatus.style.color = '#3498db';
        } else {
          this.hudStatus.textContent = 'In Progress';
          this.hudStatus.style.color = '#f1c40f';
        }
      }
    }

    startNewGame(difficultyKey) {
      this.currentDifficulty = difficultyKey || 'easy';
      const config = DIFFICULTIES[this.currentDifficulty];
      const colorCount = config.colors;
      const emptyCount = config.empty;
      const totalBottles = colorCount + emptyCount;

      // Generate solvable puzzle
      this.bottles = this.generateSolvablePuzzle(colorCount, emptyCount);
      this.initialState = JSON.parse(JSON.stringify(this.bottles));
      this.undoStack = [];
      this.selectedIndex = null;
      this.moves = 0;
      this.gameWon = false;
      this.scoreTracked = false;
      this.confetti = [];

      this.computeBottleLayouts();
      this.startTimer();
      this.updateHUD();

      if (window.GameTracker) {
        window.GameTracker.trackTry('games/bottleSort');
      }
    }

    restartCurrentPuzzle() {
      if (this.animating) return;
      this.bottles = JSON.parse(JSON.stringify(this.initialState));
      this.undoStack = [];
      this.selectedIndex = null;
      this.moves = 0;
      this.gameWon = false;
      this.scoreTracked = false;
      this.confetti = [];
      this.startTimer();
      this.updateHUD();
      this.sound.playSelect();

      if (window.GameTracker) {
        window.GameTracker.trackTry('games/bottleSort');
      }
    }

    generateSolvablePuzzle(colorCount, emptyCount) {
      // 1. Build solved state: K bottles full of identical colors + E empty bottles
      let bottles = [];
      for (let i = 0; i < colorCount; i++) {
        bottles.push([i, i, i, i]);
      }
      for (let i = 0; i < emptyCount; i++) {
        bottles.push([]);
      }

      // 2. Perform N random legal reverse pours from the solved state
      // This guarantees the generated state is 100% solvable.
      const shuffleSteps = colorCount * 25;
      for (let step = 0; step < shuffleSteps; step++) {
        // Pick a random source with liquid
        const nonEmpties = bottles
          .map((b, idx) => ({ b, idx }))
          .filter((item) => item.b.length > 0);
        if (nonEmpties.length === 0) break;

        const src = nonEmpties[Math.floor(Math.random() * nonEmpties.length)];

        // Pick a target bottle with capacity that is not the same bottle
        const validTargets = bottles
          .map((b, idx) => ({ b, idx }))
          .filter((item) => item.idx !== src.idx && item.b.length < CAPACITY);
        if (validTargets.length === 0) continue;

        const tgt = validTargets[Math.floor(Math.random() * validTargets.length)];

        // How many units of same color can we move?
        const color = src.b[src.b.length - 1];
        let units = 0;
        for (let k = src.b.length - 1; k >= 0; k--) {
          if (src.b[k] === color && tgt.b.length + units < CAPACITY) {
            units++;
          } else {
            break;
          }
        }
        if (units === 0) units = 1;

        // Move the units
        for (let u = 0; u < units; u++) {
          tgt.b.push(src.b.pop());
        }
      }

      // Verify that it is not already solved
      if (this.checkWinCondition(bottles)) {
        // If coincidentally solved, do a quick swap
        if (bottles[0].length > 0 && bottles[1].length > 0) {
          const temp = bottles[0].pop();
          bottles[1].push(temp);
        }
      }

      return bottles;
    }

    computeBottleLayouts() {
      const count = this.bottles.length;
      this.bottleLayouts = [];

      // Determine rows:
      // <= 5 bottles: 1 row
      // > 5 bottles: 2 rows (e.g. 7 bottles -> 4 top, 3 bottom; 10 bottles -> 5 top, 5 bottom)
      const twoRows = count > 5;
      const topRowCount = twoRows ? Math.ceil(count / 2) : count;
      const botRowCount = twoRows ? count - topRowCount : 0;

      const row1Y = twoRows ? 150 : 280;
      const row2Y = twoRows ? 410 : 280;

      const bottleWidth = count <= 5 ? 76 : (count <= 8 ? 68 : 58);
      const bottleHeight = twoRows ? 175 : 210;

      // Layout top row
      const spacing1 = (this.logicalWidth - 60) / topRowCount;
      for (let i = 0; i < topRowCount; i++) {
        const x = 30 + spacing1 * i + (spacing1 - bottleWidth) / 2;
        this.bottleLayouts.push({
          x: x,
          y: row1Y - bottleHeight / 2,
          w: bottleWidth,
          h: bottleHeight,
          origY: row1Y - bottleHeight / 2
        });
      }

      // Layout bottom row
      if (twoRows) {
        const spacing2 = (this.logicalWidth - 60) / botRowCount;
        for (let i = 0; i < botRowCount; i++) {
          const x = 30 + spacing2 * i + (spacing2 - bottleWidth) / 2;
          this.bottleLayouts.push({
            x: x,
            y: row2Y - bottleHeight / 2,
            w: bottleWidth,
            h: bottleHeight,
            origY: row2Y - bottleHeight / 2
          });
        }
      }
    }

    handleClickAt(x, y) {
      // Find clicked bottle
      let clickedIdx = -1;
      for (let i = 0; i < this.bottleLayouts.length; i++) {
        const b = this.bottleLayouts[i];
        // Expand hit-test area slightly for touch-friendliness
        const hitPadding = 12;
        if (
          x >= b.x - hitPadding &&
          x <= b.x + b.w + hitPadding &&
          y >= b.origY - 30 &&
          y <= b.origY + b.h + hitPadding
        ) {
          clickedIdx = i;
          break;
        }
      }

      if (clickedIdx === -1) {
        if (this.selectedIndex !== null) {
          this.selectedIndex = null;
          this.sound.playDeselect();
          this.updateHUD();
        }
        return;
      }

      // No bottle selected yet
      if (this.selectedIndex === null) {
        if (this.bottles[clickedIdx].length > 0) {
          this.selectedIndex = clickedIdx;
          this.sound.playSelect();
          this.updateHUD();
        } else {
          // Clicked empty bottle with nothing selected
          this.triggerShake(clickedIdx);
          this.sound.playInvalid();
        }
      } else {
        // Bottle already selected
        if (this.selectedIndex === clickedIdx) {
          // Deselect same bottle
          this.selectedIndex = null;
          this.sound.playDeselect();
          this.updateHUD();
        } else {
          // Attempt pour from this.selectedIndex to clickedIdx
          this.attemptPour(this.selectedIndex, clickedIdx);
        }
      }
    }

    canPour(srcIdx, tgtIdx) {
      const src = this.bottles[srcIdx];
      const tgt = this.bottles[tgtIdx];
      if (!src || src.length === 0) return false;
      if (tgt.length >= CAPACITY) return false;
      if (tgt.length === 0) return true;
      return src[src.length - 1] === tgt[tgt.length - 1];
    }

    attemptPour(srcIdx, tgtIdx) {
      if (!this.canPour(srcIdx, tgtIdx)) {
        this.triggerShake(srcIdx);
        this.sound.playInvalid();
        this.selectedIndex = null;
        this.updateHUD();
        return;
      }

      // Count units to pour
      const src = this.bottles[srcIdx];
      const tgt = this.bottles[tgtIdx];
      const color = src[src.length - 1];
      const availableSpace = CAPACITY - tgt.length;

      let matchingUnits = 0;
      for (let i = src.length - 1; i >= 0; i--) {
        if (src[i] === color) matchingUnits++;
        else break;
      }
      const unitsToPour = Math.min(matchingUnits, availableSpace);

      // Save undo snapshot before modifying state
      this.undoStack.push(JSON.parse(JSON.stringify(this.bottles)));

      // Trigger animated pour
      this.startPourAnimation(srcIdx, tgtIdx, color, unitsToPour);
    }

    startPourAnimation(srcIdx, tgtIdx, colorId, units) {
      this.animating = true;
      this.selectedIndex = null;
      this.sound.playPour();

      const srcLayout = this.bottleLayouts[srcIdx];
      const tgtLayout = this.bottleLayouts[tgtIdx];

      // Direction of tilt: positive angle if tilting right, negative if tilting left
      const tiltRight = tgtLayout.x >= srcLayout.x;
      const targetAngle = tiltRight ? 0.95 : -0.95;

      this.pourAnimation = {
        srcIdx,
        tgtIdx,
        colorId,
        units,
        startTime: performance.now(),
        duration: 550, // ms
        tiltRight,
        targetAngle,
        srcStartX: srcLayout.x,
        srcStartY: srcLayout.origY,
        // Lift and hover near target bottle mouth
        liftTargetX: tiltRight ? tgtLayout.x - srcLayout.w * 0.7 : tgtLayout.x + tgtLayout.w * 0.7,
        liftTargetY: tgtLayout.y - srcLayout.h * 0.65
      };
    }

    finishPour() {
      if (!this.pourAnimation) return;
      const { srcIdx, tgtIdx, units } = this.pourAnimation;

      for (let u = 0; u < units; u++) {
        this.bottles[tgtIdx].push(this.bottles[srcIdx].pop());
      }

      this.moves++;
      this.animating = false;
      this.pourAnimation = null;
      this.updateHUD();

      // Check win condition
      if (this.checkWinCondition(this.bottles)) {
        this.onWin();
      }
    }

    undo() {
      if (this.animating || this.undoStack.length === 0 || this.gameWon) return;
      this.bottles = this.undoStack.pop();
      this.selectedIndex = null;
      if (this.moves > 0) this.moves--;
      this.sound.playDeselect();
      this.updateHUD();
    }

    triggerShake(idx) {
      this.shakeBottleIndex = idx;
      this.shakeStartTime = performance.now();
    }

    checkWinCondition(bottles) {
      for (const bottle of bottles) {
        if (bottle.length === 0) continue;
        if (bottle.length !== CAPACITY) return false;
        const color = bottle[0];
        for (let i = 1; i < bottle.length; i++) {
          if (bottle[i] !== color) return false;
        }
      }
      return true;
    }

    onWin() {
      this.gameWon = true;
      this.stopTimer();
      this.sound.playVictory();
      this.updateHUD();

      // Spawn confetti across canvas
      for (let i = 0; i < 160; i++) {
        this.confetti.push(
          new ConfettiParticle(
            this.logicalWidth / 2 + (Math.random() - 0.5) * 400,
            this.logicalHeight * 0.35 + (Math.random() - 0.5) * 100
          )
        );
      }

      // Calculate score and submit to GameTracker
      if (!this.scoreTracked && window.GameTracker) {
        this.scoreTracked = true;
        const mult = DIFFICULTIES[this.currentDifficulty].multiplier;
        // Base score: 1000 * mult, minus penalties for moves and time, minimum 100
        const movesPenalty = this.moves * 15;
        const timePenalty = this.timerSeconds * 5;
        const calculatedScore = Math.max(150, Math.round((1200 - movesPenalty - timePenalty) * mult));
        window.GameTracker.trackScore('games/bottleSort', calculatedScore);
      }
    }

    gameLoop(now) {
      this.update(now);
      this.render();
      requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(now) {
      // Update pour animation
      if (this.pourAnimation) {
        const elapsed = now - this.pourAnimation.startTime;
        const progress = Math.min(1, elapsed / this.pourAnimation.duration);
        this.pourAnimation.progress = progress;

        if (progress >= 1) {
          this.finishPour();
        }
      }

      // Update shake animation
      if (this.shakeBottleIndex !== null) {
        const elapsed = now - this.shakeStartTime;
        const duration = 240;
        if (elapsed < duration) {
          const t = elapsed / duration;
          this.shakeOffset = Math.sin(t * Math.PI * 6) * (8 * (1 - t));
        } else {
          this.shakeBottleIndex = null;
          this.shakeOffset = 0;
        }
      }

      // Update confetti
      if (this.confetti.length > 0) {
        for (let i = this.confetti.length - 1; i >= 0; i--) {
          const p = this.confetti[i];
          p.update();
          if (p.opacity <= 0 || p.y > this.logicalHeight + 20) {
            this.confetti.splice(i, 1);
          }
        }
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

      // Render bottles
      for (let i = 0; i < this.bottles.length; i++) {
        // Skip drawing the source bottle here if it's currently animating in the pour overlay
        if (this.pourAnimation && this.pourAnimation.srcIdx === i) continue;

        const layout = this.bottleLayouts[i];
        if (!layout) continue;

        let drawX = layout.x;
        let drawY = layout.origY;

        // Selected bottle hover animation
        if (this.selectedIndex === i) {
          drawY -= 20;
        }

        // Shaking effect
        if (this.shakeBottleIndex === i) {
          drawX += this.shakeOffset;
        }

        this.drawBottle(ctx, drawX, drawY, layout.w, layout.h, this.bottles[i], this.selectedIndex === i);
      }

      // Render pouring animation overlay
      if (this.pourAnimation) {
        this.renderPouringAnimation(ctx);
      }

      // Render confetti
      if (this.confetti.length > 0) {
        for (const p of this.confetti) {
          p.draw(ctx);
        }
      }

      // Win Banner overlay
      if (this.gameWon) {
        this.renderWinBanner(ctx);
      }
    }

    drawBottle(ctx, x, y, w, h, liquidSegments, isSelected, angle = 0, anchorX = 0, anchorY = 0) {
      ctx.save();

      if (angle !== 0) {
        ctx.translate(anchorX, anchorY);
        ctx.rotate(angle);
        ctx.translate(-anchorX, -anchorY);
      }

      const neckW = w * 0.5;
      const neckH = h * 0.15;
      const bodyY = y + neckH;
      const bodyH = h - neckH;
      const radius = w * 0.42;

      // Selection Glow
      if (isSelected) {
        ctx.save();
        ctx.shadowColor = '#3498db';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.8)';
        ctx.lineWidth = 3;
        this.traceBottlePath(ctx, x, y, w, h, neckW, neckH, radius);
        ctx.stroke();
        ctx.restore();
      }

      // Clip path to draw liquid inside the glass tube
      ctx.save();
      this.traceBottlePath(ctx, x, y, w, h, neckW, neckH, radius);
      ctx.clip();

      // Liquid segments
      const segmentH = bodyH / CAPACITY;
      for (let i = 0; i < liquidSegments.length; i++) {
        const colorId = liquidSegments[i];
        const colorDef = COLOR_PALETTE[colorId] || { hex: '#999', light: '#aaa', dark: '#777' };
        const segY = y + h - (i + 1) * segmentH;

        // Gradient for 3D liquid look
        const grad = ctx.createLinearGradient(x, segY, x + w, segY);
        grad.addColorStop(0, colorDef.dark);
        grad.addColorStop(0.3, colorDef.light);
        grad.addColorStop(0.7, colorDef.hex);
        grad.addColorStop(1, colorDef.dark);

        ctx.fillStyle = grad;
        ctx.fillRect(x - 2, segY, w + 4, segmentH + 1);

        // Meniscus surface curve on top layer of liquid
        if (i === liquidSegments.length - 1) {
          ctx.beginPath();
          ctx.ellipse(x + w / 2, segY, w * 0.48, 5, 0, 0, Math.PI * 2);
          ctx.fillStyle = colorDef.light;
          ctx.fill();
        }
      }

      // Glass inner reflection
      const innerReflect = ctx.createLinearGradient(x, y, x + w * 0.35, y);
      innerReflect.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      innerReflect.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = innerReflect;
      ctx.fillRect(x, bodyY, w * 0.3, bodyH);

      ctx.restore(); // Exit clip

      // Glass Outline / Tube Body
      ctx.beginPath();
      this.traceBottlePath(ctx, x, y, w, h, neckW, neckH, radius);
      ctx.strokeStyle = 'rgba(200, 220, 240, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Glass Rim / Lip at the top
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y, neckW * 0.55, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 235, 250, 0.6)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(240, 250, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Subtle measurement ticks on the bottle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      for (let m = 1; m < CAPACITY; m++) {
        const tickY = y + h - m * segmentH;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.15, tickY);
        ctx.lineTo(x + w * 0.3, tickY);
        ctx.stroke();
      }

      ctx.restore();
    }

    traceBottlePath(ctx, x, y, w, h, neckW, neckH, radius) {
      const neckLeft = x + (w - neckW) / 2;
      const neckRight = neckLeft + neckW;
      const bodyTop = y + neckH;

      ctx.beginPath();
      // Top lip
      ctx.moveTo(neckLeft, y);
      // Neck left
      ctx.lineTo(neckLeft, bodyTop);
      // Shoulder left
      ctx.lineTo(x, bodyTop + 10);
      // Body left
      ctx.lineTo(x, y + h - radius);
      // Bottom rounded arc
      ctx.arcTo(x, y + h, x + radius, y + h, radius);
      ctx.lineTo(x + w - radius, y + h);
      ctx.arcTo(x + w, y + h, x + w, y + h - radius, radius);
      // Body right
      ctx.lineTo(x + w, bodyTop + 10);
      // Shoulder right
      ctx.lineTo(neckRight, bodyTop);
      // Neck right
      ctx.lineTo(neckRight, y);
      ctx.closePath();
    }

    renderPouringAnimation(ctx) {
      const anim = this.pourAnimation;
      const srcLayout = this.bottleLayouts[anim.srcIdx];
      const tgtLayout = this.bottleLayouts[anim.tgtIdx];
      const p = anim.progress;

      // Phase 1 (0 to 0.3): Move to target and tilt
      // Phase 2 (0.3 to 0.85): Liquid stream pours
      // Phase 3 (0.85 to 1.0): Return upright and back to slot

      let currentX, currentY, currentAngle;
      if (p < 0.3) {
        const sub = p / 0.3;
        currentX = anim.srcStartX + (anim.liftTargetX - anim.srcStartX) * sub;
        currentY = anim.srcStartY + (anim.liftTargetY - anim.srcStartY) * sub;
        currentAngle = anim.targetAngle * sub;
      } else if (p < 0.85) {
        currentX = anim.liftTargetX;
        currentY = anim.liftTargetY;
        currentAngle = anim.targetAngle;
      } else {
        const sub = (p - 0.85) / 0.15;
        currentX = anim.liftTargetX + (anim.srcStartX - anim.liftTargetX) * sub;
        currentY = anim.liftTargetY + (anim.srcStartY - anim.liftTargetY) * sub;
        currentAngle = anim.targetAngle * (1 - sub);
      }

      // Draw pouring stream of liquid during Phase 2
      if (p >= 0.28 && p <= 0.85) {
        const colorDef = COLOR_PALETTE[anim.colorId] || { hex: '#3498db', light: '#54a0ff' };
        const streamStartX = anim.tiltRight ? currentX + srcLayout.w * 0.85 : currentX + srcLayout.w * 0.15;
        const streamStartY = currentY + srcLayout.h * 0.3;
        const streamTargetX = tgtLayout.x + tgtLayout.w / 2;
        const streamTargetY = tgtLayout.y + 15;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(streamStartX, streamStartY);
        ctx.quadraticCurveTo(
          (streamStartX + streamTargetX) / 2,
          streamStartY + 30,
          streamTargetX,
          streamTargetY
        );
        ctx.strokeStyle = colorDef.hex;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Subtle highlight stream
        ctx.beginPath();
        ctx.moveTo(streamStartX, streamStartY);
        ctx.quadraticCurveTo(
          (streamStartX + streamTargetX) / 2,
          streamStartY + 30,
          streamTargetX,
          streamTargetY
        );
        ctx.strokeStyle = colorDef.light;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // Draw tilted source bottle
      this.drawBottle(
        ctx,
        currentX,
        currentY,
        srcLayout.w,
        srcLayout.h,
        this.bottles[anim.srcIdx],
        false,
        currentAngle,
        currentX + srcLayout.w / 2,
        currentY + srcLayout.h * 0.2
      );
    }

    renderWinBanner(ctx) {
      ctx.save();
      // Semi-transparent backdrop
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);

      // Card modal
      const cardW = 420;
      const cardH = 240;
      const cardX = (this.logicalWidth - cardW) / 2;
      const cardY = (this.logicalHeight - cardH) / 2;

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(cardX, cardY, cardW, cardH, 16) : ctx.rect(cardX, cardY, cardW, cardH);
      ctx.fill();
      ctx.stroke();

      // Victory text
      ctx.fillStyle = '#2ecc71';
      ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PUZZLE SOLVED!', this.logicalWidth / 2, cardY + 55);

      // Stats
      ctx.fillStyle = '#f8fafc';
      ctx.font = '18px "Segoe UI", Arial, sans-serif';
      ctx.fillText(`Difficulty: ${DIFFICULTIES[this.currentDifficulty].name}`, this.logicalWidth / 2, cardY + 95);
      ctx.fillText(`Moves Taken: ${this.moves}`, this.logicalWidth / 2, cardY + 125);
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      ctx.fillText(
        `Time: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
        this.logicalWidth / 2,
        cardY + 155
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillText('Click "New Game" above to play again!', this.logicalWidth / 2, cardY + 200);

      ctx.restore();
    }
  }

  // Initialise game on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    new BottleSortGame();
  });
})();
