function Lobby(id) {
	this.id = id;
	this.name = "Lobby " + (id + 1);
	this.maxPlayers = 2;
	this.game;// = new BlockPuzzle();
	this.users = [];


	// Starts the game and assign player IDs
	this.start = function() {
		
		// Assign player numbers
		for(var i = 0; i < this.users.length; i++) {
			this.users[i].playerNumber = i + 1;
		}
		
		this.game.start();
	}


	// Resets the game
	this.reset = function() {
		this.game.reset();
		this.users = [];
	}


	// Adds a user to the lobby
	this.addUser = function(user) {
		this.users.push(user);
	}


	// Removes a user from the lobby
	this.removeUser = function(userID) {
		for(var i = 0; i < this.users.length; i++) {
			if(this.users[i].id == userID) {
				this.users.splice(i, 1);
			}
		}
	}


	// Returns true if lobby is full
	this.isFull = function() {
		if(this.users.length >= this.maxPlayers) {
			return true;
		} else {
			return false;
		}
	}


	// Returns true if all players are ready
	this.allReady = function() {
		if(this.isFull() === true) {
			for(var i = 0; i < this.users.length; i++) {
				if(this.users[i].ready === false) {
					return false;
				}
			}
		} else {
			return false;
		}

		return true;
	}
}

exports.lobby = Lobby;
