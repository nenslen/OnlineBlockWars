var SPRITE_SIZE = 32;
var GRID_SIZE = 10;

var game = new Phaser.Game(SPRITE_SIZE * GRID_SIZE, SPRITE_SIZE * GRID_SIZE, Phaser.CANVAS, 'sim', { preload: preload, create: create, update: update });

var player1;
var player2;


function preload() {
    game.load.image('player1', 'player1.png');
    game.load.image('player2', 'player2.png');
}