'use strict';
// browserify main.js -o bundle.js
var socket = io();
var GameObject = require('../../game_logic/GameObject.js');
var PositionComponent = require('../../game_logic/component/PositionComponent.js');
var SizeComponent = require('../../game_logic/component/SizeComponent.js');

try {
    var test = new GameObject(20, 20, 20, 20);
    $('p').text("game object: " + JSON.stringify(test));
} catch (e) {
    $('p').text(e);
}


$(document).ready(function () {
    let game_id = sessionStorage.getItem('game_id');
    socket.emit('join io room', game_id);
});