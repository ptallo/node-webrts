'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../server/Game.js");
var GameObject = require('../../server/GameObject.js');
var PhysicsComponent = require('../../server/component/PhysicsComponent.js');
var RenderComponent = require('../../server/component/RenderComponent.js');

//Other global variables which need to be expressed
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var game_id = sessionStorage.getItem('game_id');

var game = new Game(game_id);

var mouseDownEvent = null;
var mouseMoveEvent = null;
var selectedGameObjects = [];


$('body').on('contextmenu', '#game_canvas', function(e){
    //disabling context menu while right clicking on the canvas
    return false;
});

$(document).ready(function () {
    socket.emit('join io room', game_id);
    setInterval(
        function (){
            drawGame();
            game.update();
        },
        0
    );
});

document.addEventListener('mousedown', function(e){
    let rect = canvas.getBoundingClientRect();
    mouseDownEvent = e;
    let mouseDown = {
        x : mouseDownEvent.pageX - rect.left,
        y : mouseDownEvent.pageY - rect.top
    };

    if (e.which === 1) {
        selectedGameObjects = [];
    } else if (e.which === 3) {
        game.moveObjects(
            selectedGameObjects,
            mouseDown
        );

        socket.emit(
            'move objects',
            game_id,
            JSON.stringify(mouseDown),
            JSON.stringify(selectedGameObjects)
        );
    }
});

document.addEventListener('mouseup', function(e) {
    if(mouseDownEvent != null){
        selectUnits(mouseDownEvent, e);
    }
    mouseDownEvent = null;
});

document.addEventListener('mousemove', function(e){
    mouseMoveEvent = e;
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMouse(mouseDownEvent, mouseMoveEvent);
}

function getMouseRect(mouseDownEvent, mouseUpEvent){
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
        x : Math.min(mouseDown.x , mouseUp.x),
        y : Math.min(mouseDown.y, mouseUp.y),
        width : Math.abs(mouseDown.x - mouseUp.x),
        height : Math.abs(mouseDown.y - mouseUp.y)
    };

    return mouseRect;
}

function drawMouse(mouseDownEvent, mouseMoveEvent){
    if(mouseDownEvent != null && mouseMoveEvent != null && mouseMoveEvent.which == 1){
        let mouseRect = getMouseRect(mouseDownEvent, mouseMoveEvent);
        ctx.fillStyle = "#485157";
        ctx.strokeRect(mouseRect.x, mouseRect.y, mouseRect.width, mouseRect.height);
    }
}

function selectUnits(mouseDownEvent, mouseUpEvent){
    let mouseRect = getMouseRect(mouseDownEvent, mouseUpEvent);

    for(let i = 0; i < game.gameObjects.length; i++){
        let gameObject = game.gameObjects[i];
        let x = gameObject.physicsComponent.x;
        let y = gameObject.physicsComponent.y;
        let width = gameObject.physicsComponent.width;
        let height = gameObject.physicsComponent.height;
        if( x < mouseRect.x + mouseRect.width && x + width  > mouseRect.x &&
            y < mouseRect.y + mouseRect.height && y + height > mouseRect.y) {
            selectedGameObjects.push(gameObject);
        }
        $('#test1').text(JSON.stringify(selectedGameObjects));
    }
}

socket.on('update game', function(gameJSON){
    let serverGame = JSON.parse(gameJSON);
    game.gameObjects = [];
    for(let i = 0; i < serverGame.gameObjects.length; i++) {
        let object = Object.assign(new GameObject, serverGame.gameObjects[i]);
        object.physicsComponent = Object.assign(new PhysicsComponent, object.physicsComponent);
        object.renderComponent = Object.assign(new RenderComponent, object.renderComponent);
        game.gameObjects.push(object);
    }
});
