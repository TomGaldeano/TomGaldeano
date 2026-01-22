# Blackjack Implementation Guide

This guide will walk you through building your Blackjack game using the skeleton provided in `blackjack.js`.

## Step 1: The Card Deck (`createDeck`)
**Goal**: Create a shuffled deck of 52 cards.
1.  Inside `createDeck`, use two nested loops: one for `SUITS` and one for `VALUES`.
2.  In the inner loop, create a `new Card(suit, value)` and push it to a temporary deck array.
3.  **Shuffle**: Use the Fisher-Yates shuffle algorithm (or simple random sort) to randomize the array.
    *(Hint: `array.sort(() => Math.random() - 0.5)` is a quick & dirty way, though Fisher-Yates is better).*
4.  Return the shuffled deck.

## Step 2: Drawing Cards (`drawCard`)
**Goal**: Visualize a single card on the Canvas.
1.  **Background**: Draw a white rounded rectangle at `x, y` for the card body. Use `ctx.fillStyle = 'white'` and `ctx.fillRect(...)`.
2.  **Border**: Draw a black border using `ctx.strokeRect(...)`.
3.  **Hidden Cards**: If `isHidden` is true, fill the rectangle with a pattern or solid color (e.g., repeating circles or dark red) and **return early** so you don't draw the numbers.
4.  **Content**:
    -   Set `ctx.fillStyle` to the card's color (red/black).
    -   Draw the `card.value` content in the top-left and bottom-right corners.
    -   Draw the `card.suit` in the center (make it big!).

## Step 3: Game Logic - Score (`calculateScore`)
**Goal**: Calculate the points for a hand.
1.  Start a `sum` variable at 0.
2.  Count the number of Aces (`aceCount`).
3.  Loop through the hand:
    -   **Face cards** (J, Q, K) add 10.
    -   **Aces** add 11 (initially).
    -   **Number cards** add their numeric value (`parseInt(card.value)`).
4.  **Ace Adjustment**: While `sum > 21` and `aceCount > 0`, subtract 10 from the sum and decrement `aceCount`. This handles the "Ace is 1 or 11" rule.
5.  Return the final `sum`.

## Step 4: Core Game Loop (`startNewGame`, `hit`, `stand`)

### `startNewGame()`
-   Already partly set up.
-   **Task**: `pop()` 2 cards from `deck` for the Player, and 2 for the Dealer.
-   Call `drawTable()` to show the initial state.

### `hit()`
-   `pop()` a card from `deck` and push to `playerHand`.
-   Calculate score. If > 21:
    -   Set `gameOver = true`.
    -   Set `message = "BUST! House Wins."`.
    -   Disable Hit/Stand buttons, enable Deal button.
-   Call `drawTable()`.

### `stand()`
-   This is the Dealer's turn.
-   **Loop**: While dealer's score < 17, dealer takes a card (`pop` from deck, push to `dealerHand`).
-   **Compare Scores**:
    -   If Dealer busts (> 21) => Player wins.
    -   If Player > Dealer => Player wins.
    -   If Dealer > Player => Dealer wins.
    -   If Tie => Push.
-   Set `gameOver = true` and update `message`.
-   Call `drawTable()`.

## Step 5: Rendering the Table (`drawTable`)
1.  **Clear**: `ctx.clearRect(...)`.
2.  **Draw Dealer**: Loop through `dealerHand`.
    -   **Crucial**: If `!gameOver`, the dealer's **first card** (index 0) should be `isHidden = true`. Only reveal it when the game is over.
    -   Offset the `x` position for each card so they fan out slightly.
3.  **Draw Player**: Loop through `playerHand` and draw them (all visible).
4.  **Draw Text**:
    -   Show Player's score.
    -   Show Dealer's score (only if `gameOver`, otherwise hide it or show "?").
    -   If `gameOver`, draw the `message` in the center of the screen in a large font.

## Bonus Challenges
-   Add a "Betting" system with chips.
-   Add clear animations (move cards from a "deck pile" to the hand).
-   Handle a true "Blackjack" (Ace + 10/Face on first deal pays 3:2).
