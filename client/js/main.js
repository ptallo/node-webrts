'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../server/Game.js");
var GameObject = require('../../server/GameObject.js');
var PositionComponent = require('../../server/component/PositionComponent.js');
var SizeComponent = require('../../server/component/SizeComponent.js');
var VelocityComponent = require('../../server/component/VelocityComponent.js');
var Player = require('../../server/Player.js');

//Other global variables which need to be expressed
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var game_id = sessionStorage.getItem('game_id');

var game = new Game(game_id);
var player = new Player();

var mousedown = null;
var mousePair = null;

$(document).ready(function () {
    socket.emit('join io room', game_id);
    setInterval(drawGame, 1000/60);
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#38cceb";
    for (let i = 0; i < game.gameObjects.length; i++) {
        let gameObject = game.gameObjects[i];
        let x = gameObject.positionComponent.x;
        let y = gameObject.positionComponent.y;
        let width = gameObject.sizeComponent.width;
        let height = gameObject.sizeComponent.height;
        ctx.fillRect(x, y, width, height);
    }

    if (mousePair != null){
        ctx.fillStyle = "#494961";
        ctx.strokeRect(mousePair.xSmall, mousePair.ySmall, mousePair.xLarge - mousePair.xSmall, mousePair.yLarge - mousePair.ySmall);
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

document.addEventListener('mousedown', function(e){
    let rect = canvas.getBoundingClientRect();
    let mouse = {
        x : e.pageX - rect.left,
        y : e.pageY - rect.top
    };
    mousedown = mouse;
    player.selectedGameObjects.empty();
});

document.addEventListener('mouseup', function(e) {
    let selectedGameObjects = [];
    for(let i = 0; i < game.gameObjects.length; i++){
        let gameObject = game.gameObjects[i];
        let x = gameObject.positionComponent.x;
        let y = gameObject.positionComponent.y;
        if(x > mousePair.xSmall && x < mousePair.xLarge && y > mousePair.ySmall && y < mousePair.yLarge){
            selectedGameObjects.push(gameObject);
        }
    }
    player.selectedGameObjects = selectedGameObjects;
    mousedown = null;
    mousePair = null;
});

document.addEventListener('mousemove', function(e){
    let rect = canvas.getBoundingClientRect();
    let mouse = {
        x: e.pageX - rect.left,
        y: e.pageY - rect.top
    };

    if (mousedown != null) {
        mousePair = {
            xSmall: (mouse.x > mousedown.x) ? mousedown.x : mouse.x,
            xLarge: (mouse.x > mousedown.x) ? mouse.x : mousedown.x,
            ySmall: (mouse.y > mousedown.y) ? mousedown.y : mouse.y,
            yLarge: (mouse.y > mousedown.y) ? mouse.y : mousedown.y
        };
    }
});
