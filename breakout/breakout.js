const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let lives = 3;

// ball position
const ballRadius = 10;
let ballPositionX = canvas.width / 2;
let ballPositionY = canvas.height - 30;
let ballPositionChangeX = 2;
let ballPositionChangeY = -2;
let ballColor = randomHexColor();

// paddle
const paddleHeight = 10;
const paddleWidth = 500;
let paddleX = (canvas.width - paddleWidth) / 2;
let movePaddleRight = false;
let movePaddleLeft = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickHitPoints = 2;

const bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: brickHitPoints };
  }
}

function randomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status > 0) {
        if (ballPositionX > b.x && ballPositionX < b.x + brickWidth && ballPositionY > b.y && ballPositionY < b.y + brickHeight) {
          ballPositionChangeY = -ballPositionChangeY;
          ballColor = randomHexColor();
          b.status--;
          score++;
          if (score == brickRowCount * brickColumnCount * brickHitPoints) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballPositionX, ballPositionY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status > 0) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  drawLives();
  drawBricks();
  drawPaddle();
  drawBall();
  collisionDetection();

  if (ballPositionX + ballPositionChangeX > canvas.width - ballRadius || ballPositionX + ballPositionChangeX < ballRadius) {
    ballPositionChangeX = -ballPositionChangeX;
    ballColor = randomHexColor();
  }
  if (ballPositionY + ballPositionChangeY < ballRadius) {
    ballPositionChangeY = -ballPositionChangeY;
    ballColor = randomHexColor();
  } else if (ballPositionY + ballPositionChangeY > canvas.height - ballRadius) {
    if (ballPositionX > paddleX && ballPositionX < paddleX + paddleWidth) {
      ballPositionChangeY = -(ballPositionChangeY * 1.1);
      ballPositionChangeX = ballPositionChangeX * 1.1;
      ballColor = randomHexColor();

    }
    else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        ballPositionX = canvas.width / 2;
        ballPositionChangeY = canvas.height - 30;
        ballPositionChangeX = 2;
        ballPositionChangeY = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  ballPositionX += ballPositionChangeX;
  ballPositionY += ballPositionChangeY;

  if (movePaddleRight && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if (movePaddleLeft && paddleX > 0) {
    paddleX -= 7;
  }

  requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    movePaddleRight = true;
  }
  else if (e.keyCode == 37) {
    movePaddleLeft = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    movePaddleRight = false;
  }
  else if (e.keyCode == 37) {
    movePaddleLeft = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
draw();
