var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var lobby = require('./lobby.js');
var bp = require('./blockpuzzle/blockpuzzle.js');


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

for(var i = 0; i < 10; i++) {
    lobbies[i] = new lobby.lobby(i);
    lobbies[i].game = new bp.bp();
}


// Connection event
io.on('connection', function(socket) {

	// Connects a user to the server
    socket.on('connectToServer', function(username) {

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


        // Add user to lobby (if not full)
        var lobby = lobbies[lobbyID];

        if(lobby.isFull() === false) {
            socket.user.currentLobby = lobbyID;
            socket.join(lobby.name);
            socket.emit('lobbyJoinSuccess');
            lobby.addUser(socket.user);


            // Notify all players
            sendCurrentLobbyData(0, lobbyID);
            sendAllLobbyData();
        } else {
            socket.emit('lobbyJoinError', "Unable to join lobby, lobby is full");
        }
    });




    // Removes user from lobby
    socket.on('leaveLobby', function() {
        removeFromLobby(socket);
    });




    // Sends the client all lobbies
    socket.on('requestAllLobbyData', function() {
        sendAllLobbyData(socket);
    });




    // Sends the client their current lobby data
    socket.on('requestCurrentLobbyData', function() {
        sendCurrentLobbyData(socket, socket.user.currentLobby);
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
        sendGameData(0, lobby);


        // End game if gameover
        if(lobby.game.gameOver === true) {
            sendGameOverMessage(lobby);
            resetLobby(lobby.id);
        }
    });




    // Changes the ready state of the player and starts game if all users are ready
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
            // Assign player
            lobby.start();
            io.to(lobby.name).emit('gameStarting');
        }


        // Notify other users
        sendCurrentLobbyData(0, lobby.id);
    });




    // Sends the game data and player's number to user
    socket.on('requestGameData', function() {
        sendGameData(socket);
    });




    // Disconnects a player from the server
    socket.on('disconnect', function() {
        console.log('User disconnected');
        if(socket.user) {
            removeFromLobby(socket);
        }
    });


    // Disconnects a player from the server
    socket.on('logout', function() {
        console.log('Received logout request');
        if(socket.user) {
            removeFromLobby(socket, true);
        }
    });
});


// Removes user from lobby and alerts other players
function removeFromLobby(socket, logout) {

    console.log("removing user from lobby...");

    // Make sure user is in a lobby
    var lobbyID = socket.user.currentLobby;
    if(lobbyID == -1) {
        return;
    }


    // Remove user from lobby
    var lobby = lobbies[lobbyID];
    lobby.removeUser(socket.user.id);
    socket.user.currentLobby = -1;
    socket.user.ready = false;
    socket.leave(lobby.name);
    socket.emit('disconnectedFromLobby', "Disconnected from lobby");


    // Alert and disconnect (if game was running) users still in lobby
    if(lobby.game.gameStarted === true) {
        if(lobby.game.gameOver === true) {
            sendCurrentLobbyData(0, lobbyID);
        } else {
            io.to(lobby.name).emit('gameOverError', "Opponent has disconnected. You have been removed from the lobby");
            resetLobby(lobbyID);
        }
    } else {
        sendCurrentLobbyData(0, lobbyID);
    }

    //sendAllLobbyData();
}


// Removes all players from a lobby
function resetLobby(lobbyID) {
    
    // Remove players from socket room
    var roomName = lobbies[lobbyID].name;
    var socketsInRoom = io.nsps['/'].adapter.rooms[roomName].sockets;

    
    for(var socketID in socketsInRoom) {
        console.log("removing user from lobby room...");
        var socket = io.sockets.connected[socketID];
        socket.leave(roomName);
        socket.user.ready = false;
    }
    
    lobbies[lobbyID].reset();
}


// Sends specified user(s) all lobbies
function sendAllLobbyData(socket) {
    if(socket) {
        socket.emit('allLobbyData', lobbies);
    } else {
        io.sockets.emit('allLobbyData', lobbies);
    }
}


// Sends specified user(s) their current lobby data
function sendCurrentLobbyData(socket, lobbyID) {
    console.log("sending currentLobbyData...");

    // Validate lobby
    if(lobbyID == -1) {
        return;
    }


    // Send to single user or all users in this lobby
    if(socket != 0) {
        socket.emit('currentLobbyData', lobbies[lobbyID]);
    } else {
        io.to(lobbies[lobbyID].name).emit('currentLobbyData', lobbies[lobbyID]);
    }
}



// Sends specified user(s) their game data
function sendGameData(socket, lobby) {
    // Send to single user or all users in this lobby
    if(socket != 0) {
        
        // Make sure user is in a lobby
        var lobbyID = socket.user.currentLobby;
        if(lobbyID == -1) {
            return;
        }

        var game = lobbies[lobbyID].game;
        socket.emit('gameData', game, socket.user.playerNumber);
    } else {
        io.to(lobby.name).emit('gameData', lobby.game, -1);
    }
}


// Notifies all players in lobby that the game is over
function sendGameOverMessage(lobby) {
    var winnerID = lobby.game.winner - 1;
    var winner = lobby.users[winnerID].name;

    io.to(lobby.name).emit('gameOver', winner);
}
