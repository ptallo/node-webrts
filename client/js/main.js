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

//Other global variables which need to be expressed
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var game_id = sessionStorage.getItem('game_id');

var game = new Game(game_id);

var totalTranslate = {
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
    setInterval(
        function (){
            translateCanvas();
            ctx.clearRect(-totalTranslate.x, -totalTranslate.y, canvas.width, canvas.height);
            game.update();
            drawSelectionRect(mouseDownEvent, mouseMoveEvent);
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
        checkTranslateCanvas(mouseMoveEvent);
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

canvas.onmousedown = mouseEventHandler.mousedown;
canvas.onmousemove = mouseEventHandler.mousemove;
canvas.onmouseup = mouseEventHandler.mouseup;
canvas.oncontextmenu = mouseEventHandler.contextmenu;

function checkTranslateCanvas(e){
    let mouseCoords = getMouseCoords(e);

    let translate = {
        x : false,
        y: false
    };

    if(mouseCoords.x < distanceFromWindow - totalTranslate.x || mouseCoords.x> canvas.width - distanceFromWindow - totalTranslate.x){
        translate.x = true;
    } else {
        translate.x = false;
    }

    if(mouseCoords.y < distanceFromWindow - totalTranslate.y || mouseCoords.y > canvas.height - distanceFromWindow - totalTranslate.y){
        translate.y = true;
    } else {
        translate.y = false;
    }

    translateOn = translate;
}

function translateCanvas(){
    let mouseCoords = getMouseCoords(mouseMoveEvent);
    let translate = {
        x : 0,
        y : 0
    };

    if(mouseCoords.x < distanceFromWindow - totalTranslate.x){
        translate.x = 1;
    } else if (mouseCoords.x> canvas.width - distanceFromWindow - totalTranslate.x) {
        translate.x = -1;
    } else {
        translate.x = 0;
    }

    if(mouseCoords.y < distanceFromWindow - totalTranslate.y){
        translate.y = 1;
    } else if (mouseCoords.y > canvas.height - distanceFromWindow - totalTranslate.y) {
        translate.y = -1;
    } else {
        translate.y = 0;
    }

    ctx.translate(translate.x, translate.y);
    totalTranslate.x += translate.x;
    totalTranslate.y += translate.y;
}

function selectUnits(mouseDownEvent, mouseUpEvent){
    let mouseRect = getMouseSelectionRect(mouseDownEvent, mouseUpEvent);
    
    selectedGameObjects = [];
    for (let i = 0; i < game.gameObjects.length; i++){
        if (checkCircleRectCollision(game.gameObjects[i].physicsComponent.circle, mouseRect)){
            selectedGameObjects.push(game.gameObjects[i]);
        }
    }
    $('#test1').text(JSON.stringify(selectedGameObjects));
}

function checkCircleRectCollision(circle, rect){
    let dx = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let dy = circle.y - Math.max(rect.y, Math.min(circle.y , rect.y + rect.height));
    let collision = Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(circle.radius, 2);
    console.log('col: ' + collision);
    return collision;
}

function getRectVertices(rect){
    let vertices = [];
    
    let v1 = {
        x : rect.x,
        y : rect.y
    };
    
    let v2 = {
        x : rect.x + rect.width,
        y : rect.y
    };
    
    let v3 = {
        x : rect.x,
        y : rect.y + rect.height
    };
    
    let v4 = {
        x : rect.x + rect.width,
        y : rect.y + rect.height
    };
    
    vertices.push(v1);
    vertices.push(v2);
    vertices.push(v3);
    vertices.push(v4);
    
    return vertices;
}

function drawSelectionRect(mouseDownEvent, mouseMoveEvent){
    if(mouseDownEvent != null && mouseMoveEvent != null && mouseMoveEvent.which === 1){
        let mouseRect = getMouseSelectionRect(mouseDownEvent, mouseMoveEvent);
        ctx.fillStyle = "#485157";
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
        x : mouseEvent.pageX - rect.left - totalTranslate.x,
        y : mouseEvent.pageY - rect.top - totalTranslate.y
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
