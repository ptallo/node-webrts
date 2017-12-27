var socket = io();

$(document).ready(function () {
    let game_id = sessionStorage.getItem('game_id');
    socket.emit('join io room', game_id);
});