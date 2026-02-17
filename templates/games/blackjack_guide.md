# Blackjack Implementation Guide

This guide will walk you through building your Blackjack game using the skeleton provided in `blackjack.js`.


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
