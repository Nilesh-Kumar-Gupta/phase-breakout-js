console.log("Hello World!")

var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload: preload,
    create: create, 
    update: update
});

function preload() {};
function create() {};
function update() {};