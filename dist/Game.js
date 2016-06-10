(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Game2 = require("./Engine/Game");

var _Game3 = _interopRequireDefault(_Game2);

var _Level = require("./World/Level");

var _Level2 = _interopRequireDefault(_Level);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TILE_SIZE = 32;

var CollisionGame = function (_Game) {
  _inherits(CollisionGame, _Game);

  function CollisionGame(stage, width, height) {
    _classCallCheck(this, CollisionGame);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CollisionGame).call(this, stage, width, height));

    _this.level = new _Level2.default(Math.floor(width / TILE_SIZE), Math.floor(height / TILE_SIZE));
    return _this;
  }

  _createClass(CollisionGame, [{
    key: "update",
    value: function update(input, delta) {
      if (this.level !== undefined) this.level.update(input, delta);
    }
  }, {
    key: "draw",
    value: function draw(renderer, delta) {
      if (this.level !== undefined) this.level.draw(renderer, delta);
    }
  }]);

  return CollisionGame;
}(_Game3.default);

exports.default = CollisionGame;

},{"./Engine/Game":2,"./World/Level":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Renderer = require("./Renderer");

var _Renderer2 = _interopRequireDefault(_Renderer);

var _InputHandler = require("./InputHandler");

var _InputHandler2 = _interopRequireDefault(_InputHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // A simple game "engine" to abstract away drawing and canvas stuff


var Game = function Game(stage, width, height) {
  _classCallCheck(this, Game);

  // Create canvas
  this.container = document.getElementById(stage);
  this.canvas = this.container.appendChild(document.createElement('canvas'));
  this.canvas.setAttribute('tabindex', '0'); // Make focusable so events work
  this.canvas.focus();
  this.canvas.style.width = width + "px";
  this.canvas.style.height = height + "px";
  this.canvas.style.outline = "none";
  this.canvas.style.position = "relative";
  this.canvas.style.cursor = "default";
  this.canvas.width = width;
  this.canvas.height = height;
  this.width = width;
  this.height = height;
  this.context = this.canvas.getContext("2d");

  // Create renderer to abstract away draw functions
  this.renderer = new _Renderer2.default(this.context, width, height);

  // Hook up input events
  this.input = new _InputHandler2.default(this.canvas, width, height);

  // Setup animation loop
  var requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  }();

  var _self = this;
  var lastFrame = Date.now();

  function animloop() {
    requestAnimationFrame(animloop);

    var now = Date.now();
    var delta = (now - lastFrame) / 1000;

    _self.context.fillStyle = "#FFF";
    _self.context.fillRect(0, 0, _self.width, _self.width);

    if (_self.update) _self.update(_self.input, delta);
    if (_self.draw) _self.draw(_self.renderer, delta);
    lastFrame = now;
  }
  animloop();
};

exports.default = Game;

},{"./InputHandler":3,"./Renderer":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Point = require("./Point");

var _Point2 = _interopRequireDefault(_Point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputHandler = function () {
  function InputHandler(container, width, height) {
    _classCallCheck(this, InputHandler);

    this.width = width;
    this.height = height;
    this.container = container;
    // Hook up events
    this._keystate = {};
    var _self = this;
    this.container.onkeydown = function (e) {
      _self._keystate[e.keyCode ? e.keyCode : e.charCode] = true;
    };
    this.container.onkeyup = function (e) {
      _self._keystate[e.keyCode ? e.keyCode : e.charCode] = false;
    };

    this._mousestate = {};
    this._mousepos = new _Point2.default(0, 0);
    this.container.onmousedown = function (e) {
      _self._mousestate[e.button] = true;
      _self._mousepos = new _Point2.default(e.offsetX, _self.height - e.offsetY);
    };
    this.container.onmouseup = function (e) {
      _self._mousestate[e.button] = false;
      _self._mousepos = new _Point2.default(e.offsetX, _self.height - e.offsetY);
    };
    this.container.oncontextmenu = function (e) {
      e.preventDefault();
    };
    this.container.onmousemove = function (e) {
      _self._mousepos = new _Point2.default(e.offsetX, _self.height - e.offsetY);
    };
  }

  _createClass(InputHandler, [{
    key: "getMousePosition",
    value: function getMousePosition() {
      return this._mousepos;
    }
  }, {
    key: "isMouseDown",
    value: function isMouseDown(button) {
      return this._mousestate[button];
    }
  }, {
    key: "isMouseUp",
    value: function isMouseUp(button) {
      return !this._mousestate[button];
    }
  }, {
    key: "isKeyDown",
    value: function isKeyDown(charCode) {
      return this._keystate[charCode];
    }
  }, {
    key: "isKeyUp",
    value: function isKeyUp(charCode) {
      return !this._keystate[charCode];
    }
  }]);

  return InputHandler;
}();

exports.default = InputHandler;

},{"./Point":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function Point(x, y) {
  _classCallCheck(this, Point);

  this.x = x;
  this.y = y;
};

exports.default = Point;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var thisngle = function () {
  function thisngle(x, y, width, height) {
    _classCallCheck(this, thisngle);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  _createClass(thisngle, [{
    key: "isIntersecting",
    value: function isIntersecting(rect) {
      return !(rect.x >= this.right || rect.right <= this.x || rect.y >= this.bottom || rect.bottom <= this.y);
    }
  }, {
    key: "getHorizontalIntersectionDepth",
    value: function getHorizontalIntersectionDepth(rect) {
      // Check if overlapping at all.
      if (!this.isIntersecting(rect)) return 0;

      // Calculate half sizes.
      var halfwidthA = this.width / 2;
      var halfwidthB = rect.width / 2;

      // Calculate centers.
      var centerA = this.x + halfwidthA;
      var centerB = rect.x + halfwidthB;

      // Calculate current and minimum-non-intersecting distances between centers.
      var distanceX = centerA - centerB;
      var minDistanceX = halfwidthA + halfwidthB;

      // If we are not intersecting at all on this axis, return 0.
      if (Math.abs(distanceX) >= minDistanceX) return 0;

      // Calculate and return intersection depth.
      return distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
    }
  }, {
    key: "getVerticalIntersectionDepth",
    value: function getVerticalIntersectionDepth(rect) {
      // Check if overlapping at all.
      if (!this.isIntersecting(rect)) return 0;

      // Calculate half sizes.
      var halfheightA = this.height / 2;
      var halfheightB = rect.height / 2;

      // Calculate centers.
      var centerA = this.y + halfheightA;
      var centerB = rect.y + halfheightB;

      // Calculate current and minimum-non-intersecting distances between centers.
      var distanceY = centerA - centerB;
      var minDistanceY = halfheightA + halfheightB;

      // If we are not intersecting at all on this axis, return 0.
      if (Math.abs(distanceY) >= minDistanceY) return 0;

      // Calculate and return intersection depth.
      return distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
    }
  }, {
    key: "right",
    get: function get() {
      return this.x + this.width;
    }
  }, {
    key: "bottom",
    get: function get() {
      return this.y + this.height;
    }
  }, {
    key: "left",
    get: function get() {
      return x;
    }
  }, {
    key: "top",
    get: function get() {
      return y;
    }
  }]);

  return thisngle;
}();

exports.default = thisngle;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
  function Renderer(context, width, height) {
    _classCallCheck(this, Renderer);

    this.context = context;
    this.width = width;
    this.height = height;
  }

  _createClass(Renderer, [{
    key: "drawRectangle",
    value: function drawRectangle(x, y, width, height, color) {
      this.context.fillStyle = color;
      // this.height - y - height is to invert the y axis, making the coordinate system like that of XNA and other engines.
      this.context.fillRect(x, this.height - y - height, width, height);
    }
  }]);

  return Renderer;
}();

exports.default = Renderer;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Rectangle = require("../Engine/Rectangle");

var _Rectangle2 = _interopRequireDefault(_Rectangle);

var _Point = require("../Engine/Point");

var _Point2 = _interopRequireDefault(_Point);

var _Tile = require("../World/Tile");

var _Tile2 = _interopRequireDefault(_Tile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TILES = _Tile2.default.getTypes();
var TILE_SIZE = 32; // Assuming player is same size as tile, although it will work with other sizes too.
var MOVE_SPEED = 190;
var KEY_W = 87,
    KEY_A = 65,
    KEY_S = 83,
    KEY_D = 68,
    KEY_UP = 38,
    KEY_LEFT = 37,
    KEY_DOWN = 40,
    KEY_RIGHT = 39;
var FRICTION = 80;
var CollisionDirection = {
  VERTICAL: 1,
  HORIZONTAL: 2
};

var Player = function () {
  function Player(level, color, initialPosition) {
    _classCallCheck(this, Player);

    this.level = level;
    this.color = color;
    this.position = initialPosition;
    this.boundingBox = this.getBoundingBox();
    this.velocity = new _Point2.default(0, 0);
    this.previousPosition = new _Point2.default(0, 0);
  }

  _createClass(Player, [{
    key: "getBoundingBox",
    value: function getBoundingBox() {
      // Modify this to change the physical shape of the player.
      return new _Rectangle2.default(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE);
    }
  }, {
    key: "update",
    value: function update(input, delta) {
      // STEP 1: Get the direction moving based on keyboard movement
      // 1 is up/left, 0 is none, and -1 is down/right
      // This will be known as the acceleration. Acceleration is the lowest level of input, so it does not
      // need to be stored between frames.
      var acceleration = new _Point2.default(0, 0);

      // Handle WASD or arrow key movement
      if (this.useWASD) {
        if (input.isKeyDown(KEY_D) && input.isKeyUp(KEY_A)) acceleration.x = 1;else if (input.isKeyDown(KEY_A) && input.isKeyUp(KEY_D)) acceleration.x = -1;
        if (input.isKeyDown(KEY_W) && input.isKeyUp(KEY_S)) acceleration.y = 1;else if (input.isKeyDown(KEY_S) && input.isKeyUp(KEY_W)) acceleration.y = -1;
      } else {
        if (input.isKeyDown(KEY_RIGHT) && input.isKeyUp(KEY_LEFT)) acceleration.x = 1;else if (input.isKeyDown(KEY_LEFT) && input.isKeyUp(KEY_RIGHT)) acceleration.x = -1;
        if (input.isKeyDown(KEY_UP) && input.isKeyUp(KEY_DOWN)) acceleration.y = 1;else if (input.isKeyDown(KEY_DOWN) && input.isKeyUp(KEY_UP)) acceleration.y = -1;
      }

      // STEP 2: Add the acceleration to the velocity, taking into account for delta time.
      // Delta time will differ depending on the number of frames per second. By multiplying by it,
      // it makes the movement the same speed regardless of the system's performance.
      this.velocity.x += acceleration.x * MOVE_SPEED * delta;
      this.velocity.y += acceleration.y * MOVE_SPEED * delta;

      // STEP 3: Add friction (from sliding on the "background"), or else the velocity will never slow down when the keys is released.
      // Higher friction will also slow down the movement, so ajust the MOVE_SPEED accordingly.
      // Friction could also be handled for solid blocks in handleCollisions to give more friction to solid blocks
      this.velocity.x /= FRICTION * delta;
      this.velocity.y /= FRICTION * delta;

      // STEP 4: Handle collision.

      // Collisions are resolved on each axis independently.
      // The velocity is then added to the position, which makes the position increase as the velocity is > 0, and decreases when it is < 0.
      // By using acceleration, velocity, and position, we can get a smooth movement that takes time to speed up and slow down.
      this.position.x += this.velocity.x;
      // Now that the player's position has been updated based on the acceleration and velocity, it may be intersecting a block or player and must be resolved.
      // Record the position before handling collision.
      var lastX = this.position.x;
      // Only handle collision if position has changed.
      if (this.position.x !== this.previousPosition.x) this.handleCollisions(CollisionDirection.HORIZONTAL);

      // Do the same for the Y-Axis
      this.position.y += this.velocity.y;
      var lastY = this.position.y;
      if (this.position.y !== this.previousPosition.y) this.handleCollisions(CollisionDirection.VERTICAL);

      // STEP 5: If the position after handling collision is different, that means collision was handled and the
      // velocity should be set to 0 to fully come to a stop.
      if (this.position.x !== lastX) {
        this.velocity.x = 0;
      }
      if (this.position.y !== lastY) {
        this.velocity.y = 0;
      }
      this.previousPosition = new _Point2.default(this.position.x, this.position.y);
    }
  }, {
    key: "draw",
    value: function draw(renderer, delta) {
      // Draw a rectangle for the player.
      renderer.drawRectangle(Math.round(this.position.x), Math.round(this.position.y), this.boundingBox.width, this.boundingBox.height, this.color);
    }
  }, {
    key: "handleCollisions",
    value: function handleCollisions(direction) {
      // Update the player bounds.
      this.boundingBox = this.getBoundingBox();

      // STEP 1: Handle Tile Collision
      // Find the tiles surround the player.
      // Only these will be tested for collision.
      var leftTile = Math.floor(this.boundingBox.x / TILE_SIZE);
      var rightTile = Math.ceil(this.boundingBox.right / TILE_SIZE) - 1;
      var topTile = Math.floor(this.boundingBox.y / TILE_SIZE);
      var bottomTile = Math.ceil(this.boundingBox.bottom / TILE_SIZE) - 1;

      for (var y = topTile; y <= bottomTile; ++y) {
        for (var x = leftTile; x <= rightTile; ++x) {
          var tile = this.level.tiles[x][y];

          if (tile.type === TILES.SOLID) {

            // Get the bounding box of the tile, which will be tested for intersection with the player's bounds.
            // The bounding box does not have to be stationary, it would represent a moving tile and it would still work.
            var tileBounds = tile.getBoundingBox(x, y);

            // Find how far the tile intersects the player (if at all)
            var _depth = this.intersects(tileBounds, direction);

            this.applyDepth(direction, _depth);
          }
        }
      }

      // STEP 2: Handle Player Collision
      for (var i = 0; i < this.level.players.length; i++) {
        if (this.level.players[i] === this) continue; // Don't collide with ourselves!
        var playerBounds = this.level.players[i].getBoundingBox(); // Get bounds of the other player.
        var depth = this.intersects(playerBounds, direction);

        this.applyDepth(direction, depth);
      }
    }
  }, {
    key: "applyDepth",
    value: function applyDepth(direction, depth) {
      // If the depth is not zero, the player and tile are colliding on this axis
      if (depth !== 0) {
        if (direction == CollisionDirection.HORIZONTAL) this.position.x += depth;else if (direction == CollisionDirection.VERTICAL) this.position.y += depth;
        this.boundingBox = this.getBoundingBox(); // Update the bounding box of the player
      }
    }
  }, {
    key: "intersects",
    value: function intersects(box, direction) {
      // Return the intersection depth between the player and the object's bounding box.
      // In order to do collision, we will run this method for the blocks around the player, and any other players.
      return direction == CollisionDirection.VERTICAL ? this.boundingBox.getVerticalIntersectionDepth(box) : this.boundingBox.getHorizontalIntersectionDepth(box);
    }
  }]);

  return Player;
}();

exports.default = Player;

},{"../Engine/Point":4,"../Engine/Rectangle":5,"../World/Tile":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tile = require("./Tile");

var _Tile2 = _interopRequireDefault(_Tile);

var _Player = require("../Entities/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _Point = require("../Engine/Point.js");

var _Point2 = _interopRequireDefault(_Point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TILES = _Tile2.default.getTypes();
var TILE_SIZE = 32;
var SOLID_COLOR = '#b4b4b4';
var LEFT_MOUSE = 0,
    RIGHT_MOUSE = 2;
var CollisionDirection = {
  VERTICAL: 1,
  HORIZONTAL: 2
};

var Level = function () {
  function Level(width, height) {
    _classCallCheck(this, Level);

    this.width = width;
    this.height = height;
    this.tiles = [];
    this.players = [];

    // Generate the level tiles.
    for (var x = 0; x < this.width; x++) {
      this.tiles[x] = [];
      for (var y = 0; y < this.height; y++) {
        // Create border around level
        if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) this.tiles[x][y] = new _Tile2.default(TILES.SOLID);else this.tiles[x][y] = new _Tile2.default(TILES.EMPTY);
      }
    }

    // Add players
    var me = new _Player2.default(this, 'red', new _Point2.default(TILE_SIZE * 6, TILE_SIZE * 6));
    me.useWASD = true; // Control this player with WASD and the other with the arrow keys
    this.players.push(me);
    this.players.push(new _Player2.default(this, 'green', new _Point2.default(TILE_SIZE * 2, TILE_SIZE * 2)));
  }

  _createClass(Level, [{
    key: "mouseToWorld",
    value: function mouseToWorld(position) {
      // Convert mouse coordinates to world coordinates.
      return new _Point2.default(Math.min(Math.max(0, Math.floor(position.x / TILE_SIZE)), this.width - 1), Math.min(Math.max(0, Math.floor(position.y / TILE_SIZE)), this.height - 1));
    }
  }, {
    key: "update",
    value: function update(input, delta) {
      // Update players
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var player = _step.value;

          player.update(input, delta);
        }

        // Place blocks
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (input.isMouseDown(LEFT_MOUSE) || input.isMouseDown(RIGHT_MOUSE)) {
        var worldPos = this.mouseToWorld(input.getMousePosition());
        var tile = this.tiles[worldPos.x][worldPos.y];
        if (tile.type === TILES.EMPTY && input.isMouseDown(LEFT_MOUSE)) tile.type = TILES.SOLID;else if (tile.type === TILES.SOLID && input.isMouseDown(RIGHT_MOUSE)) tile.type = TILES.EMPTY;
      }
    }
  }, {
    key: "draw",
    value: function draw(renderer, delta) {
      // Draw tiles
      for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
          var tile = this.tiles[x][y];
          if (tile.type === TILES.SOLID) {
            renderer.drawRectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, SOLID_COLOR);
          }
        }
      }

      // Draw players
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.players[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var player = _step2.value;

          player.draw(renderer, delta);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  return Level;
}();

exports.default = Level;

},{"../Engine/Point.js":4,"../Entities/Player.js":7,"./Tile":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Rectangle = require("../Engine/Rectangle");

var _Rectangle2 = _interopRequireDefault(_Rectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TILE_SIZE = 32;

var Tile = function () {
  function Tile(type) {
    _classCallCheck(this, Tile);

    this.type = type;
  }

  _createClass(Tile, [{
    key: "getBoundingBox",
    value: function getBoundingBox(x, y) {
      // Return rectangle that defines the shape of the player.
      // It can be modified to support blocks with different shapes (ie half blocks)
      return new _Rectangle2.default(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }], [{
    key: "getTypes",
    value: function getTypes() {
      return {
        EMPTY: 1,
        SOLID: 0
      };
    }
  }]);

  return Tile;
}();

exports.default = Tile;

},{"../Engine/Rectangle":5}],10:[function(require,module,exports){
(function (global){
"use strict";

var _CollisionGame = require("./CollisionGame");

var _CollisionGame2 = _interopRequireDefault(_CollisionGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.CollisionGame = _CollisionGame2.default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./CollisionGame":1}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXENvbGxpc2lvbkdhbWUuanMiLCJzcmNcXEVuZ2luZVxcR2FtZS5qcyIsInNyY1xcRW5naW5lXFxJbnB1dEhhbmRsZXIuanMiLCJzcmNcXEVuZ2luZVxcUG9pbnQuanMiLCJzcmNcXEVuZ2luZVxcUmVjdGFuZ2xlLmpzIiwic3JjXFxFbmdpbmVcXFJlbmRlcmVyLmpzIiwic3JjXFxFbnRpdGllc1xcUGxheWVyLmpzIiwic3JjXFxXb3JsZFxcTGV2ZWwuanMiLCJzcmNcXFdvcmxkXFxUaWxlLmpzIiwic3JjXFxzcmNcXGluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRXFCLGE7OztBQUNuQix5QkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE1BQTFCLEVBQWtDO0FBQUE7O0FBQUEsaUdBQzFCLEtBRDBCLEVBQ25CLEtBRG1CLEVBQ1osTUFEWTs7QUFFaEMsVUFBSyxLQUFMLEdBQWEsb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBUSxTQUFuQixDQUFWLEVBQXlDLEtBQUssS0FBTCxDQUFXLFNBQVMsU0FBcEIsQ0FBekMsQ0FBYjtBQUZnQztBQUdqQzs7OzsyQkFDTSxLLEVBQU8sSyxFQUFPO0FBQ25CLFVBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFDRSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQWxCLEVBQXlCLEtBQXpCO0FBQ0g7Ozt5QkFDSSxRLEVBQVUsSyxFQUFPO0FBQ3BCLFVBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFDRSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFFBQWhCLEVBQTBCLEtBQTFCO0FBQ0g7Ozs7OztrQkFaa0IsYTs7Ozs7Ozs7O0FDSHJCOzs7O0FBQ0E7Ozs7Ozs7OztJQUNxQixJLEdBQ25CLGNBQVksS0FBWixF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ZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vRW5naW5lL0dhbWVcIjtcclxuaW1wb3J0IExldmVsIGZyb20gXCIuL1dvcmxkL0xldmVsXCI7XHJcbmNvbnN0IFRJTEVfU0laRSA9IDMyO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sbGlzaW9uR2FtZSBleHRlbmRzIEdhbWUge1xyXG4gIGNvbnN0cnVjdG9yKHN0YWdlLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBzdXBlcihzdGFnZSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB0aGlzLmxldmVsID0gbmV3IExldmVsKE1hdGguZmxvb3Iod2lkdGggLyBUSUxFX1NJWkUpLCBNYXRoLmZsb29yKGhlaWdodCAvIFRJTEVfU0laRSkpO1xyXG4gIH1cclxuICB1cGRhdGUoaW5wdXQsIGRlbHRhKSB7XHJcbiAgICBpZiAodGhpcy5sZXZlbCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLmxldmVsLnVwZGF0ZShpbnB1dCwgZGVsdGEpO1xyXG4gIH1cclxuICBkcmF3KHJlbmRlcmVyLCBkZWx0YSkge1xyXG4gICAgaWYgKHRoaXMubGV2ZWwgIT09IHVuZGVmaW5lZClcclxuICAgICAgdGhpcy5sZXZlbC5kcmF3KHJlbmRlcmVyLCBkZWx0YSk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIEEgc2ltcGxlIGdhbWUgXCJlbmdpbmVcIiB0byBhYnN0cmFjdCBhd2F5IGRyYXdpbmcgYW5kIGNhbnZhcyBzdHVmZlxyXG5pbXBvcnQgUmVuZGVyZXIgZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuaW1wb3J0IElucHV0SGFuZGxlciBmcm9tIFwiLi9JbnB1dEhhbmRsZXJcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhZ2UsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vIENyZWF0ZSBjYW52YXNcclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhZ2UpO1xyXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSk7XHJcbiAgICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTsgLy8gTWFrZSBmb2N1c2FibGUgc28gZXZlbnRzIHdvcmtcclxuICAgIHRoaXMuY2FudmFzLmZvY3VzKCk7XHJcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICAvLyBDcmVhdGUgcmVuZGVyZXIgdG8gYWJzdHJhY3QgYXdheSBkcmF3IGZ1bmN0aW9uc1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih0aGlzLmNvbnRleHQsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgIC8vIEhvb2sgdXAgaW5wdXQgZXZlbnRzXHJcbiAgICB0aGlzLmlucHV0ID0gbmV3IElucHV0SGFuZGxlcih0aGlzLmNhbnZhcywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgLy8gU2V0dXAgYW5pbWF0aW9uIGxvb3BcclxuICAgIHZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgdmFyIF9zZWxmID0gdGhpcztcclxuICAgIHZhciBsYXN0RnJhbWUgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1sb29wKCkge1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWxvb3ApO1xyXG5cclxuICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgIHZhciBkZWx0YSA9IChub3cgLSBsYXN0RnJhbWUpIC8gMTAwMDtcclxuXHJcbiAgICAgIF9zZWxmLmNvbnRleHQuZmlsbFN0eWxlID0gXCIjRkZGXCI7XHJcbiAgICAgIF9zZWxmLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgX3NlbGYud2lkdGgsIF9zZWxmLndpZHRoKTtcclxuXHJcbiAgICAgIGlmIChfc2VsZi51cGRhdGUpXHJcbiAgICAgICAgX3NlbGYudXBkYXRlKF9zZWxmLmlucHV0LCBkZWx0YSk7XHJcbiAgICAgIGlmIChfc2VsZi5kcmF3KVxyXG4gICAgICAgIF9zZWxmLmRyYXcoX3NlbGYucmVuZGVyZXIsIGRlbHRhKTtcclxuICAgICAgbGFzdEZyYW1lID0gbm93O1xyXG4gICAgfVxyXG4gICAgYW5pbWxvb3AoKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0SGFuZGxlciB7XHJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgLy8gSG9vayB1cCBldmVudHNcclxuICAgIHRoaXMuX2tleXN0YXRlID0ge307XHJcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5jb250YWluZXIub25rZXlkb3duID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBfc2VsZi5fa2V5c3RhdGVbZS5rZXlDb2RlID8gZS5rZXlDb2RlIDogZS5jaGFyQ29kZV0gPSB0cnVlO1xyXG4gICAgfTtcclxuICAgIHRoaXMuY29udGFpbmVyLm9ua2V5dXAgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIF9zZWxmLl9rZXlzdGF0ZVtlLmtleUNvZGUgPyBlLmtleUNvZGUgOiBlLmNoYXJDb2RlXSA9IGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl9tb3VzZXN0YXRlID0ge307XHJcbiAgICB0aGlzLl9tb3VzZXBvcyA9IG5ldyBQb2ludCgwLCAwKTtcclxuICAgIHRoaXMuY29udGFpbmVyLm9ubW91c2Vkb3duID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBfc2VsZi5fbW91c2VzdGF0ZVtlLmJ1dHRvbl0gPSB0cnVlO1xyXG4gICAgICBfc2VsZi5fbW91c2Vwb3MgPSBuZXcgUG9pbnQoZS5vZmZzZXRYLCBfc2VsZi5oZWlnaHQgLSBlLm9mZnNldFkpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuY29udGFpbmVyLm9ubW91c2V1cCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgX3NlbGYuX21vdXNlc3RhdGVbZS5idXR0b25dID0gZmFsc2U7XHJcbiAgICAgIF9zZWxmLl9tb3VzZXBvcyA9IG5ldyBQb2ludChlLm9mZnNldFgsIF9zZWxmLmhlaWdodCAtIGUub2Zmc2V0WSk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5jb250YWluZXIub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuY29udGFpbmVyLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBfc2VsZi5fbW91c2Vwb3MgPSBuZXcgUG9pbnQoZS5vZmZzZXRYLCBfc2VsZi5oZWlnaHQgLSBlLm9mZnNldFkpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgZ2V0TW91c2VQb3NpdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9tb3VzZXBvcztcclxuICB9XHJcbiAgaXNNb3VzZURvd24oYnV0dG9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW91c2VzdGF0ZVtidXR0b25dO1xyXG4gIH1cclxuICBpc01vdXNlVXAoYnV0dG9uKSB7XHJcbiAgICByZXR1cm4gIXRoaXMuX21vdXNlc3RhdGVbYnV0dG9uXTtcclxuICB9XHJcbiAgaXNLZXlEb3duKGNoYXJDb2RlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fa2V5c3RhdGVbY2hhckNvZGVdO1xyXG4gIH1cclxuICBpc0tleVVwKGNoYXJDb2RlKSB7XHJcbiAgICByZXR1cm4gIXRoaXMuX2tleXN0YXRlW2NoYXJDb2RlXTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnQge1xyXG4gIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyB0aGlzbmdsZSB7XHJcbiAgY29uc3RydWN0b3IoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICB9XHJcbiAgZ2V0IHJpZ2h0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XHJcbiAgfVxyXG4gIGdldCBib3R0b20oKSB7XHJcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XHJcbiAgfVxyXG4gIGdldCBsZWZ0KCkge1xyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG4gIGdldCB0b3AoKSB7XHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcbiAgaXNJbnRlcnNlY3RpbmcocmVjdCkge1xyXG4gICAgcmV0dXJuICEocmVjdC54ID49IHRoaXMucmlnaHQgfHwgcmVjdC5yaWdodCA8PSB0aGlzLnggfHwgcmVjdC55ID49IHRoaXMuYm90dG9tIHx8IHJlY3QuYm90dG9tIDw9IHRoaXMueSk7XHJcbiAgfVxyXG4gIGdldEhvcml6b250YWxJbnRlcnNlY3Rpb25EZXB0aChyZWN0KSB7XHJcbiAgICAvLyBDaGVjayBpZiBvdmVybGFwcGluZyBhdCBhbGwuXHJcbiAgICBpZiAoIXRoaXMuaXNJbnRlcnNlY3RpbmcocmVjdCkpIHJldHVybiAwO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBoYWxmIHNpemVzLlxyXG4gICAgdmFyIGhhbGZ3aWR0aEEgPSB0aGlzLndpZHRoIC8gMjtcclxuICAgIHZhciBoYWxmd2lkdGhCID0gcmVjdC53aWR0aCAvIDI7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGNlbnRlcnMuXHJcbiAgICB2YXIgY2VudGVyQSA9IHRoaXMueCArIGhhbGZ3aWR0aEE7XHJcbiAgICB2YXIgY2VudGVyQiA9IHJlY3QueCArIGhhbGZ3aWR0aEI7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGN1cnJlbnQgYW5kIG1pbmltdW0tbm9uLWludGVyc2VjdGluZyBkaXN0YW5jZXMgYmV0d2VlbiBjZW50ZXJzLlxyXG4gICAgdmFyIGRpc3RhbmNlWCA9IGNlbnRlckEgLSBjZW50ZXJCO1xyXG4gICAgdmFyIG1pbkRpc3RhbmNlWCA9IGhhbGZ3aWR0aEEgKyBoYWxmd2lkdGhCO1xyXG5cclxuICAgIC8vIElmIHdlIGFyZSBub3QgaW50ZXJzZWN0aW5nIGF0IGFsbCBvbiB0aGlzIGF4aXMsIHJldHVybiAwLlxyXG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlWCkgPj0gbWluRGlzdGFuY2VYKVxyXG4gICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgYW5kIHJldHVybiBpbnRlcnNlY3Rpb24gZGVwdGguXHJcbiAgICByZXR1cm4gZGlzdGFuY2VYID4gMCA/IG1pbkRpc3RhbmNlWCAtIGRpc3RhbmNlWCA6IC1taW5EaXN0YW5jZVggLSBkaXN0YW5jZVg7XHJcbiAgfVxyXG4gIGdldFZlcnRpY2FsSW50ZXJzZWN0aW9uRGVwdGgocmVjdCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgb3ZlcmxhcHBpbmcgYXQgYWxsLlxyXG4gICAgaWYgKCF0aGlzLmlzSW50ZXJzZWN0aW5nKHJlY3QpKSByZXR1cm4gMDtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgaGFsZiBzaXplcy5cclxuICAgIHZhciBoYWxmaGVpZ2h0QSA9IHRoaXMuaGVpZ2h0IC8gMjtcclxuICAgIHZhciBoYWxmaGVpZ2h0QiA9IHJlY3QuaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgY2VudGVycy5cclxuICAgIHZhciBjZW50ZXJBID0gdGhpcy55ICsgaGFsZmhlaWdodEE7XHJcbiAgICB2YXIgY2VudGVyQiA9IHJlY3QueSArIGhhbGZoZWlnaHRCO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBjdXJyZW50IGFuZCBtaW5pbXVtLW5vbi1pbnRlcnNlY3RpbmcgZGlzdGFuY2VzIGJldHdlZW4gY2VudGVycy5cclxuICAgIHZhciBkaXN0YW5jZVkgPSBjZW50ZXJBIC0gY2VudGVyQjtcclxuICAgIHZhciBtaW5EaXN0YW5jZVkgPSBoYWxmaGVpZ2h0QSArIGhhbGZoZWlnaHRCO1xyXG5cclxuICAgIC8vIElmIHdlIGFyZSBub3QgaW50ZXJzZWN0aW5nIGF0IGFsbCBvbiB0aGlzIGF4aXMsIHJldHVybiAwLlxyXG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlWSkgPj0gbWluRGlzdGFuY2VZKVxyXG4gICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgYW5kIHJldHVybiBpbnRlcnNlY3Rpb24gZGVwdGguXHJcbiAgICByZXR1cm4gZGlzdGFuY2VZID4gMCA/IG1pbkRpc3RhbmNlWSAtIGRpc3RhbmNlWSA6IC1taW5EaXN0YW5jZVkgLSBkaXN0YW5jZVk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyIHtcclxuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgfVxyXG4gIGRyYXdSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgY29sb3IpIHtcclxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIC8vIHRoaXMuaGVpZ2h0IC0geSAtIGhlaWdodCBpcyB0byBpbnZlcnQgdGhlIHkgYXhpcywgbWFraW5nIHRoZSBjb29yZGluYXRlIHN5c3RlbSBsaWtlIHRoYXQgb2YgWE5BIGFuZCBvdGhlciBlbmdpbmVzLlxyXG4gICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KHgsIHRoaXMuaGVpZ2h0IC0geSAtIGhlaWdodCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4uL0VuZ2luZS9SZWN0YW5nbGVcIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCIuLi9FbmdpbmUvUG9pbnRcIjtcclxuaW1wb3J0IFRpbGUgZnJvbSBcIi4uL1dvcmxkL1RpbGVcIjtcclxuY29uc3QgVElMRVMgPSBUaWxlLmdldFR5cGVzKCk7XHJcbmNvbnN0IFRJTEVfU0laRSA9IDMyOyAvLyBBc3N1bWluZyBwbGF5ZXIgaXMgc2FtZSBzaXplIGFzIHRpbGUsIGFsdGhvdWdoIGl0IHdpbGwgd29yayB3aXRoIG90aGVyIHNpemVzIHRvby5cclxuY29uc3QgTU9WRV9TUEVFRCA9IDE5MDtcclxuY29uc3QgS0VZX1cgPSA4NyxcclxuICBLRVlfQSA9IDY1LFxyXG4gIEtFWV9TID0gODMsXHJcbiAgS0VZX0QgPSA2OCxcclxuICBLRVlfVVAgPSAzOCxcclxuICBLRVlfTEVGVCA9IDM3LFxyXG4gIEtFWV9ET1dOID0gNDAsXHJcbiAgS0VZX1JJR0hUID0gMzk7XHJcbmNvbnN0IEZSSUNUSU9OID0gODA7XHJcbmNvbnN0IENvbGxpc2lvbkRpcmVjdGlvbiA9IHtcclxuICBWRVJUSUNBTDogMSxcclxuICBIT1JJWk9OVEFMOiAyXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xyXG4gIGNvbnN0cnVjdG9yKGxldmVsLCBjb2xvciwgaW5pdGlhbFBvc2l0aW9uKSB7XHJcbiAgICB0aGlzLmxldmVsID0gbGV2ZWw7XHJcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gaW5pdGlhbFBvc2l0aW9uO1xyXG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IHRoaXMuZ2V0Qm91bmRpbmdCb3goKTtcclxuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgfVxyXG4gIGdldEJvdW5kaW5nQm94KCkge1xyXG4gICAgLy8gTW9kaWZ5IHRoaXMgdG8gY2hhbmdlIHRoZSBwaHlzaWNhbCBzaGFwZSBvZiB0aGUgcGxheWVyLlxyXG4gICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIFRJTEVfU0laRSwgVElMRV9TSVpFKTtcclxuICB9XHJcbiAgdXBkYXRlKGlucHV0LCBkZWx0YSkge1xyXG4gICAgLy8gU1RFUCAxOiBHZXQgdGhlIGRpcmVjdGlvbiBtb3ZpbmcgYmFzZWQgb24ga2V5Ym9hcmQgbW92ZW1lbnRcclxuICAgIC8vIDEgaXMgdXAvbGVmdCwgMCBpcyBub25lLCBhbmQgLTEgaXMgZG93bi9yaWdodFxyXG4gICAgLy8gVGhpcyB3aWxsIGJlIGtub3duIGFzIHRoZSBhY2NlbGVyYXRpb24uIEFjY2VsZXJhdGlvbiBpcyB0aGUgbG93ZXN0IGxldmVsIG9mIGlucHV0LCBzbyBpdCBkb2VzIG5vdFxyXG4gICAgLy8gbmVlZCB0byBiZSBzdG9yZWQgYmV0d2VlbiBmcmFtZXMuXHJcbiAgICB2YXIgYWNjZWxlcmF0aW9uID0gbmV3IFBvaW50KDAsIDApO1xyXG5cclxuICAgIC8vIEhhbmRsZSBXQVNEIG9yIGFycm93IGtleSBtb3ZlbWVudFxyXG4gICAgaWYgKHRoaXMudXNlV0FTRCkge1xyXG4gICAgICBpZiAoaW5wdXQuaXNLZXlEb3duKEtFWV9EKSAmJiBpbnB1dC5pc0tleVVwKEtFWV9BKSkgYWNjZWxlcmF0aW9uLnggPSAxO1xyXG4gICAgICBlbHNlIGlmIChpbnB1dC5pc0tleURvd24oS0VZX0EpICYmIGlucHV0LmlzS2V5VXAoS0VZX0QpKSBhY2NlbGVyYXRpb24ueCA9IC0xO1xyXG4gICAgICBpZiAoaW5wdXQuaXNLZXlEb3duKEtFWV9XKSAmJiBpbnB1dC5pc0tleVVwKEtFWV9TKSkgYWNjZWxlcmF0aW9uLnkgPSAxO1xyXG4gICAgICBlbHNlIGlmIChpbnB1dC5pc0tleURvd24oS0VZX1MpICYmIGlucHV0LmlzS2V5VXAoS0VZX1cpKSBhY2NlbGVyYXRpb24ueSA9IC0xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfUklHSFQpICYmIGlucHV0LmlzS2V5VXAoS0VZX0xFRlQpKSBhY2NlbGVyYXRpb24ueCA9IDE7XHJcbiAgICAgIGVsc2UgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfTEVGVCkgJiYgaW5wdXQuaXNLZXlVcChLRVlfUklHSFQpKSBhY2NlbGVyYXRpb24ueCA9IC0xO1xyXG4gICAgICBpZiAoaW5wdXQuaXNLZXlEb3duKEtFWV9VUCkgJiYgaW5wdXQuaXNLZXlVcChLRVlfRE9XTikpIGFjY2VsZXJhdGlvbi55ID0gMTtcclxuICAgICAgZWxzZSBpZiAoaW5wdXQuaXNLZXlEb3duKEtFWV9ET1dOKSAmJiBpbnB1dC5pc0tleVVwKEtFWV9VUCkpIGFjY2VsZXJhdGlvbi55ID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU1RFUCAyOiBBZGQgdGhlIGFjY2VsZXJhdGlvbiB0byB0aGUgdmVsb2NpdHksIHRha2luZyBpbnRvIGFjY291bnQgZm9yIGRlbHRhIHRpbWUuXHJcbiAgICAvLyBEZWx0YSB0aW1lIHdpbGwgZGlmZmVyIGRlcGVuZGluZyBvbiB0aGUgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kLiBCeSBtdWx0aXBseWluZyBieSBpdCxcclxuICAgIC8vIGl0IG1ha2VzIHRoZSBtb3ZlbWVudCB0aGUgc2FtZSBzcGVlZCByZWdhcmRsZXNzIG9mIHRoZSBzeXN0ZW0ncyBwZXJmb3JtYW5jZS5cclxuICAgIHRoaXMudmVsb2NpdHkueCArPSBhY2NlbGVyYXRpb24ueCAqIE1PVkVfU1BFRUQgKiBkZWx0YTtcclxuICAgIHRoaXMudmVsb2NpdHkueSArPSBhY2NlbGVyYXRpb24ueSAqIE1PVkVfU1BFRUQgKiBkZWx0YTtcclxuXHJcbiAgICAvLyBTVEVQIDM6IEFkZCBmcmljdGlvbiAoZnJvbSBzbGlkaW5nIG9uIHRoZSBcImJhY2tncm91bmRcIiksIG9yIGVsc2UgdGhlIHZlbG9jaXR5IHdpbGwgbmV2ZXIgc2xvdyBkb3duIHdoZW4gdGhlIGtleXMgaXMgcmVsZWFzZWQuXHJcbiAgICAvLyBIaWdoZXIgZnJpY3Rpb24gd2lsbCBhbHNvIHNsb3cgZG93biB0aGUgbW92ZW1lbnQsIHNvIGFqdXN0IHRoZSBNT1ZFX1NQRUVEIGFjY29yZGluZ2x5LlxyXG4gICAgLy8gRnJpY3Rpb24gY291bGQgYWxzbyBiZSBoYW5kbGVkIGZvciBzb2xpZCBibG9ja3MgaW4gaGFuZGxlQ29sbGlzaW9ucyB0byBnaXZlIG1vcmUgZnJpY3Rpb24gdG8gc29saWQgYmxvY2tzXHJcbiAgICB0aGlzLnZlbG9jaXR5LnggLz0gRlJJQ1RJT04gKiBkZWx0YTtcclxuICAgIHRoaXMudmVsb2NpdHkueSAvPSBGUklDVElPTiAqIGRlbHRhO1xyXG5cclxuICAgIC8vIFNURVAgNDogSGFuZGxlIGNvbGxpc2lvbi5cclxuXHJcbiAgICAvLyBDb2xsaXNpb25zIGFyZSByZXNvbHZlZCBvbiBlYWNoIGF4aXMgaW5kZXBlbmRlbnRseS5cclxuICAgIC8vIFRoZSB2ZWxvY2l0eSBpcyB0aGVuIGFkZGVkIHRvIHRoZSBwb3NpdGlvbiwgd2hpY2ggbWFrZXMgdGhlIHBvc2l0aW9uIGluY3JlYXNlIGFzIHRoZSB2ZWxvY2l0eSBpcyA+IDAsIGFuZCBkZWNyZWFzZXMgd2hlbiBpdCBpcyA8IDAuXHJcbiAgICAvLyBCeSB1c2luZyBhY2NlbGVyYXRpb24sIHZlbG9jaXR5LCBhbmQgcG9zaXRpb24sIHdlIGNhbiBnZXQgYSBzbW9vdGggbW92ZW1lbnQgdGhhdCB0YWtlcyB0aW1lIHRvIHNwZWVkIHVwIGFuZCBzbG93IGRvd24uXHJcbiAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54O1xyXG4gICAgLy8gTm93IHRoYXQgdGhlIHBsYXllcidzIHBvc2l0aW9uIGhhcyBiZWVuIHVwZGF0ZWQgYmFzZWQgb24gdGhlIGFjY2VsZXJhdGlvbiBhbmQgdmVsb2NpdHksIGl0IG1heSBiZSBpbnRlcnNlY3RpbmcgYSBibG9jayBvciBwbGF5ZXIgYW5kIG11c3QgYmUgcmVzb2x2ZWQuXHJcbiAgICAvLyBSZWNvcmQgdGhlIHBvc2l0aW9uIGJlZm9yZSBoYW5kbGluZyBjb2xsaXNpb24uXHJcbiAgICB2YXIgbGFzdFggPSB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICAvLyBPbmx5IGhhbmRsZSBjb2xsaXNpb24gaWYgcG9zaXRpb24gaGFzIGNoYW5nZWQuXHJcbiAgICBpZiAodGhpcy5wb3NpdGlvbi54ICE9PSB0aGlzLnByZXZpb3VzUG9zaXRpb24ueClcclxuICAgICAgdGhpcy5oYW5kbGVDb2xsaXNpb25zKENvbGxpc2lvbkRpcmVjdGlvbi5IT1JJWk9OVEFMKTtcclxuXHJcbiAgICAvLyBEbyB0aGUgc2FtZSBmb3IgdGhlIFktQXhpc1xyXG4gICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueTtcclxuICAgIHZhciBsYXN0WSA9IHRoaXMucG9zaXRpb24ueTtcclxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgIT09IHRoaXMucHJldmlvdXNQb3NpdGlvbi55KVxyXG4gICAgICB0aGlzLmhhbmRsZUNvbGxpc2lvbnMoQ29sbGlzaW9uRGlyZWN0aW9uLlZFUlRJQ0FMKTtcclxuXHJcbiAgICAvLyBTVEVQIDU6IElmIHRoZSBwb3NpdGlvbiBhZnRlciBoYW5kbGluZyBjb2xsaXNpb24gaXMgZGlmZmVyZW50LCB0aGF0IG1lYW5zIGNvbGxpc2lvbiB3YXMgaGFuZGxlZCBhbmQgdGhlXHJcbiAgICAvLyB2ZWxvY2l0eSBzaG91bGQgYmUgc2V0IHRvIDAgdG8gZnVsbHkgY29tZSB0byBhIHN0b3AuXHJcbiAgICBpZiAodGhpcy5wb3NpdGlvbi54ICE9PSBsYXN0WCkge1xyXG4gICAgICB0aGlzLnZlbG9jaXR5LnggPSAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueSAhPT0gbGFzdFkpIHtcclxuICAgICAgdGhpcy52ZWxvY2l0eS55ID0gMDtcclxuICAgIH1cclxuICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IG5ldyBQb2ludCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSk7XHJcbiAgfVxyXG4gIGRyYXcocmVuZGVyZXIsIGRlbHRhKSB7XHJcbiAgICAvLyBEcmF3IGEgcmVjdGFuZ2xlIGZvciB0aGUgcGxheWVyLlxyXG4gICAgcmVuZGVyZXIuZHJhd1JlY3RhbmdsZShNYXRoLnJvdW5kKHRoaXMucG9zaXRpb24ueCksIE1hdGgucm91bmQodGhpcy5wb3NpdGlvbi55KSwgdGhpcy5ib3VuZGluZ0JveC53aWR0aCwgdGhpcy5ib3VuZGluZ0JveC5oZWlnaHQsIHRoaXMuY29sb3IpO1xyXG4gIH1cclxuICBoYW5kbGVDb2xsaXNpb25zKGRpcmVjdGlvbikge1xyXG4gICAgLy8gVXBkYXRlIHRoZSBwbGF5ZXIgYm91bmRzLlxyXG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IHRoaXMuZ2V0Qm91bmRpbmdCb3goKTtcclxuXHJcbiAgICAvLyBTVEVQIDE6IEhhbmRsZSBUaWxlIENvbGxpc2lvblxyXG4gICAgLy8gRmluZCB0aGUgdGlsZXMgc3Vycm91bmQgdGhlIHBsYXllci5cclxuICAgIC8vIE9ubHkgdGhlc2Ugd2lsbCBiZSB0ZXN0ZWQgZm9yIGNvbGxpc2lvbi5cclxuICAgIHZhciBsZWZ0VGlsZSA9IE1hdGguZmxvb3IodGhpcy5ib3VuZGluZ0JveC54IC8gVElMRV9TSVpFKTtcclxuICAgIHZhciByaWdodFRpbGUgPSBNYXRoLmNlaWwodGhpcy5ib3VuZGluZ0JveC5yaWdodCAvIFRJTEVfU0laRSkgLSAxO1xyXG4gICAgdmFyIHRvcFRpbGUgPSBNYXRoLmZsb29yKHRoaXMuYm91bmRpbmdCb3gueSAvIFRJTEVfU0laRSk7XHJcbiAgICB2YXIgYm90dG9tVGlsZSA9IE1hdGguY2VpbCh0aGlzLmJvdW5kaW5nQm94LmJvdHRvbSAvIFRJTEVfU0laRSkgLSAxO1xyXG5cclxuICAgIGZvciAodmFyIHkgPSB0b3BUaWxlOyB5IDw9IGJvdHRvbVRpbGU7ICsreSkge1xyXG4gICAgICBmb3IgKHZhciB4ID0gbGVmdFRpbGU7IHggPD0gcmlnaHRUaWxlOyArK3gpIHtcclxuICAgICAgICB2YXIgdGlsZSA9IHRoaXMubGV2ZWwudGlsZXNbeF1beV07XHJcblxyXG4gICAgICAgIGlmICh0aWxlLnR5cGUgPT09IFRJTEVTLlNPTElEKSB7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIHRpbGUsIHdoaWNoIHdpbGwgYmUgdGVzdGVkIGZvciBpbnRlcnNlY3Rpb24gd2l0aCB0aGUgcGxheWVyJ3MgYm91bmRzLlxyXG4gICAgICAgICAgLy8gVGhlIGJvdW5kaW5nIGJveCBkb2VzIG5vdCBoYXZlIHRvIGJlIHN0YXRpb25hcnksIGl0IHdvdWxkIHJlcHJlc2VudCBhIG1vdmluZyB0aWxlIGFuZCBpdCB3b3VsZCBzdGlsbCB3b3JrLlxyXG4gICAgICAgICAgdmFyIHRpbGVCb3VuZHMgPSB0aWxlLmdldEJvdW5kaW5nQm94KHgsIHkpO1xyXG5cclxuICAgICAgICAgIC8vIEZpbmQgaG93IGZhciB0aGUgdGlsZSBpbnRlcnNlY3RzIHRoZSBwbGF5ZXIgKGlmIGF0IGFsbClcclxuICAgICAgICAgIGxldCBkZXB0aCA9IHRoaXMuaW50ZXJzZWN0cyh0aWxlQm91bmRzLCBkaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICAgIHRoaXMuYXBwbHlEZXB0aChkaXJlY3Rpb24sIGRlcHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTVEVQIDI6IEhhbmRsZSBQbGF5ZXIgQ29sbGlzaW9uXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGV2ZWwucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5sZXZlbC5wbGF5ZXJzW2ldID09PSB0aGlzKSBjb250aW51ZTsgLy8gRG9uJ3QgY29sbGlkZSB3aXRoIG91cnNlbHZlcyFcclxuICAgICAgdmFyIHBsYXllckJvdW5kcyA9IHRoaXMubGV2ZWwucGxheWVyc1tpXS5nZXRCb3VuZGluZ0JveCgpOyAvLyBHZXQgYm91bmRzIG9mIHRoZSBvdGhlciBwbGF5ZXIuXHJcbiAgICAgIHZhciBkZXB0aCA9IHRoaXMuaW50ZXJzZWN0cyhwbGF5ZXJCb3VuZHMsIGRpcmVjdGlvbik7XHJcblxyXG4gICAgICB0aGlzLmFwcGx5RGVwdGgoZGlyZWN0aW9uLCBkZXB0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFwcGx5RGVwdGgoZGlyZWN0aW9uLCBkZXB0aCkge1xyXG4gICAgLy8gSWYgdGhlIGRlcHRoIGlzIG5vdCB6ZXJvLCB0aGUgcGxheWVyIGFuZCB0aWxlIGFyZSBjb2xsaWRpbmcgb24gdGhpcyBheGlzXHJcbiAgICBpZiAoZGVwdGggIT09IDApIHtcclxuICAgICAgaWYgKGRpcmVjdGlvbiA9PSBDb2xsaXNpb25EaXJlY3Rpb24uSE9SSVpPTlRBTClcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gZGVwdGg7XHJcbiAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBDb2xsaXNpb25EaXJlY3Rpb24uVkVSVElDQUwpXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IGRlcHRoO1xyXG4gICAgICB0aGlzLmJvdW5kaW5nQm94ID0gdGhpcy5nZXRCb3VuZGluZ0JveCgpOyAvLyBVcGRhdGUgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgcGxheWVyXHJcbiAgICB9XHJcbiAgfVxyXG4gIGludGVyc2VjdHMoYm94LCBkaXJlY3Rpb24pIHtcclxuICAgIC8vIFJldHVybiB0aGUgaW50ZXJzZWN0aW9uIGRlcHRoIGJldHdlZW4gdGhlIHBsYXllciBhbmQgdGhlIG9iamVjdCdzIGJvdW5kaW5nIGJveC5cclxuICAgIC8vIEluIG9yZGVyIHRvIGRvIGNvbGxpc2lvbiwgd2Ugd2lsbCBydW4gdGhpcyBtZXRob2QgZm9yIHRoZSBibG9ja3MgYXJvdW5kIHRoZSBwbGF5ZXIsIGFuZCBhbnkgb3RoZXIgcGxheWVycy5cclxuICAgIHJldHVybiBkaXJlY3Rpb24gPT0gQ29sbGlzaW9uRGlyZWN0aW9uLlZFUlRJQ0FMID8gdGhpcy5ib3VuZGluZ0JveC5nZXRWZXJ0aWNhbEludGVyc2VjdGlvbkRlcHRoKGJveCkgOiB0aGlzLmJvdW5kaW5nQm94LmdldEhvcml6b250YWxJbnRlcnNlY3Rpb25EZXB0aChib3gpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgVGlsZSBmcm9tIFwiLi9UaWxlXCI7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL0VudGl0aWVzL1BsYXllci5qc1wiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL0VuZ2luZS9Qb2ludC5qc1wiO1xyXG5jb25zdCBUSUxFUyA9IFRpbGUuZ2V0VHlwZXMoKTtcclxuY29uc3QgVElMRV9TSVpFID0gMzI7XHJcbmNvbnN0IFNPTElEX0NPTE9SID0gJyNiNGI0YjQnO1xyXG5jb25zdCBMRUZUX01PVVNFID0gMCxcclxuICBSSUdIVF9NT1VTRSA9IDI7XHJcbmNvbnN0IENvbGxpc2lvbkRpcmVjdGlvbiA9IHtcclxuICBWRVJUSUNBTDogMSxcclxuICBIT1JJWk9OVEFMOiAyXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbCB7XHJcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLnRpbGVzID0gW107XHJcbiAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSB0aGUgbGV2ZWwgdGlsZXMuXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xyXG4gICAgICB0aGlzLnRpbGVzW3hdID0gW107XHJcbiAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xyXG4gICAgICAgIC8vIENyZWF0ZSBib3JkZXIgYXJvdW5kIGxldmVsXHJcbiAgICAgICAgaWYgKHggPT09IDAgfHwgeSA9PT0gMCB8fCB4ID09PSB0aGlzLndpZHRoIC0gMSB8fCB5ID09PSB0aGlzLmhlaWdodCAtIDEpXHJcbiAgICAgICAgICB0aGlzLnRpbGVzW3hdW3ldID0gbmV3IFRpbGUoVElMRVMuU09MSUQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRoaXMudGlsZXNbeF1beV0gPSBuZXcgVGlsZShUSUxFUy5FTVBUWSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgcGxheWVyc1xyXG4gICAgdmFyIG1lID0gbmV3IFBsYXllcih0aGlzLCAncmVkJywgbmV3IFBvaW50KFRJTEVfU0laRSAqIDYsIFRJTEVfU0laRSAqIDYpKTtcclxuICAgIG1lLnVzZVdBU0QgPSB0cnVlOyAvLyBDb250cm9sIHRoaXMgcGxheWVyIHdpdGggV0FTRCBhbmQgdGhlIG90aGVyIHdpdGggdGhlIGFycm93IGtleXNcclxuICAgIHRoaXMucGxheWVycy5wdXNoKG1lKTtcclxuICAgIHRoaXMucGxheWVycy5wdXNoKG5ldyBQbGF5ZXIodGhpcywgJ2dyZWVuJywgbmV3IFBvaW50KFRJTEVfU0laRSAqIDIsIFRJTEVfU0laRSAqIDIpKSk7XHJcbiAgfVxyXG4gIG1vdXNlVG9Xb3JsZChwb3NpdGlvbikge1xyXG4gICAgLy8gQ29udmVydCBtb3VzZSBjb29yZGluYXRlcyB0byB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgIHJldHVybiBuZXcgUG9pbnQoTWF0aC5taW4oTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihwb3NpdGlvbi54IC8gVElMRV9TSVpFKSksIHRoaXMud2lkdGggLSAxKSwgTWF0aC5taW4oTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihwb3NpdGlvbi55IC8gVElMRV9TSVpFKSksIHRoaXMuaGVpZ2h0IC0gMSkpO1xyXG4gIH1cclxuICB1cGRhdGUoaW5wdXQsIGRlbHRhKSB7XHJcbiAgICAvLyBVcGRhdGUgcGxheWVyc1xyXG4gICAgZm9yICh2YXIgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICBwbGF5ZXIudXBkYXRlKGlucHV0LCBkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGxhY2UgYmxvY2tzXHJcbiAgICBpZiAoaW5wdXQuaXNNb3VzZURvd24oTEVGVF9NT1VTRSkgfHwgaW5wdXQuaXNNb3VzZURvd24oUklHSFRfTU9VU0UpKSB7XHJcbiAgICAgIHZhciB3b3JsZFBvcyA9IHRoaXMubW91c2VUb1dvcmxkKGlucHV0LmdldE1vdXNlUG9zaXRpb24oKSk7XHJcbiAgICAgIHZhciB0aWxlID0gdGhpcy50aWxlc1t3b3JsZFBvcy54XVt3b3JsZFBvcy55XTtcclxuICAgICAgaWYgKHRpbGUudHlwZSA9PT0gVElMRVMuRU1QVFkgJiYgaW5wdXQuaXNNb3VzZURvd24oTEVGVF9NT1VTRSkpXHJcbiAgICAgICAgdGlsZS50eXBlID0gVElMRVMuU09MSUQ7XHJcbiAgICAgIGVsc2UgaWYgKHRpbGUudHlwZSA9PT0gVElMRVMuU09MSUQgJiYgaW5wdXQuaXNNb3VzZURvd24oUklHSFRfTU9VU0UpKVxyXG4gICAgICAgIHRpbGUudHlwZSA9IFRJTEVTLkVNUFRZO1xyXG4gICAgfVxyXG4gIH1cclxuICBkcmF3KHJlbmRlcmVyLCBkZWx0YSkge1xyXG4gICAgLy8gRHJhdyB0aWxlc1xyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcclxuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgdmFyIHRpbGUgPSB0aGlzLnRpbGVzW3hdW3ldO1xyXG4gICAgICAgIGlmICh0aWxlLnR5cGUgPT09IFRJTEVTLlNPTElEKSB7XHJcbiAgICAgICAgICByZW5kZXJlci5kcmF3UmVjdGFuZ2xlKHggKiBUSUxFX1NJWkUsIHkgKiBUSUxFX1NJWkUsIFRJTEVfU0laRSwgVElMRV9TSVpFLCBTT0xJRF9DT0xPUik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRHJhdyBwbGF5ZXJzXHJcbiAgICBmb3IgKHZhciBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgIHBsYXllci5kcmF3KHJlbmRlcmVyLCBkZWx0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IFRJTEVfU0laRSA9IDMyO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuLi9FbmdpbmUvUmVjdGFuZ2xlXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGUge1xyXG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgfVxyXG4gIGdldEJvdW5kaW5nQm94KHgsIHkpIHtcclxuICAgIC8vIFJldHVybiByZWN0YW5nbGUgdGhhdCBkZWZpbmVzIHRoZSBzaGFwZSBvZiB0aGUgcGxheWVyLlxyXG4gICAgLy8gSXQgY2FuIGJlIG1vZGlmaWVkIHRvIHN1cHBvcnQgYmxvY2tzIHdpdGggZGlmZmVyZW50IHNoYXBlcyAoaWUgaGFsZiBibG9ja3MpXHJcbiAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh4ICogVElMRV9TSVpFLCB5ICogVElMRV9TSVpFLCBUSUxFX1NJWkUsIFRJTEVfU0laRSk7XHJcbiAgfVxyXG4gIHN0YXRpYyBnZXRUeXBlcygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIEVNUFRZOiAxLFxyXG4gICAgICBTT0xJRDogMCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDb2xsaXNpb25HYW1lIGZyb20gXCIuL0NvbGxpc2lvbkdhbWVcIjtcclxuZ2xvYmFsLkNvbGxpc2lvbkdhbWUgPSBDb2xsaXNpb25HYW1lO1xyXG4iXX0=
