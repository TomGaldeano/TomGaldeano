  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 600;
  const CARD_WIDTH = 70;
  const CARD_HEIGHT = 100;
  const SUITS = ['♠', '♥', '♦', '♣'];
  const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const FACE = ['J', 'Q', 'K']

  const canvas = document.getElementById('blackjackCanvas');
  const ctx = canvas.getContext('2d');
  const dealBtn = document.getElementById('deal-btn');
  const hitBtn = document.getElementById('hit-btn');
  const standBtn = document.getElementById('stand-btn');
  const newBtn = document.querySelector("#new-btn")
  let PlayerScore = 0
  let HouseScore = 0
  const player = document.querySelector("#player")
  const house = document.querySelector("#house")

  let deck = [];
  let playerHand = [];
  let dealerHand = [];
    let gameOver=false;
  let message = "";

  class Card {
    constructor(suit, value) {
      this.suit = suit;
      this.value = value;
    }
    getColor() {
      return (this.suit === '♥' || this.suit === '♦') ? 'red' : 'black';
    }
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
  }

  function createDeck() {
    let deck = [];
    for (let i = 0; i < VALUES.length; i++) {
      for (let j = 0; j < SUITS.length; j++) {
        deck.push(new Card(SUITS[j], VALUES[i]));
      }
    }
    return shuffle(deck);
  }

  function calculateScore(hand) {
    let sum = 0;
    let numAces = 0;
    hand.forEach(element => {
      if (FACE.includes(element.value)) {
        sum += 10;
      } else if (element.value == 'A') {
        sum += 11;
        numAces++;
      } else {
        sum += parseInt(element.value);
      }
    });
    while (sum > 21 && numAces > 0) {
      sum -= 10;
      numAces--;
    }
    return sum;
  }

  function drawCard(card, x, y, isHidden = false) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    if (isHidden) {
      for (let i = 0; i < 15; i++) {
        if (i % 2 == 0) {
          ctx.fillStyle = 'white';
        } else {
          ctx.fillStyle = 'black';
        }

        ctx.fillRect(x + 2.5 * i, y + 2.5 * i, CARD_WIDTH - 5 * i, CARD_HEIGHT - 5 * i);
      }

    } else {
      ctx.fillStyle = card.getColor();
      ctx.font = 'bolder 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(card.value, x + 16, y + 18);
      ctx.fillText(card.value, x + CARD_WIDTH - 16, y + CARD_HEIGHT - 18);
      ctx.font = '50px Arial';
      ctx.fillText(card.suit, x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2);
    }
  }


  function drawTable() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let start=(CANVAS_WIDTH/2)-40*dealerHand.length
    for (let index = 0; index < dealerHand.length; index++) {
      drawCard(dealerHand[index], start + index * 80, 10);
    }
    start=(CANVAS_WIDTH/2)-40*playerHand.length
    for (let index = 0; index < playerHand.length; index++) {
      drawCard(playerHand[index], start + index * 80, 490);
    }

    if (gameOver) {
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(message, 600, 300);
    }
  }

  function startNewGame() {
    deck = createDeck();
    playerHand = [];
    dealerHand = [];
    message = "";

    playerHand.push(deck.pop(), deck.pop())
    dealerHand.push(deck.pop(), deck.pop())
    if (calculateScore(playerHand) == 21) {
      gameOver = true;
      message = "Blackjack"
      PlayerScore++
      player.innerHTML=HouseScoree
    }else if (calculateScore(dealerHand) == 21) {
      gameOver = true;
      message = "You lose"
      HouseScore++
      house.innerHTML=HouseScore
    }
  if (!gameOver) {
    newBtn.disabled = true;
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
  }else{
    dealBtn.disabled = false;
  }

    drawTable();
  }

  function hit() {
    if (gameOver) return;
    if (deck.length < 5) {
      return
    }
    playerHand.push(deck.pop())
    if (calculateScore(playerHand) > 21) {
      gameOver = true;
      message = "You bust"
      HouseScore++
      house.innerHTML=HouseScore
    }
    else if (calculateScore(playerHand) == 21) {
      message = "Blackjack"
      gameOver = true
      PlayerScore++
      player.innerHTML=PlayerScore
    }
    
    if (gameOver) {
      newBtn.disabled = false;
      dealBtn.disabled = false;
      hitBtn.disabled = true;
      standBtn.disabled = true;
    }
    drawTable();
  }

  function stand() {
    console.log(gameOver)
    if (gameOver) return;
    while (calculateScore(dealerHand) <= 17) dealerHand.push(deck.pop());
    if (calculateScore(dealerHand) > 21 || calculateScore(dealerHand) < calculateScore(playerHand)) {
      message = "You win"
      PlayerScore++
      player.innerHTML=PlayerScore
    }
    else {
      message = "You Lose"
      HouseScore++
      house.innerHTML=HouseScore
    }
    gameOver = true;
    newBtn.disabled = false;
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    drawTable();
  }

  function deal() {
    playerHand = []
    dealerHand = []
    playerHand.push(deck.pop(), deck.pop())
    dealerHand.push(deck.pop(), deck.pop())
    gameOver = false
    if (calculateScore(playerHand) == 21) {
      gameOver = true;
      message = "Blackjack"
      PlayerScore++
      player.innerHTML=HouseScore
    }else if (calculateScore(dealerHand) == 21) {
      gameOver = true;
      message = "You lose"
      HouseScore++
      house.innerHTML=HouseScore
    }
      if (!gameOver){
      newBtn.disabled = true;
      dealBtn.disabled = true;
      hitBtn.disabled = false;
      standBtn.disabled = false;
          
    }
    drawTable(); 
  }

  newBtn.addEventListener('click', startNewGame);
  hitBtn.addEventListener('click', hit);
  standBtn.addEventListener('click', stand);
  dealBtn.addEventListener("click", deal)

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Press 'New Game' to Start", 425, 300);