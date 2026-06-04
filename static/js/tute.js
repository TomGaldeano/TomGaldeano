  const canvas = document.getElementById('tuteCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;
const PADDING = 20;
const HAND_Y = 460;
const SUITS = [
  { id: 'O', symbol: '🪙', color: '#b8860b', name: 'Oros' },
  { id: 'C', symbol: '🍷', color: '#c00', name: 'Copas' },
  { id: 'E', symbol: '⚔️', color: '#2e5b82', name: 'Espadas' },
  { id: 'B', symbol: '🪵', color: '#3b7a57', name: 'Bastos' }
];
const RANKS = [
  { value: 14, label: 'A', points: 11 },
  { value: 2,  label: '2', points: 0  },
  { value: 13, label: '3', points: 10 },
  { value: 4,  label: '4', points: 0  },
  { value: 5,  label: '5', points: 0  },
  { value: 6,  label: '6', points: 0  },
  { value: 7,  label: '7', points: 0  },
  { value: 10, label: 'S', points: 2  },
  { value: 11, label: 'C', points: 3  },
  { value: 12, label: 'R', points: 4  }
];

// ─── Message overlay system ────────────────────────────────────────────────
let messageQueue = [];
let activeMessage = null;

function showMessage(text, duration = 20, color = '#ffe066') {
  messageQueue.push({ text, duration, color });
  if (!activeMessage) processNextMessage();
}

function processNextMessage() {
  if (messageQueue.length === 0) { activeMessage = null;render(); return; }
  activeMessage = messageQueue.shift();
  render();
  setTimeout(() => { activeMessage = null; processNextMessage(); }, activeMessage.duration);
  
}

// ─── Card class ────────────────────────────────────────────────────────────
class Card {
  constructor(suit, rank, label, points, symbol, color) {
    this.suit = suit;
    this.rank = rank;
    this.label = label;
    this.points = points;
    this.symbol = symbol;
    this.color = color;
    this.x = 0;
    this.y = 0;
  }

  draw(ctx, x, y, faceUp = true, highlight = false) {
    this.x = x;
    this.y = y;
    ctx.save();
    if (highlight) {
      ctx.shadowColor = '#ffe066';
      ctx.shadowBlur = 18;
    }
    ctx.fillStyle = faceUp ? '#fff' : '#2a6b3d';
    ctx.strokeStyle = highlight ? '#ffe066' : '#000';
    ctx.lineWidth = highlight ? 3 : 2;
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);

    if (faceUp) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = this.color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(this.symbol, x + CARD_WIDTH - 5, y + CARD_HEIGHT - 5);
      ctx.fillText(this.label, x + CARD_WIDTH - 55, y + CARD_HEIGHT - 5);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(this.symbol, x + 5, y + 5);
      ctx.fillText(this.label, x + 55, y + 5);
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2);
    } else {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#123f24';
      ctx.fillRect(x + 6, y + 6, CARD_WIDTH - 12, CARD_HEIGHT - 12);
      ctx.strokeStyle = '#5fbf6f';
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(x + 10, y + 10, CARD_WIDTH - 20, CARD_HEIGHT - 20);
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  isClicked(x, y) {
    return x >= this.x && x <= this.x + CARD_WIDTH && y >= this.y && y <= this.y + CARD_HEIGHT;
  }
}

// ─── Game state ────────────────────────────────────────────────────────────
const game = {
  playerHand: [],
  cpuHand: [],
  stock: [],
  trump: null,
  trumpSuit: null,
  trick: [null, null],
  trickLeaders: [null, null],
  turn: 'player',
  playerScore: 0,
  cpuScore: 0,
  phase: 'playing',
  // 'playing' | 'announce' | 'finished'
  // announce: player just won a baza and may sing/tute/swap before leading
  lastTrickBonus: false,
  announced: { player: [], cpu: [], tuteDeclared: { player: false, cpu: false } }
};

function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(new Card(suit.id, rank.value, rank.label, rank.points, suit.symbol, suit.color));
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function sortHand(hand) {
  hand.sort((a, b) => {
    const suitOrder = SUITS.map(s => s.id).indexOf(a.suit) - SUITS.map(s => s.id).indexOf(b.suit);
    if (suitOrder !== 0) return suitOrder;
    return a.rank - b.rank;
  });
}

function initGame() {
  const deck = shuffle(createDeck());
  game.playerHand = deck.splice(0, 7);
  game.cpuHand = deck.splice(0, 7);
  game.trump = deck[deck.length - 1];
  game.trumpSuit = game.trump.suit;
  game.stock = deck;
  game.trick = [null, null];
  game.trickLeaders = [null, null];
  game.turn = 'player';
  game.playerScore = 0;
  game.cpuScore = 0;
  game.phase = 'playing';
  game.lastTrickBonus = false;
  game.announced = { player: [], cpu: [], tuteDeclared: { player: false, cpu: false } };
  messageQueue = [];
  activeMessage = null;
  sortHand(game.playerHand);
  updateButtons();
  render();
}

// ─── Points constants ───────────────────────────────────────────────────────
const CANTAR_POINTS_TRUMP = 40;
const CANTAR_POINTS_NONTRUMP = 20;
const TUTE_POINTS = 100;

// ─── Checks: what can the player announce right now? ───────────────────────

/**
 * Returns all C+R pairs in the given hand that haven't been announced yet.
 * Returns array of suit ids.
 */
function getAvailablePairs(hand, owner) {
  const pairs = [];
  for (const suit of SUITS) {
    const hasCaballo = hand.some(c => c.suit === suit.id && c.label === 'C');
    const hasRey = hand.some(c => c.suit === suit.id && c.label === 'R');
    const pairKey = `${suit.id}-CR`;
    if (hasCaballo && hasRey && !game.announced[owner].includes(pairKey)) {
      pairs.push(suit.id);
    }
  }
  return pairs;
}

/**
 * Returns true if the owner can declare tute (all C or all R, not yet declared).
 */
function canDeclareTute(hand, owner) {
  if (game.announced.tuteDeclared[owner]) return false;
  const allCaballos = SUITS.every(s => hand.some(c => c.suit === s.id && c.label === 'C'));
  const allReyes = SUITS.every(s => hand.some(c => c.suit === s.id && c.label === 'R'));
  return allCaballos || allReyes;
}

/**
 * Returns the card rank needed to swap the current trump card.
 * High cards (A, 3, R, C, S) can be swapped by the '7'.
 * Low cards (7, 6, 5, 4, 2) can be swapped by the '2'.
 */
function getSwapCardLabel(trumpCard) {
  if (!trumpCard) return null;
  if (['A', '3', 'R', 'C', 'S'].includes(trumpCard.label)) {
    return '7';
  }
  if (['7', '6', '5', '4', '2'].includes(trumpCard.label)) {
    return '2';
  }
  return null;
}

/**
 * Returns true if the hand has the appropriate card to swap the trump card.
 */
function canSwapTrump(hand) {
  if (!game.trump || game.stock.length === 0) return false;
  const neededLabel = getSwapCardLabel(game.trump);
  if (!neededLabel) return false;
  return hand.some(c => c.suit === game.trumpSuit && c.label === neededLabel);
}

// ─── CPU announcement logic ─────────────────────────────────────────────────

function cpuAnnounce() {
  // CPU announces all available pairs and tute
  const pairs = getAvailablePairs(game.cpuHand, 'cpu');
  for (const suitId of pairs) {
    const pts = (suitId === game.trumpSuit) ? CANTAR_POINTS_TRUMP : CANTAR_POINTS_NONTRUMP;
    game.cpuScore += pts;
    game.announced.cpu.push(`${suitId}-CR`);
    const suitInfo = SUITS.find(s => s.id === suitId);
    showMessage(`CPU canta ${suitId === game.trumpSuit ? '40' : '20'} de ${suitInfo ? suitInfo.name : suitId}! (+${pts})`, 1800, '#f99');
  }
  if (canDeclareTute(game.cpuHand, 'cpu')) {
    game.cpuScore += TUTE_POINTS;
    game.announced.tuteDeclared.cpu = true;
    showMessage('¡¡CPU hace TUTE!! (+100)', 2500, '#f66');
    game.phase = 'finished';
  }
  // CPU swaps the trump card if it can (either 7 or 2 depending on the trump card)
  if (game.trump && game.stock.length > 0 && canSwapTrump(game.cpuHand)) {
    const neededLabel = getSwapCardLabel(game.trump);
    const idx = game.cpuHand.findIndex(c => c.suit === game.trumpSuit && c.label === neededLabel);
    if (idx !== -1) {
      const oldTrump = game.trump;
      game.trump = game.cpuHand[idx];
      game.cpuHand[idx] = oldTrump;
      // Make sure the stock tail reflects the new trump card
      game.stock[game.stock.length - 1] = game.trump;
      showMessage(`CPU cambia el ${neededLabel} de triunfo`, 1800, '#aef');
    }
  }
}

// ─── Player announcement actions ────────────────────────────────────────────

function playerCantar() {
  // Only during 'announce' phase (just won a baza, before leading)
  if (game.phase !== 'announce') return;
  const pairs = getAvailablePairs(game.playerHand, 'player');
  if (pairs.length === 0) {
    showMessage('No tienes ningún par Caballo+Rey para cantar', 1600, '#fa0');
    return;
  }
  for (const suitId of pairs) {
    const pts = (suitId === game.trumpSuit) ? CANTAR_POINTS_TRUMP : CANTAR_POINTS_NONTRUMP;
    game.playerScore += pts;
    game.announced.player.push(`${suitId}-CR`);
    const suitInfo = SUITS.find(s => s.id === suitId);
    showMessage(`¡Cantas ${suitId === game.trumpSuit ? '40' : '20'} de ${suitInfo ? suitInfo.name : suitId}! (+${pts})`, 1800, '#ffe066');
  }
  updateButtons();
  render();
}

function playerTute() {
  if (game.phase !== 'announce') return;
  if (!canDeclareTute(game.playerHand, 'player')) {
    showMessage('No tienes todos los caballos ni todos los reyes', 1600, '#fa0');
    return;
  }
  game.playerScore += TUTE_POINTS;
  game.announced.tuteDeclared.player = true;
  showMessage('¡¡TUTE!! ¡Ganaste la partida! (+100)', 2500, '#ffe066');
  game.phase = 'finished';
  updateButtons();
  render();
}

function playerSwapTrump() {
  if (game.phase !== 'announce') return;
  if (!canSwapTrump(game.playerHand)) {
    showMessage('No puedes cambiar el triunfo ahora', 1600, '#fa0');
    return;
  }
  const neededLabel = getSwapCardLabel(game.trump);
  const idx = game.playerHand.findIndex(c => c.suit === game.trumpSuit && c.label === neededLabel);
  const oldTrump = game.trump;
  game.trump = game.playerHand[idx];
  game.playerHand[idx] = oldTrump;
  // Update the last card in the stock to reflect the new trump
  game.stock[game.stock.length - 1] = game.trump;
  sortHand(game.playerHand);
  showMessage(`¡Cambias el ${neededLabel} por el triunfo!`, 1800, '#afe');
  updateButtons();
  render();
}

// ─── After winning a baza, enter 'announce' phase for the winner ────────────

function enterAnnouncePhase(winner) {
  if (winner === 'player') {
    game.phase = 'announce';
    updateButtons();
    render();
    // Player must click "Continuar" (or just play a card) to proceed
    // Buttons are enabled; player manually presses Cantar/Tute or plays directly
  } else {
    // CPU announces then leads
    cpuAnnounce();
    if (game.phase === 'finished') {
      render();
      return;
    }
    game.phase = 'playing';
    updateButtons();
    setTimeout(() => cpuLead(), 800);
  }
}

// ─── Button state management ────────────────────────────────────────────────

function updateButtons() {
  const cantarBtn = document.getElementById('cantar');
  const tuteBtn = document.getElementById('tute');
  const swapBtn = document.getElementById('cambiar');

  const isAnnounce = game.phase === 'announce';

  if (cantarBtn) {
    const hasPairs = getAvailablePairs(game.playerHand, 'player').length > 0;
    cantarBtn.disabled = !(isAnnounce && hasPairs);
    cantarBtn.style.opacity = cantarBtn.disabled ? '0.4' : '1';
  }
  if (tuteBtn) {
    const hasTute = canDeclareTute(game.playerHand, 'player');
    tuteBtn.disabled = !(isAnnounce && hasTute);
    tuteBtn.style.opacity = tuteBtn.disabled ? '0.4' : '1';
  }
  if (swapBtn) {
    swapBtn.disabled = !(isAnnounce && canSwapTrump(game.playerHand));
    swapBtn.style.opacity = swapBtn.disabled ? '0.4' : '1';
  }
}

// ─── Empty slot helper ───────────────────────────────────────────────────────
function drawEmptySlot(x, y, label) {
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
  ctx.setLineDash([]);
  if (label) {
    ctx.fillStyle = '#444';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2);
  }
}

// ─── Render ──────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2d6b2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Announce-phase highlight banner
  if (game.phase === 'announce') {
    ctx.fillStyle = 'rgba(255, 220, 50, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffe066';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('¡Ganaste la baza! Puedes cantar, hacer tute o cambiar el triunfo antes de liderar.', canvas.width / 2, canvas.height / 2 - 150);
    ctx.textBaseline = 'alphabetic';
  }

  const stockX = PADDING;
  const stockY = PADDING + (game.phase === 'announce' ? 24 : 0);
  const trumpX = stockX + CARD_WIDTH + 20;
  const trumpY = stockY;

  if (game.stock.length > 0) {
    game.stock[0].draw(ctx, stockX, stockY, false);
  } else {
    drawEmptySlot(stockX, stockY);
  }

  // Highlight the trump card if player can swap it
  const canSwap = game.phase === 'announce' && canSwapTrump(game.playerHand);

  if (game.trump) {
    game.trump.draw(ctx, trumpX, trumpY, true, canSwap);
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Triunfo', trumpX, trumpY + CARD_HEIGHT + 18);
    if (canSwap) {
      ctx.fillStyle = '#ffe066';
      ctx.font = 'bold 13px Arial';
      ctx.fillText('← clic para cambiar', trumpX, trumpY + CARD_HEIGHT + 36);
    }
  } else if (game.trumpSuit) {
    const suitInfo = SUITS.find(s => s.id === game.trumpSuit);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(suitInfo ? suitInfo.symbol : game.trumpSuit, trumpX + CARD_WIDTH / 2, trumpY + CARD_HEIGHT / 2);
    ctx.font = '14px Arial';
    ctx.fillText('Triunfo', trumpX + CARD_WIDTH / 2, trumpY + CARD_HEIGHT / 2 + 30);
    ctx.textBaseline = 'alphabetic';
  }

  ctx.fillStyle = '#fff';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Tus puntos: ${game.playerScore}`, 1020, 28);
  ctx.fillText(`CPU puntos: ${game.cpuScore}`, 1020, 52);
  ctx.fillText(`Turno: ${game.turn === 'player' ? 'Jugador' : 'CPU'}`, 1020, 76);
  ctx.fillText(`Mazo: ${game.stock.length}`, 1020, 100);

  // CPU hand (face down)
  let start = (CANVAS_WIDTH / 2) - 20 * game.cpuHand.length;
  for (let i = 0; i < game.cpuHand.length; i++) {
    game.cpuHand[i].draw(ctx, start + i * 40, 10, false);
  }

  // Player hand
  start = (CANVAS_WIDTH / 2) - 50 * game.playerHand.length;
  for (let i = 0; i < game.playerHand.length; i++) {
    game.playerHand[i].draw(ctx, start + i * 100, HAND_Y, true);
  }

  // Trick area
  const trickBaseX = 520;
  const trickBaseY = 240;

  if (game.trick[0]) game.trick[0].draw(ctx, trickBaseX, trickBaseY, true);
  else drawEmptySlot(trickBaseX, trickBaseY);

  if (game.trick[1]) game.trick[1].draw(ctx, trickBaseX + CARD_WIDTH + 20, trickBaseY, true);
  else drawEmptySlot(trickBaseX + CARD_WIDTH + 20, trickBaseY);

  // Active message overlay
  if (activeMessage) {
    const msgW = 520, msgH = 56;
    const msgX = (canvas.width - msgW) / 2;
    const msgY = canvas.height / 2 - 150;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    roundRect(ctx, msgX, msgY, msgW, msgH, 12);
    ctx.fill();
    ctx.strokeStyle = activeMessage.color;
    ctx.lineWidth = 2.5;
    roundRect(ctx, msgX, msgY, msgW, msgH, 12);
    ctx.stroke();
    ctx.fillStyle = activeMessage.color;
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(activeMessage.text, canvas.width / 2, msgY + msgH / 2);
    ctx.restore();
  }

  // End screen
  if (game.phase === 'finished') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Partida terminada', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '24px Arial';
    ctx.fillText(`Tus puntos: ${game.playerScore}  |  CPU: ${game.cpuScore}`, canvas.width / 2, canvas.height / 2 + 15);
    const winMsg = game.playerScore > game.cpuScore ? '¡Ganaste!' : game.playerScore < game.cpuScore ? 'Ganó la CPU' : 'Empate';
    ctx.fillText(`Ganador: ${winMsg}`, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('Pulsa para volver a jugar', canvas.width / 2, canvas.height / 2 + 90);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Gameplay helpers ────────────────────────────────────────────────────────
function getCardIndexAt(x, y) {
  for (let i = 0; i < game.playerHand.length; i++) {
    if (game.playerHand[i].isClicked(x, y)) return i;
  }
  return -1;
}

/**
 * Checks whether the trump card on the stock is being clicked (for swap).
 */
function isTrumpClicked(x, y) {
  if (!game.trump) return false;
  const stockX = PADDING;
  const stockY = PADDING + (game.phase === 'announce' ? 24 : 0);
  const trumpX = stockX + CARD_WIDTH + 20;
  const trumpY = stockY;
  return x >= trumpX && x <= trumpX + CARD_WIDTH && y >= trumpY && y <= trumpY + CARD_HEIGHT;
}

function playerCanPlay(card) {
  if (game.phase !== 'playing' && game.phase !== 'announce') return false;
  const leadCard = game.trick[0];
  if (!leadCard) return true; // leading: any card ok

  // When stock is empty: obligación de ganar si se puede
  if (game.stock.length === 0) {
    // Must follow suit and beat if possible
    const sameSuit = game.playerHand.filter(c => c.suit === leadCard.suit);
    const winning = sameSuit.filter(c => c.rank > leadCard.rank);
    if (winning.length > 0) return winning.includes(card);
    if (sameSuit.length > 0) return card.suit === leadCard.suit;
    // No same suit: must trump if possible
    const trumpCards = game.playerHand.filter(c => c.suit === game.trumpSuit);
    if (leadCard.suit !== game.trumpSuit && trumpCards.length > 0) return card.suit === game.trumpSuit;
    return true; // no option
  }

  // Stock not empty: may play any card of lead suit or trump, else anything
  if (card.suit === leadCard.suit || card.suit === game.trumpSuit) return true;
  for (let i = 0; i < game.playerHand.length; i++) {
    const option = game.playerHand[i];
    if (option.suit === leadCard.suit || option.suit === game.trumpSuit) return false;
  }
  return true;
}

function removeCardFromHand(hand, index) {
  return hand.splice(index, 1)[0];
}

function chooseCpuLead() {
  return game.cpuHand.reduce((best, card) => {
    if (!best) return card;
    if (card.points > best.points) return card;
    return best;
  }, null);
}

function chooseCpuResponse(leadCard) {
  const sameSuit = game.cpuHand.filter(card => card.suit === leadCard.suit);
  const trumpCards = game.cpuHand.filter(card => card.suit === game.trumpSuit);

  if (game.stock.length === 0) {
    // Obligación de ganar
    const winning = sameSuit.filter(c => c.rank > leadCard.rank);
    if (winning.length > 0) return winning.reduce((a, b) => a.rank < b.rank ? a : b);
    if (sameSuit.length > 0) return sameSuit.reduce((a, b) => a.rank < b.rank ? a : b);
    if (leadCard.suit !== game.trumpSuit && trumpCards.length > 0) return trumpCards.reduce((a, b) => a.rank < b.rank ? a : b);
    return game.cpuHand.reduce((a, b) => a.points < b.points ? a : b);
  }

  let chosen;
  if (sameSuit.length > 0) {
    const stronger = sameSuit.filter(card => card.rank > leadCard.rank);
    chosen = stronger.length > 0
      ? stronger.reduce((a, b) => a.rank < b.rank ? a : b)
      : sameSuit.reduce((a, b) => a.rank < b.rank ? a : b);
  } else if (trumpCards.length > 0) {
    chosen = trumpCards.reduce((a, b) => a.rank < b.rank ? a : b);
  } else {
    chosen = game.cpuHand.reduce((a, b) => a.points < b.points ? a : b);
  }
  return chosen;
}

function canBeat(card, other) {
  if (card.suit === other.suit) return card.rank > other.rank;
  if (card.suit === game.trumpSuit && other.suit !== game.trumpSuit) return true;
  return false;
}

function collectTrick(winner) {
  const trickCards = [game.trick[0], game.trick[1]].filter(Boolean);
  const points = trickCards.reduce((sum, card) => sum + card.points, 0);
  if (winner === 'player') {
    game.playerScore += points;
  } else {
    game.cpuScore += points;
  }
}

function drawFromStock(winner) {
  if (game.stock.length === 0) return;
  const loser = winner === 'player' ? 'cpu' : 'player';

  const winnerCard = game.stock.shift();
  if (winner === 'player') {
    game.playerHand.push(winnerCard);
  } else {
    game.cpuHand.push(winnerCard);
  }

  if (game.stock.length > 0) {
    const loserCard = game.stock.shift();
    if (loser === 'player') {
      game.playerHand.push(loserCard);
    } else {
      game.cpuHand.push(loserCard);
    }
  }

  // Once stock empty, the trump card (last card) has been distributed — clear the reference
  if (game.stock.length === 0) {
    game.trump = null;
  }

  sortHand(game.playerHand);
  sortHand(game.cpuHand);
}

function evaluateTrick() {
  const leadCard = game.trick[0];
  const followCard = game.trick[1];
  if (!leadCard || !followCard) return;

  let winner = game.trickLeaders[0];
  if (canBeat(followCard, leadCard)) {
    winner = game.trickLeaders[1];
  }

  collectTrick(winner);

  // Last trick bonus (10 points)
  if (game.stock.length === 0 && game.playerHand.length === 0 && game.cpuHand.length === 0) {
    if (!game.lastTrickBonus) {
      if (winner === 'player') game.playerScore += 10;
      else game.cpuScore += 10;
      game.lastTrickBonus = true;
    }
  }

  game.trick = [null, null];
  game.trickLeaders = [null, null];

  if (game.stock.length > 0) drawFromStock(winner);

  game.turn = winner;

  // Check if hands are empty → finished
  if (game.playerHand.length === 0 && game.cpuHand.length === 0) {
    game.phase = 'finished';
    updateButtons();
    render();
    return;
  }

  // Enter announce phase for the winner (player or cpu)
  enterAnnouncePhase(winner);
}

// ─── CPU turn ────────────────────────────────────────────────────────────────
function cpuLead() {
  if (game.phase !== 'playing') return;
  if (game.cpuHand.length === 0) {
    game.phase = 'finished';
    updateButtons();
    render();
    return;
  }
  const card = chooseCpuLead();
  const index = game.cpuHand.indexOf(card);
  const played = removeCardFromHand(game.cpuHand, index);
  game.trick[0] = played;
  game.trickLeaders[0] = 'cpu';
  game.turn = 'player';
  render();
}

// ─── Player turn ─────────────────────────────────────────────────────────────
function playerPlay(index) {
  const allowedPhases = ['playing', 'announce'];
  if (!allowedPhases.includes(game.phase)) return;
  const card = game.playerHand[index];
  if (!playerCanPlay(card)) {
    showMessage('No puedes jugar esa carta', 1200, '#fa0');
    render();
    return;
  }

  // Playing a card while in 'announce' means the player skipped announcing
  if (game.phase === 'announce') game.phase = 'playing';

  if (game.turn === 'player' && !game.trick[0]) {
    // Player leads
    game.trick[0] = removeCardFromHand(game.playerHand, index);
    game.trickLeaders[0] = 'player';
    const response = chooseCpuResponse(game.trick[0]);
    const cpuIndex = game.cpuHand.indexOf(response);
    game.trick[1] = removeCardFromHand(game.cpuHand, cpuIndex);
    game.trickLeaders[1] = 'cpu';
    render();
    setTimeout(() => evaluateTrick(), 2000);
  } else {
    // Player responds to CPU lead
    game.trick[1] = removeCardFromHand(game.playerHand, index);
    game.trickLeaders[1] = 'player';
    render();
    setTimeout(() => evaluateTrick(), 400);
  }

  updateButtons();
}

// ─── Click handler ───────────────────────────────────────────────────────────
canvas.addEventListener('click', (e) => {
  if (game.phase === 'finished') {
    initGame();
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  // Click on trump card during announce phase → swap
  if (game.phase === 'announce' && isTrumpClicked(x, y) && canSwapTrump(game.playerHand)) {
    playerSwapTrump();
    return;
  }

  if (game.turn === 'player') {
    const cardIndex = getCardIndexAt(x, y);
    if (cardIndex >= 0) playerPlay(cardIndex);
  }
});

// ─── Button wiring ───────────────────────────────────────────────────────────
const newGameBtn = document.getElementById('newGameBtn');
if (newGameBtn) {
  newGameBtn.addEventListener('click', () => { initGame(); });
}

const cantarBtn = document.getElementById('cantar');
if (cantarBtn) {
  cantarBtn.addEventListener('click', () => { playerCantar(); });
}

const tuteBtn = document.getElementById('tute');
if (tuteBtn) {
  tuteBtn.addEventListener('click', () => { playerTute(); });
}

// "Cambiar triunfo" button
const swapBtn = document.getElementById('cambiar');
if (swapBtn) {
  swapBtn.addEventListener('click', () => { playerSwapTrump(); });
}

updateButtons();
initGame();