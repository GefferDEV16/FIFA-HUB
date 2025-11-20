let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let playerScore = 0;
let iaScore = 0;
let playerGoal = 5;
let iaGoal = 5;

let playerTeam, iaTeam;
let player = { x: 50, y: 300, width: 40, height: 60, color: 'green', speed: 5 };
let ia = { x: 710, y: 300, width: 40, height: 60, color: 'red', speed: 3 };
let ball = { x: 400, y: 300, radius: 10, dx: 0, dy: 0, speed: 4 };
let keys = { left: false, right: false, up: false, down: false };

let gameOver = false;

function startGame() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('scoreboard').style.display = 'block';
  playerScore = 0;
  iaScore = 0;
  gameOver = false;
  playerTeam = document.getElementById('teamSelection').value;
  iaTeam = getRandomTeam();
  resetGame();
  requestAnimationFrame(update);
}

function getRandomTeam() {
  const teams = ['Real Madrid', 'Barcelona', 'PSG', 'Chelsea', 'Milan', 'Manchester City'];
  return teams[Math.floor(Math.random() * teams.length)];
}

function resetGame() {
  player.x = 50;
  player.y = 300;
  ia.x = 710;
  ia.y = 300;
  ball.x = 400;
  ball.y = 300;
  ball.dx = 0;
  ball.dy = 0;
}

function update() {
  if (gameOver) return;

  movePlayer();
  moveAI();
  moveBall();
  checkCollisions();
  updateScore();
  draw();

  if (playerScore >= playerGoal || iaScore >= iaGoal) {
    gameOver = true;
    showEndGame();
  } else {
    requestAnimationFrame(update);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar o jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Desenhar o adversário
  ctx.fillStyle = ia.color;
  ctx.fillRect(ia.x, ia.y, ia.width, ia.height);

  // Desenhar a bola
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function movePlayer() {
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;
  if (keys.up && player.y > 0) player.y -= player.speed;
  if (keys.down && player.y < canvas.height - player.height) player.y += player.speed;
}

function moveAI() {
  if (ball.y < ia.y + ia.height / 2) ia.y -= ia.speed;
  if (ball.y > ia.y + ia.height / 2) ia.y += ia.speed;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function checkCollisions() {
  // Colisão com as paredes
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.dy = -ball.dy;

  // Colisão com os jogadores
  if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) {
    ball.dx = Math.abs(ball.dx); // Defletir a bola
  }
  if (ball.x + ball.radius > ia.x && ball.y > ia.y && ball.y < ia.y + ia.height) {
    ball.dx = -Math.abs(ball.dx); // Defletir a bola
  }

  // Gol
  if (ball.x - ball.radius < 0) {
    iaScore++;
    resetGame();
  }
  if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    resetGame();
  }
}

function updateScore() {
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('iaScore').textContent = iaScore;
}

function showEndGame() {
  document.getElementById('endgame').style.display = 'block';
  let result = playerScore >= playerGoal ? 'Vitória' : 'Derrota';
  document.getElementById('resultText').textContent = `${result} - Campeão do Mundial de Clubes`;
}

function restartGame() {
  document.getElementById('endgame').style.display = 'none';
  startGame();
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') keys.left = true;
  if (event.key === 'ArrowRight') keys.right = true;
  if (event.key === 'ArrowUp') keys.up = true;
  if (event.key === 'ArrowDown') keys.down = true;
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'ArrowLeft') keys.left = false;
  if (event.key === 'ArrowRight') keys.right = false;
  if (event.key === 'ArrowUp') keys.up = false;
  if (event.key === 'ArrowDown') keys.down = false;
});
