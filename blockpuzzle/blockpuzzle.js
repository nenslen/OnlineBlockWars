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
			this.swapTurns();
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
			if(x1 < 0 || x1 >= gridSize || y1 < 0 || y1 >= gridSize) {
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
