/**
 * BLACKJACK CANVAS GAME SKELETON
 * ==============================
 * 
 * This file contains the structure for your Blackjack game.
 * Your workspace is to fill in the methods to make the game functional.
 * Follow the steps in `blackjack_guide.md`.
 */

// --- CONFIGURATION ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CARD_WIDTH = 100;
const CARD_HEIGHT = 145;
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// --- DOM ELEMENTS ---
const canvas = document.getElementById('blackjackCanvas');
const ctx = canvas.getContext('2d');
const dealBtn = document.getElementById('deal-btn');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');

// --- GAME STATE ---
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = true;
let message = ""; // To display "You Win!", "Bust!", etc.

// --- CLASSES ---

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    /**
     * Helper to get color based on suit.
     */
    getColor() {
        return (this.suit === '♥' || this.suit === '♦') ? 'red' : 'black';
    }
}

// --- FUNCTIONS TO IMPLEMENT ---

/**
 * 1. Initialize the Deck
 * Creates a standard 52-card deck and shuffles it.
 * Returns: Array of Card objects
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap
  }
  return array;
}
function createDeck() {
    // TODO: Shuffle the deck array.
    let deck = [];
    for(let i=0;i<VALUES.length;i++){
        for(let j=0;j<SUITS.length;j++){
            deck.push(new Card(SUITS[j],VALUES[i]));
        }
    }
    return shuffle(deck);
}

/**
 * 2. Calculate Hand Score
 * Calculates the total value of a hand.
 * Rules:
 * - Number cards = face value
 * - Face cards (J, Q, K) = 10
 * - Aces = 1 or 11 (whichever is better for the player without busting)
 */
function calculateScore(hand) {
    // TODO: Implement score logic
    return 0;
}

/**
 * 3. Drawing functions
 */

function drawCard(card, x, y, isHidden = false) {
    // TODO: Draw a single card at (x, y). 
    // If isHidden is true, draw the back of the card.
    // Use ctx.rect, ctx.fillStyle, ctx.fillText, etc.
    width = 100;
    height=150;
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    if (isHidden){
        for( let i =0;i<21;i++){
            if(i%2==0){
                        ctx.fillStyle = 'white';
            }else{
                        ctx.fillStyle = 'black';
            }

        ctx.fillRect(x+2.5*i, y+2.5*i, width-5*i, height-5*i);

        }

    }else{
        ctx.fillStyle = card.getColor();
        ctx.font = 'bolder 25px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(card.value, x +20, y +22);
        ctx.fillText(card.value, x + width -20, y +height -22);
        ctx.font = '75px Arial';
        ctx.fillText(card.suit, x + width/2, y +height/2);


    }
}
deck = createDeck()
drawCard(deck[0],200,200,true)

function drawTable() {
    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // TODO: Draw Dealer's hand

    // TODO: Draw Player's hand

    // TODO: Draw Scores

    // TODO: Draw Message (if gameOver)
}

/**
 * 4. Game Action Functions
 */

function startNewGame() {
    console.log("Starting new game...");
    deck = createDeck();
    playerHand = [];
    dealerHand = [];
    gameOver = false;
    message = "";

    // Deal initial cards
    // TODO: Push 2 cards to playerHand and 2 to dealerHand (pop from deck)

    // Update UI buttons
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;

    drawTable();
}

function hit() {
    if (gameOver) return;

    // TODO: Add card to player hand

    // TODO: Check for Bust (score > 21) -> End game if bust

    drawTable();
}

function stand() {
    if (gameOver) return;

    // TODO: Dealer plays (Dealer must hit on soft 17 or less, stand on 17+, logic varies but keep it simple: hit until >= 17)

    // TODO: Determine Winner

    gameOver = true;
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;

    drawTable();
}

// --- EVENT LISTENERS ---
dealBtn.addEventListener('click', startNewGame);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);

// Initial Draw
ctx.fillStyle = "white";
ctx.font = "30px Arial";
ctx.fillText("Press 'New Game' to Start", 250, 300);
