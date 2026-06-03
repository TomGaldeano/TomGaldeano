  const canvas = document.getElementById('tuteCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;
const PADDING = 20;
const HAND_Y = 460;
const SUITS = [
  { id: 'O', symbol: '♦', color: 'black', name: 'Oros' },
  { id: 'C', symbol: '♥', color: 'black', name: 'Copas' },
  { id: 'E', symbol: '♠', color: 'black', name: 'Espadas' },
  { id: 'B', symbol: '♣', color: 'black', name: 'Bastos' }
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

  draw(ctx, x, y, faceUp = true) {
    this.x = x;
    this.y = y;
    ctx.save();
    ctx.fillStyle = faceUp ? '#fff' : '#2a6b3d';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);

    if (faceUp) {
      ctx.fillStyle = this.color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(this.label, x + CARD_WIDTH - 5, y + CARD_HEIGHT - 5);
      ctx.fillText(this.symbol, x + CARD_WIDTH - 55, y + CARD_HEIGHT - 5);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(this.symbol, x + 5, y + 5);
      ctx.fillText(this.label, x + 55, y + 5);
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2);
    } else {
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

const game = {
  playerHand: [],
  cpuHand: [],
  stock: [],
  trump: null,
  trumpSuit: null, // FIX 1: persists after the trump card is physically drawn from stock
  trick: [null, null],
  trickLeaders: [null, null],
  turn: 'player',
  playerScore: 0,
  cpuScore: 0,
  phase: 'playing',
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
  game.trumpSuit = game.trump.suit; // FIX 1: store suit independently from card object
  game.stock = deck;
  game.trick = [null, null];
  game.trickLeaders = [null, null];
  game.turn = 'player';
  game.playerScore = 0;
  game.cpuScore = 0;
  game.phase = 'playing';
  game.lastTrickBonus = false;
  game.announced = { player: [], cpu: [], tuteDeclared: { player: false, cpu: false } }; // FIX 2: reset before render
  sortHand(game.playerHand);
  render();
}

const CANTAR_POINTS_TRUMP = 40;
const CANTAR_POINTS_NONTRUMP = 20;
const TUTE_POINTS = 100;

function checkAnnouncementsForHand(hand, owner) {
  if (!hand || hand.length === 0) return;
  const ownerScoreKey = owner === 'player' ? 'playerScore' : 'cpuScore';
  for (const suit of SUITS) {
    const hasCaballo = hand.some(c => c.suit === suit.id && c.label === 'C');
    const hasRey = hand.some(c => c.suit === suit.id && c.label === 'R');
    const pairKey = `${suit.id}-CR`;
    if (hasCaballo && hasRey && !game.announced[owner].includes(pairKey)) {
      // FIX 1: use game.trumpSuit instead of game.trump.suit (trump card may be gone)
      const pts = (suit.id === game.trumpSuit) ? CANTAR_POINTS_TRUMP : CANTAR_POINTS_NONTRUMP;
      game[ownerScoreKey] += pts;
      game.announced[owner].push(pairKey);
    }
  }
  if (!game.announced.tuteDeclared[owner]) {
    const allCaballos = SUITS.every(s => hand.some(c => c.suit === s.id && c.label === 'C'));
    const allReyes = SUITS.every(s => hand.some(c => c.suit === s.id && c.label === 'R'));
    if (allCaballos || allReyes) {
      game[ownerScoreKey] += TUTE_POINTS;
      game.announced.tuteDeclared[owner] = true;
      game.phase = 'finished';
    }
  }
}

// FIX 3: removed maybeOfferTrumpExchange — it was silently swapping the trump card
// after every trick win, causing the trump to change constantly.

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

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2d6b2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const stockX = PADDING;
  const stockY = PADDING;
  const trumpX = stockX + CARD_WIDTH + 20;
  const trumpY = PADDING;

  if (game.stock.length > 0) {
    game.stock[0].draw(ctx, stockX, stockY, false);
  } else {
    drawEmptySlot(stockX, stockY);
  }

  if (game.trump) {
    // Trump card still in stock — draw it face up
    game.trump.draw(ctx, trumpX, trumpY, true);
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Triunfo', trumpX, trumpY + CARD_HEIGHT + 18);
  } else if (game.trumpSuit) {
    // FIX 4: trump card drawn but suit still matters — show a suit reminder
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
  ctx.fillText(`CPU puntos: ${game.cpuScore}`, 1020, 52);  // FIX 5: show CPU score
  ctx.fillText(`Turno: ${game.turn === 'player' ? 'Jugador' : 'CPU'}`, 1020, 76);

  let start = (CANVAS_WIDTH / 2) - 20 * game.cpuHand.length;
  for (let i = 0; i < game.cpuHand.length; i++) {
    game.cpuHand[i].draw(ctx, start + i * 40, 10, false);
  }
  start = (CANVAS_WIDTH / 2) - 50 * game.playerHand.length;
  for (let i = 0; i < game.playerHand.length; i++) {
    game.playerHand[i].draw(ctx, start + i * 100, HAND_Y, true);
  }

  const trickBaseX = 520;
  const trickBaseY = 240;

  if (game.trick[0]) game.trick[0].draw(ctx, trickBaseX, trickBaseY, true);
  else drawEmptySlot(trickBaseX, trickBaseY);

  if (game.trick[1]) game.trick[1].draw(ctx, trickBaseX + CARD_WIDTH + 20, trickBaseY, true);
  else drawEmptySlot(trickBaseX + CARD_WIDTH + 20, trickBaseY);

  if (game.phase === 'finished') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Partida terminada', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '24px Arial';
    // FIX 5: show both scores in the end screen
    ctx.fillText(`Tus puntos: ${game.playerScore}  |  CPU: ${game.cpuScore}`, canvas.width / 2, canvas.height / 2 + 15);
    ctx.fillText(`Ganador: ${game.playerScore > game.cpuScore ? 'Jugador' : game.playerScore < game.cpuScore ? 'CPU' : 'Empate'}`, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('Pulsa para volver a jugar', canvas.width / 2, canvas.height / 2 + 90);
  }
}

function getCardIndexAt(x, y) {
  for (let i = 0; i < game.playerHand.length; i++) {
    if (game.playerHand[i].isClicked(x, y)) return i;
  }
  return -1;
}

function playerCanPlay(card) {
  if (game.phase !== 'playing') return false;
  const leadCard = game.trick[0];
  if (!leadCard) return true;
  // FIX 1: use trumpSuit — game.trump may be null once its card is drawn
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
  // FIX 1: use trumpSuit — game.trump may be null
  const trumpCards = game.cpuHand.filter(card => card.suit === game.trumpSuit);
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
  // FIX 1: use trumpSuit — game.trump may be null
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
  // FIX 6: removed checkAnnouncementsForHand from here — moved to evaluateTrick
  // so it fires at the right moment (when winner is about to lead), not inside collectTrick
  // FIX 3: removed maybeOfferTrumpExchange call
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

  // FIX 4: once the stock is empty the trump card has been drawn into a hand;
  // null game.trump so the card slot clears, but game.trumpSuit still tells us the suit.
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

  // FIX 6: check announcements here, after turn is assigned and new cards drawn
  checkAnnouncementsForHand(winner === 'player' ? game.playerHand : game.cpuHand, winner);

  if (game.phase === 'finished') {
    render();
    return;
  }

  if (game.playerHand.length === 0 && game.cpuHand.length === 0) {
    game.phase = 'finished';
    render();
    return;
  }

  if (game.turn === 'cpu') {
    render();
    setTimeout(() => cpuLead(), 600);
  } else {
    render();
  }
}

function cpuLead() {
  if (game.phase !== 'playing') return;
  if (game.cpuHand.length === 0) {
    // FIX 7: end the game gracefully instead of calling evaluateTrick with no cards
    game.phase = 'finished';
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

function playerPlay(index) {
  if (game.phase !== 'playing') return;
  const card = game.playerHand[index];
  if (!playerCanPlay(card)) {
    render();
    return;
  }
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
}

canvas.addEventListener('click', (e) => {
  if (game.phase === 'finished') {
    initGame();
    return;
  }

  const rect = canvas.getBoundingClientRect();
  // FIX 8: scale click coordinates to match the canvas internal resolution,
  // so clicks align correctly even when the canvas is CSS-scaled
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  if (game.turn === 'player') {
    const cardIndex = getCardIndexAt(x, y);
    if (cardIndex >= 0) playerPlay(cardIndex);
  }
});

const newGameBtn = document.getElementById('newGameBtn');
if (newGameBtn) {
  newGameBtn.addEventListener('click', () => {
    initGame();
  });
}

initGame();