(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var mouseMoveEvent = null;
var selectedGameObjects = [];

const CLIENT_TICKRATE = 1000/60;

$('body').on('contextmenu', '#game_canvas', function(e){
    //disabling context menu while right clicking on the canvas
    return false;
});

$(document).ready(function () {
    socket.emit('join io room', game_id);
    setInterval(
        function (){
            drawGame();
            game.update(CLIENT_TICKRATE)
        },
        CLIENT_TICKRATE
    );
});

document.addEventListener('mousedown', function(e){
    let rect = canvas.getBoundingClientRect();
    mouseDownEvent = e;
    let mouseDown = {
        x : mouseDownEvent.pageX - rect.left,
        y : mouseDownEvent.pageY - rect.top
    };
    
    switch (e.which){
        case 1:
            selectedGameObjects = [];
            break;
        case 3:
            socket.emit(
                'move objects',
                JSON.stringify(mouseDown),
                game_id,
                JSON.stringify(selectedGameObjects)
            );
            
            game.moveObjects(
                selectedGameObjects,
                mouseDown
            );
            break;
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
    drawGameObjects();
    drawMouse(mouseDownEvent, mouseMoveEvent);
}

function drawGameObjects(){
    $('#test1').text(JSON.stringify(game.gameObjects));
    $('#test2').text(JSON.stringify(selectedGameObjects));
    for (let i = 0; i < game.gameObjects.length; i++) {
        let gameObject = game.gameObjects[i];

        let inArray = false;
        for (let j = 0; j < selectedGameObjects.length; j++){
            let selectedGameObject = selectedGameObjects[j];
            if(selectedGameObject.id == gameObject.id){
                inArray = true;
            }
        }

        if (inArray){
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
        x : mouseDown.x > mouseUp.x ? mouseUp.x : mouseDown.x,
        y : mouseDown.y > mouseUp.y ? mouseUp.y : mouseDown.y,
        width : mouseDown.x > mouseUp.x ? mouseDown.x - mouseUp.x : mouseUp.x - mouseDown.x,
        height : mouseDown.y > mouseUp.y ? mouseDown.y - mouseUp.y : mouseUp.y - mouseDown.y
    };

    return mouseRect;
}

function drawMouse(mouseDownEvent, mouseMoveEvent){
    if(mouseDownEvent != null && mouseMoveEvent != null){
        let mouseRect = getMouseRect(mouseDownEvent, mouseMoveEvent);
        ctx.fillStyle = "#485157";
        ctx.strokeRect(mouseRect.x, mouseRect.y, mouseRect.width, mouseRect.height);
    }
}

function selectUnits(mouseDownEvent, mouseUpEvent){
    let mouseRect = getMouseRect(mouseDownEvent, mouseUpEvent);

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
}

socket.on('update game', function(gameJSON){
    let serverGame = JSON.parse(gameJSON);
    game.gameObjects = [];
    for(let i = 0; i < serverGame.gameObjects.length; i++) {
        let object = Object.assign(new GameObject, serverGame.gameObjects[i]);
        game.gameObjects.push(object);
    }
});

},{"../../server/Game.js":12,"../../server/GameObject.js":13,"../../server/component/PositionComponent.js":15,"../../server/component/SizeComponent.js":16,"../../server/component/VelocityComponent.js":17}],2:[function(require,module,exports){
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

class Game{
    constructor(id="none"){
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 20, 40, 40));
        this.gameObjects.push(new GameObject(80, 80, 100, 20));
    }
    update(tickRate){
        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update(tickRate);
        }
    }
    moveObjects(objects, mouseCoords){
        for(let i = 0; i < this.gameObjects.length; i++){
            for(let j = 0; j < objects.length; j++){
                if (this.gameObjects[i].id == objects[j].id){
                    this.gameObjects[i].destinationComponent.updateDestination(mouseCoords.x, mouseCoords.y);
                }
            }
        }
    }
}

module.exports = Game;

},{"./GameObject.js":13,"shortid":2}],13:[function(require,module,exports){
'use strict';
var shortid = require('shortid');
var PositionComponent = require('./component/PositionComponent.js');
var SizeComponent = require('./component/SizeComponent.js');
var VelocityComponent = require('./component/VelocityComponent.js');
var DestinationComponent = require('./component/DestinationComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.sizeComponent = new SizeComponent(width, height);
        this.positionComponent = new PositionComponent(x, y);
        this.destinationComponent = new DestinationComponent(x, y);
        this.velocityComponent = new VelocityComponent();
    }
    update(tickRate){
        let distance = Math.sqrt(Math.pow(this.destinationComponent.x - this.positionComponent.x, 2) + Math.pow(this.destinationComponent.y - this.positionComponent.y, 2));
        let xDistance = Math.abs(this.positionComponent.x - this.destinationComponent.x);
        let yDistance = Math.abs(this.positionComponent.y - this.destinationComponent.y);

        let cos = Math.cos(xDistance / distance);
        let sin = Math.sin(yDistance / distance);

        let xMove = this.velocityComponent.speed * (1/1000 * tickRate) * Math.cos(cos);
        let yMove = this.velocityComponent.speed * (1/1000 * tickRate) * Math.sin(sin);
        console.log(xMove + ", " + yMove);

        if(this.positionComponent.x != this.destinationComponent.x){
            let coeff = this.positionComponent.x > this.destinationComponent.x ? -1 : 1;
            if (Math.abs(this.positionComponent.x - this.destinationComponent.x) < xMove) {
                this.positionComponent.x = this.destinationComponent.x;
            } else {
                this.positionComponent.x += coeff * xMove;
            }
        }

        if(this.positionComponent.y != this.destinationComponent.y){
            let coeff = this.positionComponent.y > this.destinationComponent.y ? -1 : 1;
            if(Math.abs(this.positionComponent.y - this.destinationComponent.y) < yMove){
                this.positionComponent.y = this.destinationComponent.y;
            } else {
                this.positionComponent.y += coeff * yMove;
            }
        }
    }
}

module.exports = GameObject;
},{"./component/DestinationComponent.js":14,"./component/PositionComponent.js":15,"./component/SizeComponent.js":16,"./component/VelocityComponent.js":17,"shortid":2}],14:[function(require,module,exports){

class DestinationComponent {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    updateDestination(x, y){
        this.x = x;
        this.y = y;
    }
}

module.exports = DestinationComponent;
},{}],15:[function(require,module,exports){


class PositionComponent{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

module.exports = PositionComponent;
},{}],16:[function(require,module,exports){


class SizeComponent{
    constructor(width, height){
        this.width = width;
        this.height = height;
    }
}

module.exports = SizeComponent;
},{}],17:[function(require,module,exports){

class VelocityComponent{
    constructor(){
        this.speed = 40;
    }
}

module.exports = VelocityComponent;
},{}]},{},[1]);
