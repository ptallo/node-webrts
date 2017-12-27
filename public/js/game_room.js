var socket = io();

$(document).ready(function(){
    let gameRoomJSON = sessionStorage.getItem('game_lobby');
    socket.emit('update game lobby', gameRoomJSON);
    socket.emit('join io room', JSON.parse(gameRoomJSON).id);
});

$('#leave_room').on('click', function(){
    socket.emit('leave lobby', sessionStorage.getItem('game_lobby'), sessionStorage.getItem('player'));
    window.location.href = "index.html";
});

$('#start_game').on('click', function(){
    socket.emit('check game ready', sessionStorage.getItem('game_lobby'));
});

$('#ready_check').change(function(){
    let player = JSON.parse(sessionStorage.getItem('player'));
    player.isReady = this.checked;
    let playerJSON = JSON.stringify(player);
    sessionStorage.setItem('player', playerJSON);
    socket.emit('update lobby', sessionStorage.getItem('game_lobby'), sessionStorage.getItem('player'));
});

socket.on('update game', function(gameJSON){
    sessionStorage.setItem('game_lobby', gameJSON);
    updateGameHTML();
});

socket.on('start game', function (gameId, gameRoomJSON) {
    socket.emit('leave io room', gameRoomJSON);
    sessionStorage.setItem('game_id', gameId);
    window.location.href = "game.html";
});

socket.on('start game failed', function () {
    alert('start game failed');
});

function updateGameHTML() {
    let game = JSON.parse(sessionStorage.getItem('game_lobby'));
    $('#name').text(game.id);
    $('#player_info tr').remove();
    $('#player_info').append("<tr> <th> Player </th> <th> Ready Status </th> </tr>");
    for (let i = 0; i < game.players.length; i++) {
        $('#player_info').append("<tr> <td>" + game.players[i].id + "</td> <td>" + game.players[i].isReady + "</th> </tr>");
    }
}