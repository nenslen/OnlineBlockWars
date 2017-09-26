function BlockPuzzle() {
	this.gridSize = 10;
	this.baseXP = 10;
	this.gameOver = true;
	this.gameStarted = false;
	this.winner = 0;
	this.currentPlayer = 1;
	this.players = [];
	this.grid = [];


	// Starts the game
	this.start = function() {
		this.reset();
		this.gameOver = false;
		this.gameStarted = true;
	}


	// Resets the game
	this.reset = function() {
		this.gameOver = true;
		this.gameStarted = false;
		this.winner = 0;
		this.currentPlayer = 1;
		this.players[0] = new Player(1);
		this.players[1] = new Player(2);
		this.grid = [];

		for(var i = 0; i < this.gridSize; i++) {
			this.grid[i] = [];
			for(var j = 0; j < this.gridSize; j++) {
				this.grid[i][j] = new Tile();
			}
		}
	}


	// Places the current player's piece at x, y (if possible)
	// Returns whether or not turn was successfully completed
	this.performTurn = function(x, y) {

		// Get current player's piece
		var piece = this.players[this.currentPlayer - 1].piece;


		// Make sure move is valid
		if(this.gameOver == true || this.isValidMove(piece, x, y) === false) {
			return;
		}		


		// Place each block in the piece
		for(var i = 0; i < piece.blocks.length; i++) {

			// Get block info
			var block = piece.blocks[i];
			var x1 = x + block.x;
			var y1 = y + block.y;

			this.grid[x1][y1].value = this.currentPlayer;
		}


		// Finish up turn, declare winner if gameover
		this.clearLines();
		this.swapTurns();

		if(this.movesExist() === false) {
			//this.swapTurns();
			this.gameOver = true;
			this.winner = this.currentPlayer;
		}

		return true;
	}


	// Checks if the given piece is valid at x, y
	this.isValidMove = function(piece, x, y) {
		
		// Check each block in the piece for conflicts
		for(var i = 0; i < piece.blocks.length; i++) {
			
			// Get block info
			var block = piece.blocks[i];
			var x1 = x + block.x;
			var y1 = y + block.y;


			// Make sure block is in bounds
			if(x1 < 0 || x1 >= this.gridSize || y1 < 0 || y1 >= this.gridSize) {
				return false;
			}


			// Check if tile is used
			if(this.grid[x1][y1].value != 0) {
				return false;
			}
		}

		return true;
	}


	// Checks if the current player has any available moves
	this.movesExist = function() {

		// Check each tile for possible placement
		for(var i = 0; i < this.gridSize; i++) {
			for(var j = 0; j < this.gridSize; j++) {
				if(this.isValidMove(this.players[this.currentPlayer - 1].piece, i, j) === true) {
					return true;
				}
			}
		}

		return false;
	}


	// Clears any full lines and awards xp
	this.clearLines = function() {

		var fullHor = true;
		var fullVert = true;


		for(var i = 0; i < this.gridSize; i++) {
		    
		    fullHor = true;
		    fullVert = true;
		    

		    // Check each line for empty tiles
		    for(var j = 0; j < this.gridSize; j++) {
		        
		        // Horizontal
		        if(this.grid[i][j].value == 0) {
		            fullHor = false;
		        }
		        
		        // Vertical
		        if(this.grid[j][i].value == 0) {
		            fullVert = false;
		        }
		    }
		    
		   
		    // Marks horizontal tiles for deletion
		    if(fullHor === true) {
		        for(var j = 0; j < this.gridSize; j++) {
		            this.grid[i][j].delete = true;
		        }
		    }
		    
		    // Marks vertical tiles for deletion
		    if(fullVert) {
		        for(var j = 0; j < this.gridSize; j++) {
		            this.grid[j][i].delete = true;
		        }
		    }
		}
		

		// Delete tiles marked for deletion
		for(var i = 0; i < this.gridSize; i++) {
		    for(var j = 0; j < this.gridSize; j++) {
		        if(this.grid[i][j].delete == true) {
		            this.grid[i][j].value = 0;
		            this.grid[i][j].delete = false;
		            this.players[this.currentPlayer - 1].xp += this.baseXP
		        }
		    }
		}
	}


	// Gives current player a new piece and changes whose turn it is
	this.swapTurns = function() {
		this.players[this.currentPlayer - 1].piece = new Piece();

		if(this.currentPlayer == 1) {
			this.currentPlayer = 2;
		} else {
			this.currentPlayer = 1;
		}
	}
}


var PieceTypes = Object.freeze({PIECE1x1: 0, PIECE1x2: 1, PIECE1x3: 2, PIECE1x4: 3, PIECE1x5: 4, PIECE2x1: 5,
                                PIECE2x2: 6, PIECE3x1: 7, PIECE3x3: 8, PIECE4x1: 9, PIECESmallL: 10, PIECEBigL: 11,
                                PIECEHorJ: 12, PIECEs: 13, PIECEt: 14, PIECEVertJ: 15});


function Block(x, y) {
	this.x = x;
	this.y = y;
}


function Tile() {
	this.value = 0;
	this.delete = false;
}


function Player(id) {
	this.id = 0;
	this.xp = 0;
	this.piece = new Piece();

	if(id) { this.id = id; }
}


function Piece(pieceType) {

	var type;
	this.blocks = [];


	// Set piece type
	if(pieceType && pieceType > 0 || pieceType == 0) {
		type = pieceType;
	} else {
		var numTypes = Object.keys(PieceTypes).length;
		type = Math.floor(Math.random() * numTypes);
	}
	

	// Create piece
	switch(type) {
		case PieceTypes.PIECE1x1:
			this.blocks[0] = new Block(0, 0);
			break;
		case PieceTypes.PIECE1x2:
			this.blocks[0] = new Block(0, 0);
			this.blocks[1] = new Block(0, 1);
			break;
		case PieceTypes.PIECE1x3:
			this.blocks[0] = new Block(0, -1);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(0, 1);
			break;
		case PieceTypes.PIECE1x4:
			this.blocks[0] = new Block(0, -1);
        	this.blocks[1] = new Block(0, 0);
        	this.blocks[2] = new Block(0, 1);
        	this.blocks[3] = new Block(0, 2);
			break;
		case PieceTypes.PIECE1x5:
			this.blocks[0] = new Block(0, -2);
	        this.blocks[1] = new Block(0, -1);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(0, 1);
	        this.blocks[4] = new Block(0, 2);
			break;
		case PieceTypes.PIECE2x1:
			this.blocks[0] = new Block(0, 0);
        	this.blocks[1] = new Block(1, 0);
			break;
		case PieceTypes.PIECE2x2:
			this.blocks[0] = new Block(0, 0);
	        this.blocks[1] = new Block(0, 1);
	        this.blocks[2] = new Block(1, 0);
	        this.blocks[3] = new Block(1, 1);
			break;
		case PieceTypes.PIECE3x1:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(1, 0);
			break;
		case PieceTypes.PIECE3x3:
			this.blocks[0] = new Block(-1, -1);
	        this.blocks[1] = new Block(-1, 0);
	        this.blocks[2] = new Block(-1, 1);
	        this.blocks[3] = new Block(0, -1);
	        this.blocks[4] = new Block(0, 0);
	        this.blocks[5] = new Block(0, 1);
	        this.blocks[6] = new Block(1, -1);
	        this.blocks[7] = new Block(1, 0);
	        this.blocks[8] = new Block(1, 1);
			break;
		case PieceTypes.PIECE4x1:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(1, 0);
	        this.blocks[3] = new Block(2, 0);
			break;
		case PieceTypes.PIECESmallL:
			this.blocks[0] = new Block(0, 0);
	        this.blocks[1] = new Block(0, 1);
	        this.blocks[2] = new Block(1, 0);
			break;
		case PieceTypes.PIECEBigL:
			this.blocks[0] = new Block(0, -2);
	        this.blocks[1] = new Block(0, -1);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(1, 0);
	        this.blocks[4] = new Block(2, 0);
			break;
		case PieceTypes.PIECEHorJ:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(0, 1);
	        this.blocks[3] = new Block(0, 2);
			break;
		case PieceTypes.PIECEs:
			this.blocks[0] = new Block(1, -1);
	        this.blocks[1] = new Block(1, 0);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(0, 1);
			break;
		case PieceTypes.PIECEt:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, -1);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(0, 1);
			break;
		case PieceTypes.PIECEVertJ:
			this.blocks[0] = new Block(0, 0);
	        this.blocks[1] = new Block(0, 1);
	        this.blocks[2] = new Block(1, 0);
	        this.blocks[3] = new Block(2, 0);
			break;
	}
}

exports.bp = BlockPuzzle;
