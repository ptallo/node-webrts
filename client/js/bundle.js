(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Section = require('./Section.js');
var GuiItem = require('./GuiItem.js');

class Gui {
    constructor(){
        this.sections = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
        let section = new Section(0.05, 0.1);
        for(let i = 0; i < 18; i++){
            section.addItem(new GuiItem(30, 30, 0.10, 0.10));
        }
        this.sections.push(section);
        this.sections.push(new Section(0, 0));
        this.sections.push(new Section(0.05, 0.1));
    }
    draw(transform){
        if (typeof window !== 'undefined' && window.document) {
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            
            this.rect.x = -transform.x;
            this.rect.y = -transform.y + (canvas.height * 0.75);
            this.rect.width = canvas.width;
            this.rect.height = (canvas.height * 0.25);
            
            context.fillStyle = "#f500e5";
            context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            
            for (let i = 0; i < this.sections.length; i++) {
                this.sections[i].draw(this.rect, this.sections.length, i);
            }
        }
    }
    activate(mouseDownCoords){
        for (let i = 0; i < this.sections.length; i++){
            this.sections[i].activate(mouseDownCoords);
        }
    }
    deactivate(){
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i].deactivate();
        }
    }
}

module.exports = Gui;
},{"./GuiItem.js":2,"./Section.js":3}],2:[function(require,module,exports){

class GuiItem{
    constructor(width, height, xBuffer, yBuffer){
        this.rect = {
            x : 0,
            y : 0,
            width : width,
            height : height,
            outerWidth : width + width * xBuffer,
            outerHeight : height + height * yBuffer
        };
        this.xBuffer = xBuffer;
        this.yBuffer = yBuffer;
        this.fillStyle = "#1b15ee";
    }
    draw(sectionRect, itemNumber) {
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');
        
        let numberItemsX = Math.floor(sectionRect.width / this.rect.outerWidth);
        let numberItemsY = Math.floor(sectionRect.height / this.rect.outerHeight);
        
        if (itemNumber < numberItemsX * numberItemsY) {
            let xPos = itemNumber % numberItemsX;
            let yPos = Math.floor(itemNumber / numberItemsX);
    
            this.rect.x = sectionRect.x + (xPos * this.rect.outerWidth) + (this.rect.width * this.xBuffer);
            this.rect.y = sectionRect.y + (yPos * this.rect.outerHeight) + (this.rect.height * this.yBuffer);
    
            context.fillStyle = this.fillStyle;
            context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        }
    }
    activate(mouseDownCoords){
        if (mouseDownCoords.x > this.rect.x &&
            mouseDownCoords.x < this.rect.x + this.rect.width &&
            mouseDownCoords.y > this.rect.y &&
            mouseDownCoords.y < this.rect.y + this.rect.height){
            this.fillStyle = "#FF0000";
        }
    }
    deactivate(){
        this.fillStyle = "#1b15ee";    }
}

module.exports = GuiItem;
},{}],3:[function(require,module,exports){

class Section{
    constructor(xBuffer, yBuffer){
        this.items = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
        this.xBuffer = xBuffer;
        this.yBuffer = yBuffer;
    }
    draw(guiRect, numberOfSections, sectionNumber){
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');

        this.rect.width = guiRect.width * (1 - this.xBuffer) / numberOfSections;
        this.rect.height = guiRect.height * (1 - this.yBuffer);
        this.rect.x = guiRect.x + (guiRect.width * sectionNumber / numberOfSections) + (guiRect.width * this.xBuffer / 2 / numberOfSections);
        this.rect.y = guiRect.y + (guiRect.height * this.yBuffer / 2);

        context.fillStyle = "#7b31a2";
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].draw(this.rect, i);
        }
    }
    addItem(item){
        this.items.push(item);
    }
    activate(mouseDownCoords){
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].activate(mouseDownCoords);
        }
    }
    deactivate(){
        for (let i = 0; i < this.items.length; i++){
           this.items[i].deactivate();
        }
    }
}

module.exports = Section;
},{}],4:[function(require,module,exports){
'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../server/Game.js");
var GameObject = require('../../server/gameObjects/GameObject.js');
var Building = require('../../server/gameObjects/Building.js');

//Component requirements
var RectPhysicsComponent = require('../../server/component/RectPhysicsComponent.js');
var CirclePhysicsComponent = require('../../server/component/CirclePhysicsComponent.js');
var RenderComponent = require('../../server/component/RenderComponent.js');
var Animation = require('../../server/component/Animation.js');
var ActionComponent = require('../../server/component/ActionComponent.js');
var Action = require('../../server/component/Action.js');

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

var translateOn = {
    x : false,
    y : false
};

var mouseDownEvent = null;
var mouseMoveEvent = null;
var selectedGameObjects = [];
var priorityGameObject = null;

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
        if(mouseDownEvent != null){
            selectUnits(mouseDownEvent, e);
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
        //call game.activate() with relevant gameObject selected
    },
    onkeydown : e => {
    
    },
    onkeyup : e => {
    
    }
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

function selectUnits(mouseDownEvent, mouseUpEvent){
    let mouseRect = getMouseSelectionRect(mouseDownEvent, mouseUpEvent);
    
    for (let i = 0; i < game.gameObjects.length; i++){
        let collision = false;
        if (Object.keys(game.gameObjects[i].physicsComponent).indexOf("circle") > -1) {
            collision = Utility.checkCircleRectCollision(mouseRect, game.gameObjects[i].physicsComponent.circle);
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
    }
});

function assignObject(object){
    if (Object.keys(object).indexOf("type") > -1) {
       if (object.type === "ActionComponent"){
            for (let i = 0; i < object.actions.length; i++) {
                object.actions[i] = Object.assign(new Action, object.actions[i]);
            }
            return Object.assign(new ActionComponent, object);
        } else if (object.type === "Building"){
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
        } else if (object.type === "GameObject"){
            return Object.assign(new GameObject, object);
        } else {
            return object;
        }
    }
}

},{"../../server/Game.js":15,"../../server/Map.js":16,"../../server/Tile.js":17,"../../server/Utility.js":18,"../../server/component/Action.js":19,"../../server/component/ActionComponent.js":20,"../../server/component/Animation.js":21,"../../server/component/CirclePhysicsComponent.js":22,"../../server/component/RectPhysicsComponent.js":23,"../../server/component/RenderComponent.js":24,"../../server/gameObjects/Building.js":26,"../../server/gameObjects/GameObject.js":27,"./Gui/Gui.js":1}],5:[function(require,module,exports){
'use strict';
module.exports = require('./lib/index');

},{"./lib/index":10}],6:[function(require,module,exports){
'use strict';

var randomFromSeed = require('./random/random-from-seed');

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

},{"./random/random-from-seed":13}],7:[function(require,module,exports){
'use strict';

var encode = require('./encode');
var alphabet = require('./alphabet');

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;

},{"./alphabet":6,"./encode":9}],8:[function(require,module,exports){
'use strict';
var alphabet = require('./alphabet');

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;

},{"./alphabet":6}],9:[function(require,module,exports){
'use strict';

var randomByte = require('./random/random-byte');

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;

},{"./random/random-byte":12}],10:[function(require,module,exports){
'use strict';

var alphabet = require('./alphabet');
var encode = require('./encode');
var decode = require('./decode');
var build = require('./build');
var isValid = require('./is-valid');

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = require('./util/cluster-worker-id') || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;

},{"./alphabet":6,"./build":7,"./decode":8,"./encode":9,"./is-valid":11,"./util/cluster-worker-id":14}],11:[function(require,module,exports){
'use strict';
var alphabet = require('./alphabet');

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;

},{"./alphabet":6}],12:[function(require,module,exports){
'use strict';

var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;

},{}],13:[function(require,module,exports){
'use strict';

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};

},{}],14:[function(require,module,exports){
'use strict';

module.exports = 0;

},{}],15:[function(require,module,exports){
'use strict';
var shortid = require('shortid');
var GameObject = require('./gameObjects/GameObject.js');
var Building = require('./gameObjects/Building.js');
var Map = require('./Map.js');

class Game{
    constructor(id="none"){
        this.type = "Game";
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 200, 8, 16, 29, 'images/character.png'));
        this.gameObjects.push(new Building(0, 0, 128, 128, 'images/building.png'));
        this.gameObjects.push(new GameObject(200, 200, 8, 16, 29, 'images/character.png'));
        this.map = new Map();
    }
    update(){
        this.map.drawMap();
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(this.gameObjects, this.map);
        }
    }
    moveObjects(objects, mouseCords){
        for(let i = 0; i < this.gameObjects.length; i++){
            for(let j = 0; j < objects.length; j++){
                if (this.gameObjects[i].id === objects[j].id){
                    this.gameObjects[i].updateDestination(mouseCords.x, mouseCords.y);
                }
            }
        }
    }
    activate(keyEvent, gameObject){
        for (let i = 0; i < gameObjects.length; i++){
            if (gameObjects[i].id = gameObject.id && Object.keys(gameObjects[i]).indexOf('actionComponent') > -1){
                gameObjects[i].actionComponent.activate(keyEvent);
            }
        }
    }
}

module.exports = Game;

},{"./Map.js":16,"./gameObjects/Building.js":26,"./gameObjects/GameObject.js":27,"shortid":5}],16:[function(require,module,exports){
var Tile = require('./Tile.js');

class Map{
    constructor(){
        this.type = "Map";
        this.tileHeight = 64;
        this.tileWidth = 64;
        this.mapDef = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 3, 3, 1],
            [1, 2, 2, 1, 3, 3, 1],
            [1, 2, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 1, 1, 1],
            [1, 2, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ];
        this.tileDef = {
            1 : new Tile('images/grasstile.png', true, true),
            2 : new Tile('images/sandtile.png', false, true),
            3 : new Tile('images/swamp.png', false, false)
        }
    }
    drawMap(){
        for(let i = 0; i < this.mapDef.length; i++){
            for(let j = 0; j < this.mapDef[i].length; j++){
                let point = {};
                point.x = j * this.tileWidth;
                point.y = i * this.tileHeight;
                let tileType = this.mapDef[i][j];
                let tile = this.tileDef[tileType];
                tile.draw(point);
            }
        }
    }
    getUnmovableMapRects(){
        let rectList = [];
        for (let i = 0; i < this.mapDef.length; i++) {
            for (let j = 0; j < this.mapDef[i].length; j++){
                let tileType = this.mapDef[i][j];
                let tile = this.tileDef[tileType];
                if (!tile.isMovable) {
                    let tileRect = {
                        x : j * this.tileWidth,
                        y : i * this.tileHeight,
                        width : this.tileWidth,
                        height : this.tileHeight
                    };
                    rectList.push(tileRect);
                }
            }
        }
        return rectList;
    }

}

module.exports = Map;
},{"./Tile.js":17}],17:[function(require,module,exports){
var RenderComponent = require('./component/RenderComponent.js');

class Tile {
    constructor(url, movable, buildable){
        this.type = "Tile";
        this.renderComponent = new RenderComponent(url);
        this.isMovable = movable;
        this.isBuildable = buildable;
    }
    draw(point){
        this.renderComponent.draw(point);
    }
}

module.exports = Tile;
},{"./component/RenderComponent.js":24}],18:[function(require,module,exports){

class Utility {
    static checkRectRectCollision(rect1, rect2){
        return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y;
    }
    static checkCircleRectCollision(rect, circle){
        let DeltaX = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        let DeltaY = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        return (DeltaX * DeltaX + DeltaY * DeltaY) < (circle.radius * circle.radius);
    }
    static checkCircleCircleCollision(circle1, circle2) {
        let dx = circle1.x - circle2.x;
        let dy = circle1.y - circle2.y;
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return distance < circle1.radius + circle2.radius;
    }
}

module.exports = Utility;
},{}],19:[function(require,module,exports){

class Action{
    constructor(activationFunction, key){
        this.type = "Action";
        this.activationFunction = activationFunction;
        this.key = key;
    }
    activate(){
        this.activationFunction();
    }
}

module.exports = Action;
},{}],20:[function(require,module,exports){
var Action = require('./Action.js');

class ActionComponent {
    constructor(){
        this.type = "ActionComponent";
        this.actions = [];
        this.keys = ['q', 'w', 'e', 'r', 't', 'y', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'];
    }
    addAction(activationFunction){
        let key = this.keys[this.actions.length];
        let action = new Action(activationFunction, key);
        this.actions.push(action);
    }
    getActions(){
        return this.actions;
    }
    activate(keyEvent){
        let index = this.keys.indexOf(keyEvent.key);
        if (index > -1){
            let action = this.actions[index];
            action.activate();
        }
    }
}

module.exports = ActionComponent;
},{"./Action.js":19}],21:[function(require,module,exports){
class Animation {
    constructor(url, startFrame, totalFrames, frameWidth, frameHeight){
        this.type = "Animation";
        this.url = url;
        this.image = null;
        this.startFrame = startFrame - 1;
        this.currentFrame = startFrame;
        this.totalFrames = totalFrames;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.timeStamp = Date.now();
        this.changedAnimation = false; // this is a boolean which will supercede the 250ms timer between animations
    }
    draw(point){
        if (typeof window !== 'undefined' && window.document){
            this.loadImage();
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            context.drawImage(
                this.image,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight,
                point.x,
                point.y,
                this.frameWidth,
                this.frameHeight
            );
        }
    }
    animate(){
        let newTimestamp = Date.now();
        if (Math.abs(this.timeStamp - newTimestamp) > 250 || this.changedAnimation) {
            if (this.currentFrame < this.startFrame + this.totalFrames - 1) {
                this.currentFrame += 1;
            } else {
                this.currentFrame = this.startFrame;
            }
            this.timeStamp = newTimestamp;
            if (this.changedAnimation){
                this.changedAnimation = false;
            }
        }
    }
    loadImage(){
        this.image = new Image();
        this.image.src = this.url;
    }
}

module.exports = Animation;
},{}],22:[function(require,module,exports){
var Utility = require('../Utility.js');

class CirclePhysicsComponent {
    constructor(id, x, y, radius, speed){
        this.type = "CirclePhysicsComponent";
        this.id = id;
        this.circle = {
            x : x,
            y : y,
            radius : radius
        };
        this.destPoint = {
            x : x,
            y : y
        };
        this.speed = speed;
        this.timeStamp = null;
    }
    update(gameObjects, map){
        let newCircle = this.getNewCircle();
        let collision = this.checkCollision(gameObjects, newCircle);
        let rectList = map.getUnmovableMapRects();
        for (let i = 0; i < rectList.length; i++){
            let tempCollision = Utility.checkCircleRectCollision(rectList[i], newCircle);
            if (tempCollision) {
                collision = true;
            }
        }
        if (!collision) {
            this.circle = newCircle;
        }
    }
    calculateDeltaTime(){
        let lastTimeStamp = this.timeStamp;
        this.timeStamp = Date.now();
        var dt = this.timeStamp - lastTimeStamp;
        return dt;
    }
    updateDestination(x, y){
        if (this.speed > 0) {
            this.destPoint = {
                x: x,
                y: y
            }
        }
    }
    getNewCircle(){
        let dx = Math.abs(this.circle.x - this.destPoint.x);
        let dy = Math.abs(this.circle.y - this.destPoint.y);
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        let cos = dx / distance;
        let sin = dy / distance;

        let dt = this.calculateDeltaTime();

        let move = {
            x : this.speed * cos * (1/1000 * dt),
            y : this.speed * sin * (1/1000 * dt)
        };
    
        let newX = null;
        if (this.destPoint.x !== this.circle.x){
            let coefficient = this.destPoint.x < this.circle.x ? -1 : 1;
            if (Math.abs(this.destPoint.x - this.circle.x) < move.x) {
                newX = this.destPoint.x ;
            } else {
                newX = this.circle.x + move.x * coefficient;
            }
        } else {
            newX = this.circle.x;
        }
    
        let newY = null;
        if (this.destPoint.y !== this.circle.y){
            let coefficient = this.destPoint.y < this.circle.y ? -1 : 1;
            if (Math.abs(this.destPoint.y - this.circle.y) < move.y){
                newY = this.destPoint.y ;
            } else {
                newY = this.circle.y + move.y * coefficient;
            }
        } else {
            newY = this.circle.y;
        }
    
        let newCircle = {
            x : newX,
            y : newY,
            radius : this.circle.radius
        };
        
        return newCircle;
    }
    checkCollision(gameObjects, newCircle){
        for (let i = 0; i < gameObjects.length; i++){
            if (this.id !== gameObjects[i].id) {
                let collision = false;
                if (Object.keys(gameObjects[i].physicsComponent).indexOf('circle') > -1){
                     collision = Utility.checkCircleCircleCollision(gameObjects[i].physicsComponent.circle, newCircle);
                } else if (Object.keys(gameObjects[i].physicsComponent).indexOf('rect') > -1){
                    collision = Utility.checkCircleRectCollision(gameObjects[i].physicsComponent.rect, newCircle);
                }
                
                if (collision){
                    return collision;
                }
            }
        }
        return false;
    }
    drawCollisionSize(){
        if (typeof window !== 'undefined' && window.document){
            let canvas = document.getElementById("game_canvas");
            let context = canvas .getContext("2d");
            context.strokeStyle = "#ffdb39";
            context.beginPath();
            let point = {
                x : this.circle.x,
                y : this.circle.y
            };
            context.ellipse(point.x, point.y, this.circle.radius, 0.5 * this.circle.radius, 0, 0, 2 * Math.PI);
            context.stroke();
        }
    }
}

module.exports = CirclePhysicsComponent;
},{"../Utility.js":18}],23:[function(require,module,exports){
var Utility = require('../Utility.js');

class RectPhysicsComponent {
    constructor(id, x, y, width, height, speed){
        this.type = "RectPhysicsComponent";
        this.id = id;
        this.speed = speed;
        this.timeStamp = null;
        this.rect = {
            x : x,
            y : y,
            width : width,
            height : height
        };
    }
    update(gameObjects, map){
        let newRect = this.getNewRect();
        let collision = this.checkCollision(gameObjects, newRect);
        let rectList = map.getUnmovableMapRects();
        for (let i = 0; i < rectList.length; i++){
            let tempCollision = Utility.checkRectRectCollision(rectList[i], newRect);
            if (tempCollision){
                collision = true;
            }
        }
        if (!collision){
            this.rect = newRect;
        }
    }
    calculateDeltaTime(){
        let lastTimeStamp = this.timeStamp;
        this.timeStamp = Date.now();
        var dt = this.timeStamp - lastTimeStamp;
        return dt;
    }
    updateDestination(x, y){
        if (this.speed > 0) {
            this.destPoint = {
                x: x,
                y: y
            }
        }
    }
    getNewRect(){
        let dx = Math.abs(this.circle.x - this.destPoint.x);
        let dy = Math.abs(this.circle.y - this.destPoint.y);
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    
        let cos = dx / distance;
        let sin = dy / distance;
    
        let dt = this.calculateDeltaTime();
    
        let move = {
            x : this.speed * cos * (1/1000 * dt),
            y : this.speed * sin * (1/1000 * dt)
        };
    
        let newX = null;
        if (this.destPoint.x !== this.circle.x){
            let coefficient = this.destPoint.x < this.circle.x ? -1 : 1;
            if (Math.abs(this.destPoint.x - this.circle.x) < move.x) {
                newX = this.destPoint.x ;
            } else {
                newX = this.circle.x + move.x * coefficient;
            }
        } else {
            newX = this.circle.x;
        }
    
        let newY = null;
        if (this.destPoint.y !== this.circle.y){
            let coefficient = this.destPoint.y < this.circle.y ? -1 : 1;
            if (Math.abs(this.destPoint.y - this.circle.y) < move.y){
                newY = this.destPoint.y ;
            } else {
                newY = this.circle.y + move.y * coefficient;
            }
        } else {
            newY = this.circle.y;
        }
        
        let newRect = {
            x : newX,
            y : newY,
            width: this.rect.width,
            height : this.rect.height
        };
        
        return newRect;
    }
    checkCollision(gameObjects, newRect){
        for (let i = 0; i < gameObjects.length; i++) {
            if (gameObjects[i].id !== this.id){
                let collision = false;
                if (Object.keys(gameObjects[i].physicsComponent).indexOf("circle") > -1) {
                    collision = Utility.checkCircleRectCollision(newRect, gameObjects[i].physicsComponent.circle);
                } else if (Object.keys(gameObjects[i].physicsComponent).indexOf('rect') > -1){
                    collision = Utility.checkRectRectCollision(gameObjects[i].physicsComponent.rect, newRect);
                }
                
                if (collision){
                    return collision;
                }
            }
        }
        return false;
    }
    drawCollisionSize(){
        if (typeof window !== 'undefined' && window.document){
            let canvas = document.getElementById("game_canvas");
            let context = canvas .getContext("2d");
            context.strokeStyle = "#ffdb39";
            context.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        }
    }
}

module.exports = RectPhysicsComponent;
},{"../Utility.js":18}],24:[function(require,module,exports){
var Animation = require('./Animation.js');
var State = require('./State.js');

class RenderComponent {
    constructor(url){
        this.type = "RenderComponent";
        this.image = null;
        this.url = url;
        this.animations = [];
        this.currentAnimation = null;
    }
    addAnimation(state, startFrame, totalFrames, frameWidth, frameHeight){
        let animation = new Animation(this.url, startFrame, totalFrames, frameWidth, frameHeight);
        let animationDictEntry = {
            key : state,
            value : animation
        };
        if (this.animations.length === 0){
            this.currentAnimation = animation;
        }
        this.animations.push(animationDictEntry);
    }
    changeState(state){
        for(let i = 0; i < this.animations.length; i++){
            if (this.animations[i].key === state){
                if (this.currentAnimation !== null){
                    this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
                }
                this.currentAnimation = this.animations[i].value;
                this.currentAnimation.changedAnimation = true;
            }
        }
    }
    draw(point){
        if (this.currentAnimation !== null) {
            this.currentAnimation.animate();
        }
        if (typeof window !== 'undefined' && window.document) {
            if (this.currentAnimation === null) {
                this.loadImage();
                let canvas = document.getElementById('game_canvas');
                let context = canvas.getContext('2d');
                context.drawImage(
                    this.image,
                    point.x,
                    point.y
                );
            } else {
                this.currentAnimation.draw(point);
            }
        }
    }
    loadImage(){
        this.image = new Image();
        this.image.src = this.url;
    }
 }
 
 module.exports = RenderComponent;
},{"./Animation.js":21,"./State.js":25}],25:[function(require,module,exports){

var State = {
    IDLE : 'idle',
    WALKING : 'walking'
};

module.exports = State;
},{}],26:[function(require,module,exports){
var shortid = require('shortid');
var RenderComponent = require('../component/RenderComponent.js');
var ActionComponent = require('../component/ActionComponent.js');
var RectPhysicsComponent = require('../component/RectPhysicsComponent.js');

class Building {
    constructor(x, y, width, height, url){
        this.type = "Building";
        this.id = shortid.generate();
        this.renderComponent = new RenderComponent(url);
        this.physicsComponent = new RectPhysicsComponent(this.id, x, y, width, height, 0);
        this.actionComponent = new ActionComponent();
    }
    update(gameObjects, map){
        this.renderComponent.draw(this.physicsComponent.rect);
        this.physicsComponent.drawCollisionSize();
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
}

module.exports = Building;
},{"../component/ActionComponent.js":20,"../component/RectPhysicsComponent.js":23,"../component/RenderComponent.js":24,"shortid":5}],27:[function(require,module,exports){
var shortid = require('shortid');
var CirclePhysicsComponent = require('../component/CirclePhysicsComponent.js');
var RenderComponent = require('../component/RenderComponent.js');
var State = require('../component/State.js');

class GameObject{
    constructor(x, y, radius, xDisjoint, yDisjoint, url){
        this.type = "GameObject";
        this.id = shortid.generate();
        this.state = State.IDLE;
        this.disjoint = {
            x : xDisjoint,
            y : yDisjoint
        };
        this.physicsComponent = new CirclePhysicsComponent(this.id, x, y, radius, 100);
        this.renderComponent = new RenderComponent(url);
        this.renderComponent.addAnimation(State.IDLE, 2, 4, 32, 32);
        this.renderComponent.addAnimation(State.WALKING, 6, 4, 32, 32);
    }
    update(gameObjects, map){
        let newState = this.determineState();
        if (this.state !== newState){
            this.setState(newState);
        }

        this.physicsComponent.update(gameObjects, map);
        this.physicsComponent.drawCollisionSize();
        let renderPoint = {
            x : this.physicsComponent.circle.x - this.disjoint.x,
            y : this.physicsComponent.circle.y - this.disjoint.y
        };
        this.renderComponent.draw(renderPoint);
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
    setState(state){
        this.state = state;
        this.renderComponent.changeState(state);
    }
    determineState(){
        let state = State.IDLE;
        if (this.physicsComponent.destPoint.x !== this.physicsComponent.circle.x || this.physicsComponent.destPoint.y !== this.physicsComponent.circle.y) {
            state = State.WALKING;
        }
        return state;
    }
}

module.exports = GameObject;
},{"../component/CirclePhysicsComponent.js":22,"../component/RenderComponent.js":24,"../component/State.js":25,"shortid":5}]},{},[4]);
