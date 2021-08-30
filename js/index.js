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

  ball.events.onOutOfBounds.add(function () {
    alert("Game over!");
    location.reload();
  }, this);

  ball.body.velocity.set(150, -150);
  paddle.body.immovable = true;
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
};
