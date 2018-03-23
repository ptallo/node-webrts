'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../server/Game.js");
var GameObject = require('../../server/GameObject.js');
var PhysicsComponent = require('../../server/component/PhysicsComponent.js');
var RenderComponent = require('../../server/component/RenderComponent.js');
var Animation = require('../../server/component/Animation.js');
var Map = require('../../server/Map.js');
var Tile = require('../../server/Tile.js');
var Gui = require('./Gui/Gui.js');

//Other global variables which need to be expressed
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var game_id = sessionStorage.getItem('game_id');

var game = new Game(game_id);
var gui = new Gui();

var transform = {
    x : 0,
    y : 0
};

var translateOn = {
    x : false,
    y : false
};

var mouseDownEvent = null;
var mouseMoveEvent = null;
var selectedGameObjects = [];

var distanceFromWindow = 50; //mouse distance away from the window that will cause the window to move

$(document).ready(function () {
    socket.emit('join io room', game_id);
    resizeCanvas();
    setInterval(
        function (){
            if (mouseMoveEvent !== null) {
                translateCanvas();
            }
            clearCanvas();
            game.update();
            drawSelectionRect(mouseDownEvent, mouseMoveEvent);
            gui.draw(transform);
        },
        0
    );
});

var mouseEventHandler = {
    mousedown : e => {
        mouseDownEvent = e;
        let mouseDown = getMouseCoords(mouseDownEvent);

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
    },
    mousemove : e => {
        mouseMoveEvent = e;
    },
    mouseup : e => {
        if(mouseDownEvent != null){
            selectUnits(mouseDownEvent, e);
        }
        mouseDownEvent = null;
    },
    contextmenu : e => {
        return false;
    }
};

window.addEventListener('resize', resizeCanvas, false);
canvas.onmousedown = mouseEventHandler.mousedown;
canvas.onmousemove = mouseEventHandler.mousemove;
canvas.onmouseup = mouseEventHandler.mouseup;
canvas.oncontextmenu = mouseEventHandler.contextmenu;

function clearCanvas(){
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.restore();
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.setTransform(1, 0, 0, 1, transform.x, transform.y);
}

function translateCanvas(){
    let mouseCoords = getMouseCoords(mouseMoveEvent);
    let translate = {
        x : 0,
        y : 0
    };

    let aboveGui = mouseCoords.y < canvas.height - transform.y - gui.rect.height;
    ctx.fillStyle = "#000000";
    ctx.fillText(JSON.stringify(aboveGui), 10 - transform.x, 10 - transform.x);
    
    if (mouseCoords.x < distanceFromWindow - transform.x && aboveGui){
        translate.x = 1;
    } else if (mouseCoords.x> canvas.width - distanceFromWindow - transform.x && aboveGui) {
        translate.x = -1;
    } else {
        translate.x = 0;
    }

    if (mouseCoords.y < distanceFromWindow - transform.y){
        translate.y = 1;
    } else if (mouseCoords.y > canvas.height - distanceFromWindow - transform.y - gui.rect.height && mouseCoords.y < canvas.height - gui.rect.height - transform.y) {
        translate.y = -1;
    } else {
        translate.y = 0;
    }

    ctx.translate(translate.x, translate.y);
    transform.x += translate.x;
    transform.y += translate.y;
}

function selectUnits(mouseDownEvent, mouseUpEvent){
    let mouseRect = getMouseSelectionRect(mouseDownEvent, mouseUpEvent);
    
    for (let i = 0; i < game.gameObjects.length; i++){
        if (checkCircleRectCollision(game.gameObjects[i].physicsComponent.circle, mouseRect)){
            selectedGameObjects.push(game.gameObjects[i]);
        }
    }
}

function checkCircleRectCollision(circle, rect){
    let dx = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let dy = circle.y - Math.max(rect.y, Math.min(circle.y , rect.y + rect.height));
    let collision = Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(circle.radius, 2);
    return collision;
}

function drawSelectionRect(mouseDownEvent, mouseMoveEvent){
    if(mouseDownEvent != null && mouseMoveEvent != null && mouseMoveEvent.which === 1){
        let mouseRect = getMouseSelectionRect(mouseDownEvent, mouseMoveEvent);
        ctx.strokeStyle = "#485157";
        ctx.strokeRect(mouseRect.x, mouseRect.y, mouseRect.width, mouseRect.height);
    }
}

function getMouseSelectionRect(mouseDownEvent, mouseUpEvent){
    let mouseDown = getMouseCoords(mouseDownEvent);
    let mouseUp = getMouseCoords(mouseUpEvent);

    let mouseRect = {
        x : Math.min(mouseDown.x , mouseUp.x),
        y : Math.min(mouseDown.y, mouseUp.y),
        width : Math.abs(mouseDown.x - mouseUp.x),
        height : Math.abs(mouseDown.y - mouseUp.y)
    };

    return mouseRect;
}

function getMouseCoords(mouseEvent){
    let rect = canvas.getBoundingClientRect();
    let mouseCoords = {
        x : mouseEvent.pageX - rect.left - transform.x,
        y : mouseEvent.pageY - rect.top - transform.y
    };
    return mouseCoords;
}

socket.on('update game', function(gameJSON){
    let serverGame = JSON.parse(gameJSON);
    game.gameObjects = [];
    for(let i = 0; i < serverGame.gameObjects.length; i++) {
        let object = Object.assign(new GameObject, serverGame.gameObjects[i]);
        object.physicsComponent = Object.assign(new PhysicsComponent, object.physicsComponent);
        object.renderComponent = Object.assign(new RenderComponent, object.renderComponent);
        for (let animation in object.renderComponent.animations){
            object.renderComponent.animations = Object.assign(new Animation, animation);
        }
        object.renderComponent.currentAnimation = Object.assign(new Animation, object.renderComponent.currentAnimation);
        game.gameObjects.push(object);
    }
    game.map = Object.assign(new Map, game.map);
    let keysList = Object.keys(game.map.tileDef);
    for(let i = 0; i < keysList.length; i++){
        game.map.tileDef[keysList[i]] = Object.assign(new Tile, game.map.tileDef[keysList[i]]);
    }
});
