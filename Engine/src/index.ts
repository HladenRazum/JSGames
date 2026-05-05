type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Ball = {
  x: number;
  y: number;
  radius: number;
};

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const X_MIDDLE = WIDTH / 2;
const Y_MIDDLE = HEIGHT / 2;
const PADDLE_HEIGHT = 80;
const PADDLE_PADDING = 30;
const PADDLE_WIDTH = 6;
const BALL_RADIUS = 8;

// Game objects
const paddleLeft: Paddle = {
  x: PADDLE_PADDING,
  y: Y_MIDDLE,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};
const paddleRight: Paddle = {
  x: WIDTH - PADDLE_PADDING,
  y: Y_MIDDLE,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};
const ball: Ball = {
  x: X_MIDDLE,
  y: Y_MIDDLE,
  radius: BALL_RADIUS,
};

const drawMiddleLine = () => {
  ctx.strokeStyle = 'rgba(255 255 255 / 60%)';
  ctx.beginPath();
  ctx.moveTo(X_MIDDLE, 0);
  ctx.setLineDash([8, 10]);
  ctx.lineTo(X_MIDDLE, HEIGHT);
  ctx.stroke();
  ctx.closePath();
};

const draw = () => {
  // Clear the previous screen
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawMiddleLine();

  // Draw the paddles
  ctx.fillStyle = 'rgba(20 20 220 / 90%)';
  ctx.fillRect(
    paddleLeft.x,
    paddleLeft.y - PADDLE_HEIGHT / 2,
    paddleLeft.width,
    paddleLeft.height,
  );
  ctx.fillRect(
    paddleRight.x,
    paddleRight.y - PADDLE_HEIGHT / 2,
    paddleRight.width,
    paddleRight.height,
  );

  // Draw the score
  // Draw the ball (depending on the game state)
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  // Draw overlay (depending on the game state)
};

// Handle the game logic
const update = () => {};

// Game loop
const loop = () => {
  update();
  draw();
  requestAnimationFrame(loop);
};

// Initialize the game
requestAnimationFrame(loop);
