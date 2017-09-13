var Views = Object.freeze({LOGIN: 0, LOBBYLIST: 1, LOBBY: 2, GAME: 3});

var Client = {};
Client.socket = io.connect();


// Connects the client to the server
Client.connect = function(username) {
    Client.socket.emit('connectToServer', username);
};


// Joins a lobby
Client.joinLobby = function(lobbyID){
    Client.socket.emit('joinLobby', lobbyID);
};


// Leaves the current lobby lobby
Client.leaveLobby = function(){
    Client.socket.emit('leaveLobby');
};


// Gets data for all lobbies
Client.requestAllLobbyData = function(){
    Client.socket.emit('requestAllLobbyData');
};


// Gets data for the player's current lobby
Client.requestCurrentLobbyData = function(){
    Client.socket.emit('requestCurrentLobbyData');
};


// Attempts to place a piece on the grid
Client.placePiece = function(x, y){
    Client.socket.emit('placePiece', x, y);
};


// Tells the server the player is ready
Client.readyUp = function(isReady) {
    Client.socket.emit('readyUp', isReady);
};


// Asks the server for their game data
Client.requestGameData = function() {
    Client.socket.emit('requestGameData');
};


// Display login error message
Client.socket.on('loginError', function(message) {
    showMessage(message);
});


// Display login suceess message
Client.socket.on('loginSuccess', function(message) {
    showMessage(message);
    switchView(Views.LOBBYLIST);
	Client.socket.emit('requestAllLobbyData');
});


// Display lobby full message
Client.socket.on('lobbyFullError', function(message) {
	showMessage(message);
});


// Switches to lobby list view
Client.socket.on('disconnectedFromLobby', function(message) {
	showMessage(message);
	switchView(Views.LOBBYLIST);
	Client.socket.emit('requestAllLobbyData');
});


// Update the lobby viewer
Client.socket.on('allLobbyData', function(data) {
    blockPuzzle.lobbies = data;
    updateLobbyList();
});


// Ask server for the current lobby data
Client.socket.on('lobbyJoinSuccess', function() {
	switchView(Views.LOBBY);
	Client.socket.emit('requestCurrentLobbyData');
});


// Update the lobby viewer
Client.socket.on('currentLobbyData', function(data) {
    blockPuzzle.currentLobby = data;
    updateLobby();
});


// Update the lobby viewer
Client.socket.on('gameOverError', function(message) {
    showMessage(message);
    switchView(Views.LOBBYLIST);
	Client.socket.emit('requestAllLobbyData');
});


// Update the lobby viewer
Client.socket.on('placementError', function(message) {
    showMessage(message);
});


// Update client side game data and update view
Client.socket.on('gameData', function(game) {
    blockPuzzle.grid = game.grid;
    blockPuzzle.players = game.players;
    blockPuzzle.currentPlayer = game.currentPlayer;
});


// Get the match ready to begin
Client.socket.on('gameStarting', function() {
    switchView(Views.GAME);
    Client.socket.emit('requestGameData');
});
