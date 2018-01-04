'use strict';
// browserify main.js -o bundle.js
var socket = io();
var Game = require("../../game_logic/Game.js");
var GameObject = require('../../game_logic/GameObject.js');
var PositionComponent = require('../../game_logic/component/PositionComponent.js');
var SizeComponent = require('../../game_logic/component/SizeComponent.js');

$(document).ready(function () {
    let game_id = sessionStorage.getItem('game_id');
    socket.emit('join io room', game_id);
    var game = new Game(game_id);
});