
// Constants
var SPRITE_SIZE = 32;
var GRID_SIZE = 10;
var GRID_PADDING = 7;
var GAME_SIZE = GRID_PADDING + GRID_SIZE * SPRITE_SIZE + GRID_SIZE * GRID_PADDING;


function Block(x, y) {
    this.x = x;
    this.y = y;
}


var game = new Phaser.Game(GAME_SIZE, GAME_SIZE, Phaser.CANVAS, 'gameContent', { preload: preload, create: create });


// Client side game data
var blockPuzzle = {
	lobbies: undefined,
	currentLobby: undefined,
	grid: undefined,
	players: undefined,
    currentPlayer: undefined,
	playerNumber: undefined,
    ready: false
};

var graphicGrid = [];


function preload() {
    game.load.image('player1Graphic', 'images/player1.png');
    game.load.image('player2Graphic', 'images/player2.png');
    game.load.image('invalidTile', 'images/invalid.png');
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
    		newTile.row = i;
    		newTile.col = j;
            newTile.graphic = 'tile';
            newTile.hover = false;
    		newTile.inputEnabled = true;
    		newTile.events.onInputOver.add(highlightGrid, this);
    		newTile.events.onInputDown.add(click, this);

    		graphicGrid[i][j] = newTile;
    	}
    }
}



// Highlights the player's next move
function highlightGrid(tile) {
    
    // Only activate if it is this player's turn
    if(blockPuzzle.currentPlayer != blockPuzzle.playerNumber) {
        return;
    }


    removeHighlight();


    // Find valid place to highlight the piece
    var piece = blockPuzzle.players[blockPuzzle.currentPlayer - 1].piece;
    var inBound = getValidPos(piece, tile.row, tile.col);


    // Highlight each of the blocks
    for(var i = 0; i < piece.blocks.length; i++) {

        // Get block info
        var block = piece.blocks[i];
        var x1 = inBound.x + block.x;
        var y1 = inBound.y + block.y;

        graphicGrid[x1][y1].hover = true;


        // Change sprite of tile
        if(blockPuzzle.grid[x1][y1].value == 0) {
            graphicGrid[x1][y1].loadTexture('player' + blockPuzzle.currentPlayer + 'Graphic', 0);
        } else {
            graphicGrid[x1][y1].loadTexture('invalidTile', 0);
            graphicGrid[x1][y1].width = SPRITE_SIZE;
            graphicGrid[x1][y1].height = SPRITE_SIZE;
        }
    }
}


// Removes all highlights from the grid
function removeHighlight() {
	for(var i = 0; i < GRID_SIZE; i++) {
    	for(var j = 0; j < GRID_SIZE; j++) {
            if(graphicGrid[i][j].hover === true) {
                graphicGrid[i][j].hover = false;
        		graphicGrid[i][j].loadTexture(graphicGrid[i][j].graphic, 0);
                graphicGrid[i][j].width = SPRITE_SIZE;
                graphicGrid[i][j].height = SPRITE_SIZE;
            }
    	}
    }
}


// Tells server where the user clicked
function click(tile) {
    
    // Only activate if it is this player's turn
    if(blockPuzzle.currentPlayer != blockPuzzle.playerNumber) {
        alert("not your turn");
        return;
    }


    // Verify that tile is valid (or find the proper valid tile)
    var piece = blockPuzzle.players[blockPuzzle.playerNumber - 1].piece;
    var inBound = getValidPos(piece, tile.row, tile.col);
    
    Client.placePiece(inBound.x, inBound.y);
}


// Shows a message to the user
function showMessage(message) {
    //alert(message);
    console.log(message);
}


// Switches what view the user sees
function switchView(view) {
    
    blockPuzzle.ready = false;
    var fadeOutTime = 200;
    var fadeInDelay = 300;

    $('#loginView').fadeOut(fadeOutTime);
    $('#lobbyListView').fadeOut(fadeOutTime);
    $('#lobbyView').fadeOut(fadeOutTime);
    $('#gameView').fadeOut(fadeOutTime);

    switch(view) {
        case Views.LOGIN:
            $('#usernameInput').val('');
            $('#loginView').delay(fadeInDelay).fadeIn();
            $('#usernameInput').focus();
            break;
        case Views.LOBBYLIST:
            $("#lobbyListView").delay(fadeInDelay).fadeIn();
            break;
        case Views.LOBBY:
            $('#lobbyView').delay(fadeInDelay).fadeIn();
            break;
        case Views.GAME:
            $('#gameView').delay(fadeInDelay).fadeIn();
            break;
        default:
            $('#loginView').delay(fadeInDelay).fadeIn();
            break;
    }
}


// Updates the lobby list view
function updateLobbyListView() {
    console.log("displaying lobby list...");
    $('#lobbyListViewContent').empty();


    for(var i = 0; i < blockPuzzle.lobbies.length; i++) {
        var lobby = blockPuzzle.lobbies[i];
        var name = lobby.name;

        var output = '';
        
        output +=
            '<div class="card">' +
                '<div class="cardLeft">' +
                    '<span class="lobbyName">' + name + '</span>'
        ;

        for(var j = 0; j < lobby.maxPlayers; j++) {
            if(j < lobby.users.length) {
                output += '<span class="lobbyPlayer">' + lobby.users[j].name + '</span>';
            } else {
                output += '<span class="lobbyPlayer lobbyEmpty">empty</span>';
            }
        }

        var buttonColor;
        if(lobby.users.length == lobby.maxPlayers) {
            buttonColor = 'gray';
        } else {
            buttonColor = 'green';
        }

        output +=
                '</div>' +
                '<div class="cardRight">' +
                    '<button class="joinLobbyButton button ' + buttonColor + '" value="' + lobby.id + '">Join</button>' +
                '</div>' +
            '</div>'
        ;


        $('#lobbyListViewContent').append(output);
    }
}


// Updates the current lobby view
function updateLobbyView() {
    console.log("displaying lobby...");
    $('#lobbyViewContent').empty();

    var lobby = blockPuzzle.currentLobby;
    var output = '';

    $('#lobbyViewHeader').html(lobby.name);
    
    output +=
        '<div class="card">' +
            '<div class="cardLeft center"><div style="width: 100%">'
    ;


    for(var i = 0; i < lobby.maxPlayers; i++) {

        var checked = '';
        var disabled = '';
        if(i < lobby.users.length) {
            var name = lobby.users[i].name;
            var id = 'ready' + i;
            var checked = '';

            if(lobby.users[i].ready === true) {
                checked = 'checked="checked"';
            }

            output +=
                '<span class="lobbyPlayer">' +
                    '<input class="readyCheckbox" id="' + id + '" type="checkbox" ' + checked + '>' +
                    '<label for="' + id + '">' + name + '</label>' +
                '</span>';
        } else {
            output +=
                '<span class="lobbyPlayer lobbyEmpty">' +
                    '<input class="readyCheckbox" id="empty" type="checkbox" disabled>' +
                    '<label for="empty">empty</label>' +
                '</span>'
            ;
        }
    }

    output +=
            '</div></div>' +
            '<div class="cardRight center"><div style="width: 100%; margin: 10px;">' +
                '<button id="readyUpButton" class="button green">Ready Up</button>' +
                '<button id="leaveLobbyButton" class="button">Leave Lobby</button>' +
            '</div></div>' +
        '</div>'
    ;

    $('#lobbyViewContent').append(output);

    if(blockPuzzle.ready === true) {
        $('#readyUpButton').text('Cancel');
        $('#readyUpButton').removeClass('green');
        $('#readyUpButton').addClass('red');
    } else {
        $('#readyUpButton').text('Ready Up');
        $('#readyUpButton').removeClass('red');
        $('#readyUpButton').addClass('green');
    }
}


// Updates the game view
function updateGameView() {
    
    // Set player cards
    $('#player1').val(blockPuzzle.currentLobby.users[0].name);
    $('#player2').val(blockPuzzle.currentLobby.users[1].name);
    $('#player1Image').attr('src','images/player1.png');
    $('#player2Image').attr('src','images/player2.png');
    console.log("sdf");
    
    for(var i = 0; i < GRID_SIZE; i++) {
        for(var j = 0; j < GRID_SIZE; j++) {

            var val = blockPuzzle.grid[i][j].value;
            
            if(val == 0) {
                graphicGrid[i][j].graphic = 'tile';
            } else {
                graphicGrid[i][j].graphic = 'player' + val + 'Graphic';
            }

            graphicGrid[i][j].loadTexture(graphicGrid[i][j].graphic, 0);
            graphicGrid[i][j].width = SPRITE_SIZE;
            graphicGrid[i][j].height = SPRITE_SIZE;
        }
    }
}


// Returns an object telling which sides are out of bounds
function checkBounds(piece, x, y) {
    
    var bounds = {
        any: false,
        left: false,
        right: false,
        top: false,
        bottom: false
    };


    // Check directional bounds for all blocks in piece
    for(var i = 0; i < piece.blocks.length; i++) {

        var block = piece.blocks[i];
        var x1 = x + block.x;
        var y1 = y + block.y;


        if(x1 < 0) {
            bounds.any = true;
            bounds.left = true;
        }

        if(x1 >= GRID_SIZE) {
            bounds.any = true;
            bounds.right = true;
        }

        if(y1 < 0) {
            bounds.any = true;
            bounds.top = true;
        } 

        if(y1 >= GRID_SIZE) {
            bounds.any = true;
            bounds.bottom = true;
        }
    }

    return bounds;
}


// Returns x,y of a location where the given piece is in bounds
function getValidPos(piece, x, y) {
    
    // Find x,y where the piece is in bounds
    var outOfBounds = checkBounds(piece, x, y);
    var newX = x;
    var newY = y;

    while(outOfBounds.any === true) {
        
        var moved = false;

        for(var i = 0; i < piece.blocks.length; i++) {
            
            if(outOfBounds.left === true) {
                newX++;
                moved = true;
            }

            if(outOfBounds.right === true) {
                newX--;
                moved = true;
            }

            if(outOfBounds.bottom === true) {
                newY--;
                moved = true;
            }

            if(outOfBounds.top === true) {
                newY++;
                moved = true;
            }

            if(moved == true) {
                break;
            }
        }
        outOfBounds = checkBounds(piece, newX, newY);
    }

    var inBound = new Block();
    inBound.x = newX;
    inBound.y = newY;

    return inBound;
}


$(function() {

    //switchView(Views.LOGIN);
    $('#loginView').hide();
    $('#loginView').fadeIn();


    // Logs user into server
    $("#loginButton").click(function() {
        console.log('login button pressed');
        var username = $("#usernameInput").val();

        if(username != "") {
            Client.connect(username);
        }
    });


    // Logs user out of server
    $(".logoutButton").click(function() {
        console.log('logout button pressed');
        Client.logout();
    });


    // Joins a lobby
    $('#lobbyListView').on('click', '.joinLobbyButton', function() {
        console.log("join lobby button pressed");

        var lobbyID = $(this).attr('value');
        Client.joinLobby(lobbyID);
    });


    // Leaves a lobby
    $('#lobbyView').on('click', '#leaveLobbyButton', function() {
        console.log("leave lobby button pressed");

        Client.leaveLobby();
    });


    // Changes ready state
    $('#lobbyView').on('click', '#readyUpButton', function() {
        console.log('ready up button pressed');

        blockPuzzle.ready = !blockPuzzle.ready;

        Client.readyUp(blockPuzzle.ready);
    });
});
