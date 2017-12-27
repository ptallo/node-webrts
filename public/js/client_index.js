var socket = io();
var game_rooms = [];

$(document).ready(function () {

});

$('#refresh_lobby').on('click', function(){
    refreshList();
});

$('#game_room').on('click', "button.join_room", function(){
    let gameRoom = game_rooms[$(this).parent().index()];
    sessionStorage.setItem('game_lobby', JSON.stringify(gameRoom));
    joinRoom(JSON.stringify(gameRoom));
});

$('form').on('submit', function () {
    socket.emit('add and join lobby', $('#game_name').val());
    $('#game_name').val("");
});

socket.on('add room', function(gameRoomJSON){
    addRoom(gameRoomJSON);
});

socket.on('join room', function(gameRoomJSON){
    sessionStorage.setItem('game_lobby', gameRoomJSON);
    joinRoom(gameRoomJSON);
});

socket.on('get_player', function(playerJSON){
    sessionStorage.setItem('player', playerJSON);
});

function refreshList() {
    $('#game_room').empty();
    game_rooms = [];
    socket.emit('refresh lobby list');
}

function addRoom(gameRoomJSON) {
    let gameRoom = JSON.parse(gameRoomJSON);
    game_rooms.push(gameRoom);
    $('#game_room').append("<li>" + gameRoom.name + "<button class='join_room'> Join Room</button></li>");
}

function joinRoom(gameRoomJSON) {
    socket.emit('join lobby', gameRoomJSON);
    window.location.href = "../game_room.html";
}