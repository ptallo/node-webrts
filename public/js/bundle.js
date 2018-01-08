(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var shortid = require('shortid');
var GameObject = require('./GameObject.js');

class Game{
    constructor(id="none"){
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 20, 40, 40));
        this.gameObjects.push(new GameObject(80, 80, 100, 20))
    }
    update(){
        for(let object in this.gameObjects){
            object.update();
        }
    }
}

module.exports = Game;

},{"./GameObject.js":2,"shortid":6}],2:[function(require,module,exports){
'use strict';
var shortid = require('shortid');
var PositionComponent = require('./component/PositionComponent.js');
var SizeComponent = require('./component/SizeComponent.js');
var VelocityComponent = require('./component/VelocityComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.sizeComponent = new SizeComponent(width, height);
        this.positionComponent = new PositionComponent(x, y);
        this.velocityComponent = new VelocityComponent();
    }
    update(){
        if(this.velocityComponent.xVelocity != 0){
            this.positionComponent.x += this.velocityComponent.xVelocity;
        }

        if(this.velocityComponent.yVelocity != 0){
            this.positionComponent.y += this.velocityComponent.yVelocity;
        }
    }
}

module.exports = GameObject;
},{"./component/PositionComponent.js":3,"./component/SizeComponent.js":4,"./component/VelocityComponent.js":5,"shortid":6}],3:[function(require,module,exports){


class PositionComponent{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

module.exports = PositionComponent;
},{}],4:[function(require,module,exports){


class SizeComponent{
    constructor(width, height){
        this.width = width;
        this.height = height;
    }
}

module.exports = SizeComponent;
},{}],5:[function(require,module,exports){

class VelocityComponent{
    constructor(){
        this.xVelocity = 0;
        this.yVelocity = 0;
    }
    updateVelocity(x = 0, y = 0){
        this.xVelocity = x;
        this.yVelocity = y;
    }
}

module.exports = VelocityComponent;
},{}],6:[function(require,module,exports){
'use strict';
module.exports = require('./lib/index');

},{"./lib/index":11}],7:[function(require,module,exports){
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

},{"./random/random-from-seed":14}],8:[function(require,module,exports){
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

},{"./alphabet":7,"./encode":10}],9:[function(require,module,exports){
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

},{"./alphabet":7}],10:[function(require,module,exports){
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

},{"./random/random-byte":13}],11:[function(require,module,exports){
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

},{"./alphabet":7,"./build":8,"./decode":9,"./encode":10,"./is-valid":12,"./util/cluster-worker-id":15}],12:[function(require,module,exports){
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

},{"./alphabet":7}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
'use strict';

module.exports = 0;

},{}],16:[function(require,module,exports){
'use strict';
// browserify main.js -o bundle.js - game logic require
var socket = io();
var Game = require("../../game_logic/Game.js");
var GameObject = require('../../game_logic/GameObject.js');
var PositionComponent = require('../../game_logic/component/PositionComponent.js');
var SizeComponent = require('../../game_logic/component/SizeComponent.js');
var VelocityComponent = require('../../game_logic/component/VelocityComponent.js');

//Other global variables which need to be expressed
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
let game_id = sessionStorage.getItem('game_id');
var game = new Game(game_id);


$(document).ready(function () {
    socket.emit('join io room', game_id);
    try {
        drawGame(game);
    } catch (e) {
        $('p').text(e);
    }
});

function drawGame() {
    ctx.fillStyle = "#38cceb";
    for (let i = 0; i < game.gameObjects.length; i++) {
        let gameObject = game.gameObjects[i];
        let x = gameObject.positionComponent.x;
        let y = gameObject.positionComponent.y;
        let width = gameObject.sizeComponent.width;
        let height = gameObject.sizeComponent.height;
        $('p').text(x + ", " + y + ", " + width + ", " + height);
        ctx.fillRect(x, y, width, height);
    }
}
},{"../../game_logic/Game.js":1,"../../game_logic/GameObject.js":2,"../../game_logic/component/PositionComponent.js":3,"../../game_logic/component/SizeComponent.js":4,"../../game_logic/component/VelocityComponent.js":5}]},{},[16]);
