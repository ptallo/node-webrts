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
var game_id = sessionStorage.getItem('game_id');

var game = new Game(game_id);

var mouseDownEvent = null;
var selectedGameObjects = [];

$(document).ready(function () {
    socket.emit('join io room', game_id);
    setInterval(drawGame, 1000/60);
});

document.addEventListener('mousedown', function(e){
    mouseDownEvent = e;
});

document.addEventListener('mouseup', function(e) {
    if(mouseDownEvent != null){
        selectUnits(mouseDownEvent, e);
    }
});

document.addEventListener('mousemove', function(e){

});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameObjects();
}

function drawGameObjects(){
    for (let i = 0; i < game.gameObjects.length; i++) {
        let gameObject = game.gameObjects[i];

        let inArray = false;
        for(let j = 0; j < selectedGameObjects.length; j++){
            let selectedGameObject = selectedGameObjects[j];
            if(selectedGameObject.id == gameObject.id){
                inArray = true;
            }
        }

        if(inArray){
            ctx.fillStyle = '#FF0000';
        } else{
            ctx.fillStyle = '#43f7ff';
        }


        let x = gameObject.positionComponent.x;
        let y = gameObject.positionComponent.y;
        let width = gameObject.sizeComponent.width;
        let height = gameObject.sizeComponent.height;
        ctx.fillRect(x, y, width, height);
    }
}

function selectUnits(mouseDownEvent, mouseUpEvent){
    let rect = canvas.getBoundingClientRect();

    let mouseDown = {
        x : mouseDownEvent.pageX - rect.left,
        y : mouseDownEvent.pageY - rect.top
    };

    let mouseUp = {
        x : mouseUpEvent.pageX - rect.left,
        y : mouseUpEvent.pageY - rect.top
    };

    let mouseRect = {
        x : mouseDown.x > mouseUp.x ? mouseUp.x : mouseDown.x,
        y : mouseDown.y > mouseUp.y ? mouseUp.y : mouseDown.y,
        width : mouseDown.x > mouseUp.x ? mouseDown.x - mouseUp.x : mouseUp.x - mouseDown.x,
        height : mouseDown.y > mouseUp.y ? mouseDown.y - mouseUp.y : mouseUp.y - mouseDown.y
    };

    $('#test2').text(JSON.stringify(mouseRect));

    selectedGameObjects = [];
    for(let i = 0; i < game.gameObjects.length; i++){
        let gameObject = game.gameObjects[i];
        let x = gameObject.positionComponent.x;
        let y = gameObject.positionComponent.y;
        let width = gameObject.sizeComponent.width;
        let height = gameObject.sizeComponent.height;
        if( x < mouseRect.x + mouseRect.width && x + width  > mouseRect.x &&
            y < mouseRect.y + mouseRect.height && y + height > mouseRect.y) {
            selectedGameObjects.push(gameObject);
        }
    }
    $('#test1').text(JSON.stringify(selectedGameObjects));
}
