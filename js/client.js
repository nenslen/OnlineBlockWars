var Views = Object.freeze({LOGIN: 0, LOBBYLIST: 1, LOBBY: 2, GAME: 3});

var Client = {};
Client.socket = io.connect();


// Connects the client to the server
Client.connect = function(username) {
    console.log("connecting to server...");
    Client.socket.emit('connectToServer', username);
};


// Joins a lobby
Client.joinLobby = function(lobbyID) {
    console.log("joining lobby " + lobbyID + "...");
    Client.socket.emit('joinLobby', lobbyID);
};


// Leaves the current lobby lobby
Client.leaveLobby = function() {
    console.log("leaving lobby...");
    Client.socket.emit('leaveLobby');
};


// Gets data for all lobbies
Client.requestAllLobbyData = function() {
    console.log("requesting all lobby data...");
    Client.socket.emit('requestAllLobbyData');
};


// Gets data for the player's current lobby
Client.requestCurrentLobbyData = function() {
    console.log("requesting current lobby data...");
    Client.socket.emit('requestCurrentLobbyData');
};


// Attempts to place a piece on the grid
Client.placePiece = function(x, y) {
    console.log("placing piece...");
    Client.socket.emit('placePiece', x, y);
};


// Tells the server the player is ready
Client.readyUp = function(isReady) {
    console.log("changing ready state to " + isReady + "...");
    Client.socket.emit('readyUp', isReady);
};


// Asks the server for their game data
Client.requestGameData = function() {
    console.log("requesting game data...");
    Client.socket.emit('requestGameData');
};


// Display login error message
Client.socket.on('loginError', function(message) {
    console.log("received login error");
    showMessage(message);
});


// Display login suceess message
Client.socket.on('loginSuccess', function(message) {
    console.log("received login success");
    //showMessage(message);
    switchView(Views.LOBBYLIST);
    Client.requestAllLobbyData();
});


// Display lobby full message
Client.socket.on('lobbyJoinError', function(message) {
    console.log("received lobby join error");
	showMessage(message);
});


// Switches to lobby list view
Client.socket.on('disconnectedFromLobby', function(message) {
    console.log("disconnected from lobby");
	showMessage(message);
	switchView(Views.LOBBYLIST);
    Client.requestAllLobbyData();
});


// Update the lobby viewer
Client.socket.on('allLobbyData', function(data) {
    console.log("received all lobby data");
    blockPuzzle.lobbies = data;
    updateLobbyListView();
});


// Ask server for the current lobby data
Client.socket.on('lobbyJoinSuccess', function() {
    console.log("lobby joined successfully");
	switchView(Views.LOBBY);
    Client.requestCurrentLobbyData();
});


// Update the lobby view
Client.socket.on('currentLobbyData', function(data) {
    console.log("received lobby data:");
    blockPuzzle.currentLobby = data;
    updateLobbyView();
});


// Leave game and return to lobby list
Client.socket.on('gameOverError', function(message) {
    console.log("received game over error");
    showMessage(message);
    switchView(Views.LOBBYLIST);
    Client.requestAllLobbyData();
});


// Display game over message
Client.socket.on('gameOver', function(winner) {
    console.log('received game over message');
    alert('Game over. ' + winner + ' wins!');
    switchView(Views.LOBBYLIST);
    Client.requestAllLobbyData();
});


// Update the lobby viewer
Client.socket.on('placementError', function(message) {
    console.log("receieved placement error");
    showMessage(message);
});


// Update client side game data and update view
Client.socket.on('gameData', function(game, playerNumber) {
    console.log("receieved game data");

    blockPuzzle.grid = game.grid;
    blockPuzzle.players = game.players;
    blockPuzzle.currentPlayer = game.currentPlayer;

    if(playerNumber != -1) {
        blockPuzzle.playerNumber = playerNumber;
    }
    
    updateGameView();
});


// Get the match ready to begin
Client.socket.on('gameStarting', function() {
    console.log("received game starting message");
    switchView(Views.GAME);
    Client.requestGameData();
});
