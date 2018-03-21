(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            game.update(transform);
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

function checkTranslateCanvas(e){
    let mouseCoords = getMouseCoords(e);

    let translate = {
        x : false,
        y: false
    };

    if(mouseCoords.x < distanceFromWindow - transform.x || mouseCoords.x> canvas.width - distanceFromWindow - transform.x){
        translate.x = true;
    } else {
        translate.x = false;
    }

    if(mouseCoords.y < distanceFromWindow - transform.y || mouseCoords.y > canvas.height - distanceFromWindow - transform.y){
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

    if(mouseCoords.x < distanceFromWindow - transform.x){
        translate.x = 1;
    } else if (mouseCoords.x> canvas.width - distanceFromWindow - transform.x) {
        translate.x = -1;
    } else {
        translate.x = 0;
    }

    if(mouseCoords.y < distanceFromWindow - transform.y){
        translate.y = 1;
    } else if (mouseCoords.y > canvas.height - distanceFromWindow - transform.y) {
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

},{"../../server/Game.js":12,"../../server/GameObject.js":13,"../../server/Map.js":16,"../../server/Tile.js":17,"../../server/component/Animation.js":18,"../../server/component/PhysicsComponent.js":19,"../../server/component/RenderComponent.js":20}],2:[function(require,module,exports){
'use strict';
module.exports = require('./lib/index');

},{"./lib/index":7}],3:[function(require,module,exports){
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

},{"./random/random-from-seed":10}],4:[function(require,module,exports){
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

},{"./alphabet":3,"./encode":6}],5:[function(require,module,exports){
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

},{"./alphabet":3}],6:[function(require,module,exports){
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

},{"./random/random-byte":9}],7:[function(require,module,exports){
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

},{"./alphabet":3,"./build":4,"./decode":5,"./encode":6,"./is-valid":8,"./util/cluster-worker-id":11}],8:[function(require,module,exports){
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

},{"./alphabet":3}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

module.exports = 0;

},{}],12:[function(require,module,exports){
'use strict';
var shortid = require('shortid');
var GameObject = require('./GameObject.js');
var Map = require('./Map.js');
var Gui = require('./Gui/Gui.js');

class Game{
    constructor(id="none"){
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 20, 8, 16, 29));
        this.gameObjects.push(new GameObject(200, 200, 8, 16, 29));
        this.map = new Map();
        this.gui = new Gui();
    }
    update(transform){
        this.map.drawMap();
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(this.gameObjects, this.map);
        }
        if (transform !== null) {
            this.gui.draw(transform);
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
}

module.exports = Game;

},{"./GameObject.js":13,"./Gui/Gui.js":14,"./Map.js":16,"shortid":2}],13:[function(require,module,exports){
'use strict';
var shortid = require('shortid');
var PhysicsComponent = require('./component/PhysicsComponent.js');
var RenderComponent = require('./component/RenderComponent.js');
var State = require('./component/State.js');

class GameObject{
    constructor(x, y, radius, xDisjoint, yDisjoint){
        this.id = shortid.generate();
        this.state = State.IDLE;
        this.disjoint = {
            x : xDisjoint,
            y : yDisjoint
        };
        this.physicsComponent = new PhysicsComponent(this.id, x, y, radius, 100);
        this.renderComponent = new RenderComponent('images/character.png');
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
},{"./component/PhysicsComponent.js":19,"./component/RenderComponent.js":20,"./component/State.js":21,"shortid":2}],14:[function(require,module,exports){
var Section = require('./Section.js');

class Gui {
    constructor(){
        this.sections = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
    }
    draw(transform){
        if (typeof window !== 'undefined' && window.document) {
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            
            this.rect.x = transform.x;
            this.rect.y = transform.y + (canvas.width * 0.80);
            this.rect.width = canvas.width;
            this.rect.height = (canvas.height * 0.20);
            
            console.log('drawing: ' + JSON.stringify(this.rect));
            context.strokeStyle = "#35384d";
            context.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            
            // for (let i = 0; i < this.sections.length; i++) {
            //     this.sections[i].draw(transform, this.sections.length);
            // }
        }
        
    }
}

module.exports = Gui;
},{"./Section.js":15}],15:[function(require,module,exports){

class Section{
    constructor(){
        this.items = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
    }
    draw(point, numberOfSections){
        //Draw the items for the section then on top of that draw each item
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');
        
        this.rect.x = point.x;
        this.rect.y = point.y;
        this.rect.width = canvas.width / numberOfSections;
        this.rect.height = canvas.height * 0.18;
    
        context.strokeStyle = "#5589a2";
        context.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].draw(point);
        }
    }
}

module.exports = Section;
},{}],16:[function(require,module,exports){
var Tile = require('./Tile.js');

class Map{
    constructor(){
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
    getTileAtPoint(point){
        let tile = null;
        for (let i = 0; i < this.mapDef.length; i++) {
            for (let j = 0; j < this.mapDef[i].length; j++){
                let mapPoint = {};
                mapPoint.x = j * this.tileWidth;
                mapPoint.y = i * this.tileHeight;
                
                if (mapPoint.x < point.x
                    && mapPoint.x + this.tileWidth > point.x
                    && mapPoint.y < point.y
                    && mapPoint.y + this.tileHeight > point.y) {
                    let tileType = this.mapDef[i][j];
                    tile = this.tileDef[tileType];
                }
            }
        }
        return tile;
    }
}

module.exports = Map;
},{"./Tile.js":17}],17:[function(require,module,exports){
var RenderComponent = require('./component/RenderComponent.js');

class Tile {
    constructor(url, movable, buildable){
        this.renderComponent = new RenderComponent(url);
        this.isMovable = movable;
        this.isBuildable = buildable;
    }
    draw(point){
        this.renderComponent.draw(point);
    }
}

module.exports = Tile;
},{"./component/RenderComponent.js":20}],18:[function(require,module,exports){
class Animation {
    constructor(url, startFrame, totalFrames, frameWidth, frameHeight){
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
            if (this.image === null){
                this.loadImage();
            }
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
},{}],19:[function(require,module,exports){

class PhysicsComponent {
    constructor(id, x, y, radius, speed){
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
        let tile = map.getTileAtPoint(newCircle);
        if (!collision && tile !== null && tile.isMovable) {
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
        this.destPoint = {
            x : x,
            y : y
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
            let gameObject = gameObjects[i];
            if (this.id !== gameObject.id) {
                let dx = gameObject.physicsComponent.circle.x - newCircle.x;
                let dy = gameObject.physicsComponent.circle.y - newCircle.y;
                let distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy, 2));
                if (distance < newCircle.radius + gameObject.physicsComponent.circle.radius) {
                    // collision detected!
                    return true;
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

module.exports = PhysicsComponent;
},{}],20:[function(require,module,exports){
var Animation = require('./Animation.js');
var State = require('./State.js');

class RenderComponent {
    constructor(url){
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
                let canvas = document.getElementById('game_canvas');
                let context = canvas.getContext('2d');
                this.loadImage();
                context.drawImage(
                    this.image,
                    point.x,
                    point.y,
                    this.image.width,
                    this.image.height
                );
            } else {
                this.currentAnimation.draw(point);
            }
        }
    }
    loadImage(){
        if (this.image === null) {
            this.image = new Image();
            this.image.src = this.url;
        }
    }
 }
 
 module.exports = RenderComponent;
},{"./Animation.js":18,"./State.js":21}],21:[function(require,module,exports){

var State = {
    IDLE : 'idle',
    WALKING : 'walking'
};

module.exports = State;
},{}]},{},[1]);
