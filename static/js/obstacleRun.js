const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const TOP = 15;
const BOTTOM= 585;
const canvas = document.querySelector('#runCanvas');
const ctx = canvas.getContext('2d');

// Difficulty settings
let difficultySettings = {
  easy: { obstacleSpeed: 12, spawnRate: 60, count: 2},
  medium: { obstacleSpeed: 16, spawnRate: 40,count: 3},
  hard: { obstacleSpeed: 16, spawnRate: 30, count: 4},
  hell: { obstacleSpeed: 20, spawnRate: 25, count: 5}
};
let currentDifficulty = null;

class Runner {
  constructor() {
    this.height = 30;
    this.width = 20;
    this.x = 60;
    this.y = CANVAS_HEIGHT / 2;
    this.speed = 8;
    this.moving = false;
  }

  draw() {
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x + 3, this.y + 8, 4, 4);
    ctx.fillRect(this.x + 13, this.y + 8, 4, 4);
  }

  moveUp() {
    if (this.y > TOP) {
      this.y -= this.speed;
    }
  }

  moveDown() {
    if (this.y + this.height < BOTTOM) {
      this.y += this.speed;
    }
  }

  collidesWith(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    );
  }
}

class Obstacle {
  constructor(speed) {
    this.width = 30;
    this.height = 50;
    this.x = CANVAS_WIDTH;
    this.y = Math.random() * (BOTTOM- TOP - this.height) + TOP;
    this.speed = speed;
    this.color = 'red';
  }
  
  collidesWith(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    );
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#FFB700';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speed;
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }
}

class Game {
  constructor() {
    this.iter = 0;
    this.runner = new Runner();
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    this.obstacleSpawnCounter = 0;
    this.keysPressed = {};
    
    // Keyboard event listeners
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.key] = true;
      if (e.key === ' ') e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.key] = false;
    });
  }

  handleInput() {
    if (this.keysPressed['w'] || this.keysPressed['W']) {
      this.runner.moveUp();
    }
    if (this.keysPressed['s'] || this.keysPressed['S']) {
      this.runner.moveDown();
    }
  }

  spawnObstacle() {
    if (!currentDifficulty) return;
    this.obstacleSpawnCounter++;
    if (this.obstacleSpawnCounter < difficultySettings[currentDifficulty].spawnRate) {
      return;
    }
    let new_obstacles = [];
    let collision = false;
    while (new_obstacles.length < difficultySettings[currentDifficulty].count) {
      collision = false;
      let newObstacle = new Obstacle(difficultySettings[currentDifficulty].obstacleSpeed);
      for (let i = 0; i < new_obstacles.length; i++) {
        if (newObstacle.collidesWith(new_obstacles[i])) {
          collision = true;
          break;
        }
      }
      if (!collision) {
        new_obstacles.push(newObstacle);
      }
    }
    this.obstacles.push(...new_obstacles);
    this.obstacleSpawnCounter = 0;
  }
  

  checkCollisions() {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      if (this.runner.collidesWith(this.obstacles[i])) {
        this.gameOver = true;
      }
    }
  }

  updateScore() {
    document.getElementById('score').textContent = `Score: ${this.score}`;
  }

  draw_landscape() {
    if (this.gameOver) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw animated ground stripes
    this.iter++;
    if (this.iter > 40) {
      this.iter = 0;
    }
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = 'white';
      ctx.fillRect(20 - this.iter + i * 40, CANVAS_HEIGHT - 10, 20, 10);
      ctx.fillRect(20 - this.iter + i * 40, 0, 20, 10);
      ctx.fillStyle = 'red';
      ctx.fillRect(0 - this.iter + i * 40, CANVAS_HEIGHT - 10, 20, 10);
      ctx.fillRect(0 - this.iter + i * 40, 0, 20, 10);
    }

    // Handle input
    this.handleInput();

    // Update and draw obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].update();
      this.obstacles[i].draw();

      if (this.obstacles[i].isOffScreen()) {
        this.obstacles.splice(i, 1);
        this.score += 10;
        this.updateScore();
      }
    }

    // Spawn new obstacles
    this.spawnObstacle();

    // Draw runner
    this.runner.draw();

    // Check collisions
    this.checkCollisions();

    // Draw game over screen
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.fillStyle = '#FFFF00';
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }
  }

  restart() {
    this.runner = new Runner();
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    this.obstacleSpawnCounter = 0;
    this.updateScore();
  }
}

const game = new Game();

function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  game.restart();
}

// Game loop
setInterval(() => {
  game.draw_landscape();
}, 40);