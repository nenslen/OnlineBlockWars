
// Constants
var SPRITE_SIZE = 32;
var GRID_SIZE = 10;
var GRID_PADDING = 7;
var GAME_SIZE = GRID_PADDING + GRID_SIZE * SPRITE_SIZE + GRID_SIZE * GRID_PADDING;

var game = new Phaser.Game(GAME_SIZE, GAME_SIZE, Phaser.CANVAS, 'gameView', { preload: preload, create: create });

// Client side game data
var blockPuzzle = {
	lobbies: undefined,
	currentLobby: undefined,
	grid: undefined,
	players: undefined,
	currentPlayer: undefined
};

var graphicGrid = [];

function preload() {
    game.load.image('player1Image', 'images/' + players[0].image + '.png');
    game.load.image('player2Image', 'images/' + players[1].image + '.png');
    game.load.image('tile', 'images/tile.png');
}


function create() {
    game.stage.backgroundColor = "#2d2d2d";

    // Create grid of tiles
    for(var i = 0; i < GRID_SIZE; i++) {
    	graphicGrid[i] = [];
    	for(var j = 0; j < GRID_SIZE; j++) {
    		var newTile = game.add.sprite(0, 0, 'tile');
    		newTile.width = SPRITE_SIZE;
    		newTile.height = SPRITE_SIZE;
    		newTile.x = GRID_PADDING + i * SPRITE_SIZE + i * GRID_PADDING;
    		newTile.y = GRID_PADDING + j * SPRITE_SIZE + j * GRID_PADDING;
    		newTile.row = i + 1;
    		newTile.col = j + 1;
    		newTile.inputEnabled = true;
    		newTile.events.onInputOver.add(highlightGrid, this);
    		newTile.events.onInputOut.add(removeHighlight, this);
    		newTile.events.onInputDown.add(click, this);

    		graphicGrid[i][j] = newTile;
    	}
    }
}

function Block(x, y) {
	this.x = x;
	this.y = y;
}

// Highlights the player's next move
function highlightGrid(tile) {

	var blocks = [];
	blocks[0] = new Block(0, -1);
	blocks[1] = new Block(0, 0);
	blocks[2] = new Block(0, 1);

	for(var i = 0; i < blocks.length; i++) {

		// Get block info
		var block = blocks[i];
		var x1 = tile.row - 1 + block.x;
		var y1 = tile.col - 1 + block.y;

		if(x1 >= 0 && x1 < GRID_SIZE && y1 >= 0 && y1 < GRID_SIZE) {
			graphicGrid[x1][y1].width += 3;
			graphicGrid[x1][y1].height += 3;
			graphicGrid[x1][y1].x--;
			graphicGrid[x1][y1].y--;
			graphicGrid[x1][y1].loadTexture('player1', 0);
		}
	}
}


// Removes highlights from the grid
function removeHighlight(tile) {
	for(var i = 0; i < GRID_SIZE; i++) {
    	for(var j = 0; j < GRID_SIZE; j++) {
    		graphicGrid[x1][y1].width = SPRITE_SIZE;
    		graphicGrid[x1][y1].height = SPRITE_SIZE;
    		graphicGrid[x1][y1].x = GRID_PADDING + i * SPRITE_SIZE + i * GRID_PADDING;
    		graphicGrid[x1][y1].y = GRID_PADDING + j * SPRITE_SIZE + j * GRID_PADDING;
    	}
    }
}


// Tells server where the user clicked
function click(tile) {
	//Client.placePiece(this.row, this.col);
}
