var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);



// Deliver static files
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


// Declare root server page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html'); 
});


// Begin listening on port 8081 
server.listen(8081);
server.lastPlayerID = 0;


var lobbies = [];
lobbies[0] = new Lobby();


// Connection event
io.on('connection', function(socket) {

	// Connects a user to the server
    socket.on('connectToServer', function(username) {

        // Verify login
        /*
        if(login failure) {
            socket.emit('loginError', "Login error, incorrect username or password");
            return;
        }
        */


        // Get user's chosen image
        /*
        Get image from db
        */


    	// Create a new user within the socket.user object
        socket.user = {
            id: server.lastPlayerID++,
            name: username,
            image: "player1.png",
            currentLobby: -1,
            playerNumber: 0,
            ready: false
        };


        // Notifies user they are now connected
        socket.emit('loginSuccess', "Login success");
    });




    // Adds user to a lobby
    socket.on('joinLobby', function(lobbyID) {

        // Check if lobby exists
        if(lobbyID < 0 || lobbyID >= lobbies.length) {
            socket.emit('lobbyJoinError', "Unable to join lobby, lobby does not exist");
            return;
        }


        // Add user to lobby
        var lobby = lobbies[lobbyID];

        if(lobby.isFull() === false) {
            socket.user.currentLobby = lobbyID;
            socket.join(lobby.name);
            lobby.addUser(socket.user);
            socket.emit('lobbyJoinSuccess');

            // Notify players in lobby
            io.sockets.in(lobby.name).emit('currentLobbyData', lobby);
        } else {
            socket.emit('lobbyJoinError', "Unable to join lobby, lobby is full");
        }
    });




    // Removes user from lobby
    socket.on('leaveLobby', function() {

        // Make sure user is in a lobby
        if(socket.user.currentLobby == -1) {
            return;
        }


        var lobbyID = socket.user.currentLobby;
        var lobby = lobbies[lobbyID];


        // Remove user from lobby
        lobby.removeUser(socket.user.id);
        socket.user.currentLobby = -1;
        socket.leave(lobby.name);
        socket.emit('disconnectedFromLobby', "Disconnected from lobby");


        // Alert users still in lobby
        if(lobby.game.started === true) {
            if(lobby.game.gameOver === true) {
                io.sockets.in(lobby.name).emit('currentLobbyData', lobby);
            } else {
                io.sockets.in(lobby.name).emit('gameOverError', "Opponent has disconnected");
            }
        } else {
            io.sockets.in(lobby.name).emit('currentLobbyData', lobby);
        }
    });




    // Sends the client all lobbies
    socket.on('requestAllLobbyData', function() {
        socket.emit('allLobbyData', lobbies);
    });




    // Sends the client their current lobby data
    socket.on('requestCurrentLobbyData', function() {
        if(socket.user.currentLobby != -1) {
            socket.emit('currentLobbyData', lobbies[lobbyID]);
        }
    });




    // Places a piece for the user (if possible)
    socket.on('placePiece', function(x, y) {
        
        // Make sure user is in a lobby
        if(socket.user.currentLobby == -1) {
            socket.emit('placementError', "Unable to place piece, you not in a lobby");
            return;
        }
        

        // Make sure game is started
        var lobby = lobbies[socket.user.currentLobby];
        
        if(lobby.game.gameStarted === false) {
            socket.emit('placementError', "Unable to place piece, game has not started");
            return;
        }


        // Make sure it's this user's turn
        if(lobby.game.currentPlayer != socket.user.playerNumber) {
            socket.emit('placementError', "Unable to place piece, it is not your turn");
            return;
        }


        // Perform the turn
        if(lobby.game.performTurn(x, y) === false) {
            socket.emit('placementError', "Unable to place piece, invalid location");
            return;
        }


        // Update game for all players
        io.sockets.in(lobby.name).emit('gameData', lobby.game);
    });




    // Changes the ready state of the player
    socket.on('readyUp', function(isReady) {

        // Make sure user is in a lobby
        if(socket.user.currentLobby == -1) {
            return;
        }


        // Update player's ready state
        socket.user.ready = isReady;


        // Start game if all players ready
        var lobby = lobbies[socket.user.currentLobby];
        if(lobby.allReady() === true) {
            lobby.start();
            io.sockets.in(lobby.name).emit('gameStarting');
        }


        // Notify other users
        io.sockets.in(lobby.name).emit('currentLobbyData', lobby);
    });




    // Sends the game data to user
    socket.on('requestGameData', function() {
        if(socket.user.currentLobby != -1) {
            socket.emit('gameData', lobbies[socket.user.currentLobby].game);
        }
    });
});
