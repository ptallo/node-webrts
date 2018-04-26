'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../server/Game.js");
var Unit = require('../../server/gameObjects/Unit.js');
var Building = require('../../server/gameObjects/Building.js');

//Component requirements
var RectPhysicsComponent = require('../../server/component/RectPhysicsComponent.js');
var CirclePhysicsComponent = require('../../server/component/CirclePhysicsComponent.js');
var RenderComponent = require('../../server/component/RenderComponent.js');
var Animation = require('../../server/component/Animation.js');

//Map Requirements
var Map = require('../../server/Map.js');
var Tile = require('../../server/Tile.js');

//Gui Requirements
var Gui = require('./Gui/Gui.js');

var Utility = require('../../server/Utility.js');

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

let mouseEventHandler = {
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
        gui.activate(mouseDown);
    },
    mousemove : e => {
        mouseMoveEvent = e;
    },
    mouseup : e => {
        if(mouseDownEvent !== null){
            selectGameObjects(mouseDownEvent, e);
            gui.populate(selectedGameObjects);
        }
        mouseDownEvent = null;
        gui.deactivate();
    },
    contextmenu : e => {
        return false;
    }
};

let keyboardEventHandler = {
    onkeypress : e => {
        if (selectedGameObjects.length > 0){
            game.activate(e, selectedGameObjects);
        } else {
            //activate default game actions
        }
    },
};

window.addEventListener('resize', resizeCanvas, false);
document.onkeypress = keyboardEventHandler.onkeypress;
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

function selectGameObjects(mouseDownEvent, mouseUpEvent){
    let mouseRect = getMouseSelectionRect(mouseDownEvent, mouseUpEvent);
    
    for (let i = 0; i < game.gameObjects.length; i++){
        let collision = false;
        if (Object.keys(game.gameObjects[i].physicsComponent).indexOf("circle") > -1) {
            collision = Utility.checkRectCircleCollision(mouseRect, game.gameObjects[i].physicsComponent.circle);
        } else {
            collision = Utility.checkRectRectCollision(game.gameObjects[i].physicsComponent.rect, mouseRect);
        }
        if (collision){
            selectedGameObjects.push(game.gameObjects[i]);
        }
    }
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
    for (let i = 0; i < serverGame.gameObjects.length; i++){
        let gameObject = assignObject(serverGame.gameObjects[i]);
        for (let property in gameObject){
            if (property.includes("Component")){
                gameObject[property] = assignObject(gameObject[property]);
            }
        }
        game.gameObjects.push(gameObject);
        for (let j = 0; j < selectedGameObjects.length; j++){
            if (gameObject.id === selectedGameObjects[j].id){
                selectedGameObjects.splice(j, 1);
                selectedGameObjects.push(gameObject);
            }
        }
    }
});

function assignObject(object){
    if (Object.keys(object).indexOf("type") > -1) {
       if (object.type === "Building"){
           return Object.assign(new Building, object);
       } else if (object.type === "CirclePhysicsComponent"){
           return Object.assign(new CirclePhysicsComponent, object);
       } else if (object.type === "RectPhysicsComponent"){
           return Object.assign(new RectPhysicsComponent, object);
       } else if (object.type === "RenderComponent"){
           for (let i = 0; i < object.animations.length; i++){
               object.animations[i].value = Object.assign(new Animation, object.animations[i].value);
           }
           if (object.currentAnimation !== null){
               object.currentAnimation = Object.assign(new Animation, object.currentAnimation);
           }
           return Object.assign(new RenderComponent, object);
       }  else if (object.type === "Unit"){
           return Object.assign(new Unit, object);
       }
    } else {
        return object;
    }
}
