var socket = io();

try {
    var test = new PositionComponent(20, 20);
    $('p').text('position component instantiated');
} catch (e) {
    alert(e);
}

$(document).ready(function () {
    let game_id = sessionStorage.getItem('game_id');
    socket.emit('join io room', game_id);
});