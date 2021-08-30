var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
});

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;

const textStyle = {
  font: "18px Arial",
  fill: "#0095DD",
};

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = "#eee";

  game.load.image("ball", "img/ball.png");
  game.load.image("paddle", "img/paddle.png");
  game.load.image("brick", "img/brick.png");
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  ball = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 30,
    "ball"
  );
  ball.anchor.set(0.5);

  paddle = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 5,
    "paddle"
  );
  paddle.anchor.set(0.5, 1);

  initBricks();

  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);

  game.physics.arcade.checkCollision.down = false;
  ball.body.collideWorldBounds = true;
  ball.checkWorldBounds = true;

  ball.body.bounce.set(1);

  ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  ball.body.velocity.set(150, -150);
  paddle.body.immovable = true;

  scoreText = game.add.text(5, 5, "Points: 0", textStyle);

  livesText = game.add.text(
    game.world.width - 5,
    5,
    "Lives: " + lives,
    textStyle
  );
  livesText.anchor.set(1.0);

  lifeLostText = game.add.text(
    game.world.width * 0.5,
    game.world.height * 0.5,
    "Life Lost, Click to Continue",
    textStyle
  );
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;
}

function update() {
  game.physics.arcade.collide(ball, paddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  paddle.x = game.input.x || game.world.width * 0.5;
}

const initBricks = () => {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      column: 7,
    },
    offset: {
      top: 50,
      left: 60,
    },
    padding: 10,
  };

  bricks = game.add.group();

  for (let c = 0; c < brickInfo.count.column; c++) {
    for (let r = 0; r < brickInfo.count.row; r++) {
      let brickx =
        c * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      let bricky =
        r * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;

      let newBrick = game.add.sprite(brickx, bricky, "brick");
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
};

const ballHitBrick = (ball, brick) => {
  brick.kill();
  score += 10;
  scoreText.setText("Points: " + score);

  let count_alive = 0;
  for (i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive) count_alive++;
  }

  if (count_alive == 0) {
    alert("You won the game, congratulations!");
    location.reload();
  }
};

const ballLeaveScreen = () => {
  lives--;
  console.log(lives);
  if (lives) {
    livesText.setText("Lives: " + lives);
    lifeLostText.visible = true;
    ball.reset(game.world.width * 0.5, game.world.height - 30);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);

    game.input.onDown.addOnce(() => {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert("You lost, game over");
    location.reload();
  }
};
