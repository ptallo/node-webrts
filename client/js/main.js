'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../server/Game.js");
var GameObject = require('../../server/GameObject.js');
var PositionComponent = require('../../server/component/PositionComponent.js');
var SizeComponent = require('../../server/component/SizeComponent.js');
var VelocityComponent = require('../../server/component/VelocityComponent.js');

//Other global variables which need to be expressed
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
let game_id = sessionStorage.getItem('game_id');

var game = new Game(game_id);

$(document).ready(function () {
    socket.emit('join io room', game_id);
    window.requestAnimationFrame(drawGame);
});

function drawGame() {
    ctx.fillStyle = "#38cceb";
    for (let i = 0; i < game.gameObjects.length; i++) {
        let gameObject = game.gameObjects[i];
        let x = gameObject.positionComponent.x;
        let y = gameObject.positionComponent.y;
        let width = gameObject.sizeComponent.width;
        let height = gameObject.sizeComponent.height;
        ctx.fillRect(x, y, width, height);
    }
}

document.addEventListener('keydown', function(e){
    if(e.key == "ArrowRight"){
        $('p').text('right');
    }
    if(e.key == "ArrowLeft"){
        $('p').text('left');
    }
    if(e.key == "ArrowUp"){
        $('p').text('up');
    }
    if(e.key == "ArrowDown"){
        $('p').text('down');
    }
});

canvas.addEventListener('mousedown', function(e){
    let rect = canvas.getBoundingClientRect();
    let mouse = {
        x : e.pageX - rect.left,
        y : e.pageY - rect.top
    };
    $('p').text(JSON.stringify(mouse));
});

canvas.addEventListener('mouseup', function(e){
    let rect = canvas.getBoundingClientRect();
    let mouse = {
        x : e.pageX - rect.left,
        y : e.pageY - rect.top
    };
    $('p').text(JSON.stringify(mouse));
});
