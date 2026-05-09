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
  vx: number;
  vy: number;
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
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;
const MAX_BOUNCE_ANGLE = Math.PI / 3; // 60 degrees
const SPEED_INCREMENT = 0.4;
const AI_REACTION_DELAY = 0.85;

let currentSpeed = BALL_SPEED;

const randomVelocity = () => {
  const min = BALL_SPEED * 0.5;
  const speed = min + Math.random() * (BALL_SPEED - min);
  return Math.random() > 0.5 ? -speed : speed;
};

// Game objects
const paddleLeft: Paddle = {
  x: PADDLE_PADDING,
  y: Y_MIDDLE,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};
const paddleRight: Paddle = {
  x: WIDTH - PADDLE_PADDING - PADDLE_WIDTH,
  y: Y_MIDDLE,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};
const ball: Ball = {
  x: X_MIDDLE,
  y: Y_MIDDLE,
  radius: BALL_RADIUS,
  vx: randomVelocity(),
  vy: randomVelocity(),
};

const keys: Record<string, boolean> = {};
document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));

let prevBallX = ball.x;

const handlePaddleBounce = (paddle: Paddle, isLeft: boolean) => {
  // 1. Calculate the hit point (-1 to 1)
  const relativeIntersectY = ball.y - paddle.y;
  const normalizedIntersectY = relativeIntersectY / (paddle.height / 2);
  // 2. Calculate the bounce angle in radians
  const bounceAngle = normalizedIntersectY * MAX_BOUNCE_ANGLE;

  // 3. Update velocities
  // Direction is 1 for right, -1 for left
  const direction = isLeft ? 1 : -1;

  currentSpeed += SPEED_INCREMENT;

  ball.vx = direction * currentSpeed * Math.cos(bounceAngle);
  ball.vy = currentSpeed * Math.sin(bounceAngle);

  // 4. Reposition the ball to avoid getting stuck
  if (isLeft) {
    ball.x = paddle.x + paddle.width + ball.radius;
  } else {
    ball.x = paddle.x - ball.radius;
  }
};

const resetBall = () => {
  ball.x = X_MIDDLE;
  ball.y = Y_MIDDLE;
  ball.vx = randomVelocity();
  ball.vy = randomVelocity();
  currentSpeed = BALL_SPEED;
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

const checkCollision = () => {
  const leftPaddleFace = paddleLeft.x + paddleLeft.width;

  if (
    ball.vx < 0 &&
    prevBallX - ball.radius >= leftPaddleFace &&
    ball.x - ball.radius < leftPaddleFace &&
    ball.y + ball.radius > paddleLeft.y - paddleLeft.height / 2 &&
    ball.y - ball.radius < paddleLeft.y + paddleLeft.height / 2
  ) {
    handlePaddleBounce(paddleLeft, true);
  }

  const rightPaddleFace = paddleRight.x;

  if (
    ball.vx > 0 &&
    prevBallX + ball.radius <= rightPaddleFace &&
    ball.x + ball.radius > rightPaddleFace &&
    ball.y + ball.radius > paddleRight.y - paddleRight.height / 2 &&
    ball.y - ball.radius < paddleRight.y + paddleRight.height / 2
  ) {
    handlePaddleBounce(paddleRight, false);
  }
};

const updateAI = () => {
  // AI predicts where the ball will be, with slight delay for realism
  const targetY = ball.y + ball.vy * AI_REACTION_DELAY;

  // Get current paddle center position
  const paddleCenter = paddleRight.y;
  const paddleHalfHeight = PADDLE_HEIGHT / 2;

  // Add some randomness based on ball speed
  const randomFactor = Math.random() * 4 - 2;
  let idealY = Math.min(
    Math.max(targetY, paddleHalfHeight),
    HEIGHT - paddleHalfHeight,
  );
  idealY += randomFactor * (currentSpeed / BALL_SPEED);

  // Move AI paddle smoothly toward target
  const diff = idealY - paddleCenter;

  const AI_SPEED = 4.5; // Add this constant
  const AI_PADDLE_MARGIN = 15; // Add this constant

  if (Math.abs(diff) > AI_PADDLE_MARGIN) {
    // Move at full speed when far away
    if (diff > 0) {
      paddleRight.y += Math.min(AI_SPEED, diff);
    } else if (diff < 0) {
      paddleRight.y -= Math.min(AI_SPEED, -diff);
    }
  } else if (Math.abs(diff) > 2) {
    // Fine adjustment when close
    if (diff > 0) {
      paddleRight.y += Math.min(AI_SPEED * 0.5, diff);
    } else if (diff < 0) {
      paddleRight.y -= Math.min(AI_SPEED * 0.5, -diff);
    }
  }
};

// Handle the game logic
const update = () => {
  // Move the paddles up and down
  if (keys['w'] || keys['W']) paddleLeft.y -= PADDLE_SPEED;
  if (keys['s'] || keys['S']) paddleLeft.y += PADDLE_SPEED;
  if (keys['ArrowUp']) paddleRight.y -= PADDLE_SPEED;
  if (keys['ArrowDown']) paddleRight.y += PADDLE_SPEED;

  updateAI();

  // Move the ball
  prevBallX = ball.x;

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Check boundaries for the paddles
  const paddleLeftMiddle = paddleLeft.height / 2;
  if (paddleLeft.y - paddleLeftMiddle < 0) {
    paddleLeft.y = paddleLeftMiddle;
  }
  if (paddleLeft.y + paddleLeftMiddle > HEIGHT) {
    paddleLeft.y = HEIGHT - paddleLeftMiddle;
  }

  const paddleRightMiddle = paddleRight.height / 2;
  if (paddleRight.y - paddleRightMiddle < 0) {
    paddleRight.y = paddleRightMiddle;
  }
  if (paddleRight.y + paddleRightMiddle > HEIGHT) {
    paddleRight.y = HEIGHT - paddleRightMiddle;
  }

  // Handle top and bottom bounce
  if (ball.y - ball.radius < 0) {
    ball.vy = Math.abs(ball.vy); // force downward
  }
  if (ball.y + ball.radius > HEIGHT) {
    ball.vy = -Math.abs(ball.vy); // force upward
  }

  // Handle goal condition
  if (ball.x < 0 || ball.x > WIDTH) {
    resetBall();
  }

  checkCollision();
};

// Game loop
const loop = () => {
  update();
  draw();
  requestAnimationFrame(loop);
};

// Initialize the game
requestAnimationFrame(loop);
