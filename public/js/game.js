'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../game_logic/Game.js");
var GameObject = require('../../game_logic/GameObject.js');
var PositionComponent = require('../../game_logic/component/PositionComponent.js');
var SizeComponent = require('../../game_logic/component/SizeComponent.js');
var VelocityComponent = require('../../game_logic/component/VelocityComponent.js');

//Other global variables which need to be expressed
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
let game_id = sessionStorage.getItem('game_id');
var game = new Game(game_id);


$(document).ready(function () {
    socket.emit('join io room', game_id);
    try {
        drawGame(game);
    } catch (e) {
        $('p').text(e);
    }
});

function drawGame() {
    ctx.fillStyle = "#38cceb";
    for (let i = 0; i < game.gameObjects.length; i++) {
        let gameObject = game.gameObjects[i];
        let x = gameObject.positionComponent.x;
        let y = gameObject.positionComponent.y;
        let width = gameObject.sizeComponent.width;
        let height = gameObject.sizeComponent.height;
        $('p').text(x + ", " + y + ", " + width + ", " + height);
        ctx.fillRect(x, y, width, height);
    }
}