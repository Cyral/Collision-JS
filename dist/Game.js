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
      this.position.x = this.position.x + this.velocity.x;
      // Now that the player's position has been updated based on the acceleration and velocity, it may be intersecting a block or player and must be resolved.
      // Record the position before handling collision.
      var lastX = this.position.x;
      // Only handle collision if position has changed.
      if (this.position.x !== this.previousPosition.x) this.handleCollisions(CollisionDirection.HORIZONTAL);

      // Do the same for the Y-Axis
      this.position.y = this.position.y + this.velocity.y;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXENvbGxpc2lvbkdhbWUuanMiLCJzcmNcXEVuZ2luZVxcR2FtZS5qcyIsInNyY1xcRW5naW5lXFxJbnB1dEhhbmRsZXIuanMiLCJzcmNcXEVuZ2luZVxcUG9pbnQuanMiLCJzcmNcXEVuZ2luZVxcUmVjdGFuZ2xlLmpzIiwic3JjXFxFbmdpbmVcXFJlbmRlcmVyLmpzIiwic3JjXFxFbnRpdGllc1xcUGxheWVyLmpzIiwic3JjXFxXb3JsZFxcTGV2ZWwuanMiLCJzcmNcXFdvcmxkXFxUaWxlLmpzIiwic3JjXFxzcmNcXGluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRXFCLGE7OztBQUNuQix5QkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE1BQTFCLEVBQWtDO0FBQUE7O0FBQUEsaUdBQzFCLEtBRDBCLEVBQ25CLEtBRG1CLEVBQ1osTUFEWTs7QUFFaEMsVUFBSyxLQUFMLEdBQWEsb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBUSxTQUFuQixDQUFWLEVBQXlDLEtBQUssS0FBTCxDQUFXLFNBQVMsU0FBcEIsQ0FBekMsQ0FBYjtBQUZnQztBQUdqQzs7OzsyQkFDTSxLLEVBQU8sSyxFQUFPO0FBQ25CLFVBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFDRSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQWxCLEVBQXlCLEtBQXpCO0FBQ0g7Ozt5QkFDSSxRLEVBQVUsSyxFQUFPO0FBQ3BCLFVBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFDRSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFFBQWhCLEVBQTBCLEtBQTFCO0FBQ0g7Ozs7OztrQkFaa0IsYTs7Ozs7Ozs7O0FDSHJCOzs7O0FBQ0E7Ozs7Ozs7OztJQUNxQixJLEdBQ25CLGNBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixNQUExQixFQUFrQztBQUFBOzs7QUFFaEMsT0FBSyxTQUFMLEdBQWlCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUFqQjtBQUNBLE9BQUssTUFBTCxHQUFjLEtBQUssU0FBTCxDQUFlLFdBQWYsQ0FBMkIsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQTNCLENBQWQ7QUFDQSxPQUFLLE1BQUwsQ0FBWSxZQUFaLENBQXlCLFVBQXpCLEVBQXFDLEdBQXJDLEU7QUFDQSxPQUFLLE1BQUwsQ0FBWSxLQUFaO0FBQ0EsT0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixRQUFRLElBQWxDO0FBQ0EsT0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixNQUFsQixHQUEyQixTQUFTLElBQXBDO0FBQ0EsT0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixPQUFsQixHQUE0QixNQUE1QjtBQUNBLE9BQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsUUFBbEIsR0FBNkIsVUFBN0I7QUFDQSxPQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLE1BQWxCLEdBQTJCLFNBQTNCO0FBQ0EsT0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixLQUFwQjtBQUNBLE9BQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsTUFBckI7QUFDQSxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLE9BQUssT0FBTCxHQUFlLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBZjs7O0FBR0EsT0FBSyxRQUFMLEdBQWdCLHVCQUFhLEtBQUssT0FBbEIsRUFBMkIsS0FBM0IsRUFBa0MsTUFBbEMsQ0FBaEI7OztBQUdBLE9BQUssS0FBTCxHQUFhLDJCQUFpQixLQUFLLE1BQXRCLEVBQThCLEtBQTlCLEVBQXFDLE1BQXJDLENBQWI7OztBQUdBLE1BQUksd0JBQXlCLFlBQVc7QUFDdEMsV0FBTyxPQUFPLHFCQUFQLElBQ0wsT0FBTywyQkFERixJQUVMLE9BQU8sd0JBRkYsSUFHTCxVQUFTLFFBQVQsRUFBbUI7QUFDakIsYUFBTyxVQUFQLENBQWtCLFFBQWxCLEVBQTRCLE9BQU8sRUFBbkM7QUFDRCxLQUxIO0FBTUQsR0FQMkIsRUFBNUI7O0FBU0EsTUFBSSxRQUFRLElBQVo7QUFDQSxNQUFJLFlBQVksS0FBSyxHQUFMLEVBQWhCOztBQUVBLFdBQVMsUUFBVCxHQUFvQjtBQUNsQiwwQkFBc0IsUUFBdEI7O0FBRUEsUUFBSSxNQUFNLEtBQUssR0FBTCxFQUFWO0FBQ0EsUUFBSSxRQUFRLENBQUMsTUFBTSxTQUFQLElBQW9CLElBQWhDOztBQUVBLFVBQU0sT0FBTixDQUFjLFNBQWQsR0FBMEIsTUFBMUI7QUFDQSxVQUFNLE9BQU4sQ0FBYyxRQUFkLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCLE1BQU0sS0FBbkMsRUFBMEMsTUFBTSxLQUFoRDs7QUFFQSxRQUFJLE1BQU0sTUFBVixFQUNFLE1BQU0sTUFBTixDQUFhLE1BQU0sS0FBbkIsRUFBMEIsS0FBMUI7QUFDRixRQUFJLE1BQU0sSUFBVixFQUNFLE1BQU0sSUFBTixDQUFXLE1BQU0sUUFBakIsRUFBMkIsS0FBM0I7QUFDRixnQkFBWSxHQUFaO0FBQ0Q7QUFDRDtBQUNELEM7O2tCQXJEa0IsSTs7Ozs7Ozs7Ozs7QUNIckI7Ozs7Ozs7O0lBQ3FCLFk7QUFDbkIsd0JBQVksU0FBWixFQUF1QixLQUF2QixFQUE4QixNQUE5QixFQUFzQztBQUFBOztBQUNwQyxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFqQjs7QUFFQSxTQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxRQUFJLFFBQVEsSUFBWjtBQUNBLFNBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsVUFBUyxDQUFULEVBQVk7QUFDckMsWUFBTSxTQUFOLENBQWdCLEVBQUUsT0FBRixHQUFZLEVBQUUsT0FBZCxHQUF3QixFQUFFLFFBQTFDLElBQXNELElBQXREO0FBQ0QsS0FGRDtBQUdBLFNBQUssU0FBTCxDQUFlLE9BQWYsR0FBeUIsVUFBUyxDQUFULEVBQVk7QUFDbkMsWUFBTSxTQUFOLENBQWdCLEVBQUUsT0FBRixHQUFZLEVBQUUsT0FBZCxHQUF3QixFQUFFLFFBQTFDLElBQXNELEtBQXREO0FBQ0QsS0FGRDs7QUFJQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsb0JBQVUsQ0FBVixFQUFhLENBQWIsQ0FBakI7QUFDQSxTQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLFVBQVMsQ0FBVCxFQUFZO0FBQ3ZDLFlBQU0sV0FBTixDQUFrQixFQUFFLE1BQXBCLElBQThCLElBQTlCO0FBQ0EsWUFBTSxTQUFOLEdBQWtCLG9CQUFVLEVBQUUsT0FBWixFQUFxQixNQUFNLE1BQU4sR0FBZSxFQUFFLE9BQXRDLENBQWxCO0FBQ0QsS0FIRDtBQUlBLFNBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsVUFBUyxDQUFULEVBQVk7QUFDckMsWUFBTSxXQUFOLENBQWtCLEVBQUUsTUFBcEIsSUFBOEIsS0FBOUI7QUFDQSxZQUFNLFNBQU4sR0FBa0Isb0JBQVUsRUFBRSxPQUFaLEVBQXFCLE1BQU0sTUFBTixHQUFlLEVBQUUsT0FBdEMsQ0FBbEI7QUFDRCxLQUhEO0FBSUEsU0FBSyxTQUFMLENBQWUsYUFBZixHQUErQixVQUFTLENBQVQsRUFBWTtBQUN6QyxRQUFFLGNBQUY7QUFDRCxLQUZEO0FBR0EsU0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixVQUFTLENBQVQsRUFBWTtBQUN2QyxZQUFNLFNBQU4sR0FBa0Isb0JBQVUsRUFBRSxPQUFaLEVBQXFCLE1BQU0sTUFBTixHQUFlLEVBQUUsT0FBdEMsQ0FBbEI7QUFDRCxLQUZEO0FBR0Q7Ozs7dUNBQ2tCO0FBQ2pCLGFBQU8sS0FBSyxTQUFaO0FBQ0Q7OztnQ0FDVyxNLEVBQVE7QUFDbEIsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBUDtBQUNEOzs7OEJBQ1MsTSxFQUFRO0FBQ2hCLGFBQU8sQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBUjtBQUNEOzs7OEJBQ1MsUSxFQUFVO0FBQ2xCLGFBQU8sS0FBSyxTQUFMLENBQWUsUUFBZixDQUFQO0FBQ0Q7Ozs0QkFDTyxRLEVBQVU7QUFDaEIsYUFBTyxDQUFDLEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBUjtBQUNEOzs7Ozs7a0JBOUNrQixZOzs7Ozs7Ozs7OztJQ0RBLEssR0FDbkIsZUFBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQjtBQUFBOztBQUNoQixPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNELEM7O2tCQUprQixLOzs7Ozs7Ozs7Ozs7O0lDQUEsUTtBQUNuQixvQkFBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixLQUFsQixFQUF5QixNQUF6QixFQUFpQztBQUFBOztBQUMvQixTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7Ozs7bUNBYWMsSSxFQUFNO0FBQ25CLGFBQU8sRUFBRSxLQUFLLENBQUwsSUFBVSxLQUFLLEtBQWYsSUFBd0IsS0FBSyxLQUFMLElBQWMsS0FBSyxDQUEzQyxJQUFnRCxLQUFLLENBQUwsSUFBVSxLQUFLLE1BQS9ELElBQXlFLEtBQUssTUFBTCxJQUFlLEtBQUssQ0FBL0YsQ0FBUDtBQUNEOzs7bURBQzhCLEksRUFBTTs7QUFFbkMsVUFBSSxDQUFDLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUFMLEVBQWdDLE9BQU8sQ0FBUDs7O0FBR2hDLFVBQUksYUFBYSxLQUFLLEtBQUwsR0FBYSxDQUE5QjtBQUNBLFVBQUksYUFBYSxLQUFLLEtBQUwsR0FBYSxDQUE5Qjs7O0FBR0EsVUFBSSxVQUFVLEtBQUssQ0FBTCxHQUFTLFVBQXZCO0FBQ0EsVUFBSSxVQUFVLEtBQUssQ0FBTCxHQUFTLFVBQXZCOzs7QUFHQSxVQUFJLFlBQVksVUFBVSxPQUExQjtBQUNBLFVBQUksZUFBZSxhQUFhLFVBQWhDOzs7QUFHQSxVQUFJLEtBQUssR0FBTCxDQUFTLFNBQVQsS0FBdUIsWUFBM0IsRUFDRSxPQUFPLENBQVA7OztBQUdGLGFBQU8sWUFBWSxDQUFaLEdBQWdCLGVBQWUsU0FBL0IsR0FBMkMsQ0FBQyxZQUFELEdBQWdCLFNBQWxFO0FBQ0Q7OztpREFDNEIsSSxFQUFNOztBQUVqQyxVQUFJLENBQUMsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQUwsRUFBZ0MsT0FBTyxDQUFQOzs7QUFHaEMsVUFBSSxjQUFjLEtBQUssTUFBTCxHQUFjLENBQWhDO0FBQ0EsVUFBSSxjQUFjLEtBQUssTUFBTCxHQUFjLENBQWhDOzs7QUFHQSxVQUFJLFVBQVUsS0FBSyxDQUFMLEdBQVMsV0FBdkI7QUFDQSxVQUFJLFVBQVUsS0FBSyxDQUFMLEdBQVMsV0FBdkI7OztBQUdBLFVBQUksWUFBWSxVQUFVLE9BQTFCO0FBQ0EsVUFBSSxlQUFlLGNBQWMsV0FBakM7OztBQUdBLFVBQUksS0FBSyxHQUFMLENBQVMsU0FBVCxLQUF1QixZQUEzQixFQUNFLE9BQU8sQ0FBUDs7O0FBR0YsYUFBTyxZQUFZLENBQVosR0FBZ0IsZUFBZSxTQUEvQixHQUEyQyxDQUFDLFlBQUQsR0FBZ0IsU0FBbEU7QUFDRDs7O3dCQTVEVztBQUNWLGFBQU8sS0FBSyxDQUFMLEdBQVMsS0FBSyxLQUFyQjtBQUNEOzs7d0JBQ1k7QUFDWCxhQUFPLEtBQUssQ0FBTCxHQUFTLEtBQUssTUFBckI7QUFDRDs7O3dCQUNVO0FBQ1QsYUFBTyxDQUFQO0FBQ0Q7Ozt3QkFDUztBQUNSLGFBQU8sQ0FBUDtBQUNEOzs7Ozs7a0JBbEJrQixROzs7Ozs7Ozs7Ozs7O0lDQUEsUTtBQUNuQixvQkFBWSxPQUFaLEVBQXFCLEtBQXJCLEVBQTRCLE1BQTVCLEVBQW9DO0FBQUE7O0FBQ2xDLFNBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNEOzs7O2tDQUNhLEMsRUFBRyxDLEVBQUcsSyxFQUFPLE0sRUFBUSxLLEVBQU87QUFDeEMsV0FBSyxPQUFMLENBQWEsU0FBYixHQUF5QixLQUF6Qjs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLENBQXRCLEVBQXlCLEtBQUssTUFBTCxHQUFjLENBQWQsR0FBa0IsTUFBM0MsRUFBbUQsS0FBbkQsRUFBMEQsTUFBMUQ7QUFDRDs7Ozs7O2tCQVZrQixROzs7Ozs7Ozs7OztBQ0FyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBQ0EsSUFBTSxRQUFRLGVBQUssUUFBTCxFQUFkO0FBQ0EsSUFBTSxZQUFZLEVBQWxCLEM7QUFDQSxJQUFNLGFBQWEsR0FBbkI7QUFDQSxJQUFNLFFBQVEsRUFBZDtJQUNFLFFBQVEsRUFEVjtJQUVFLFFBQVEsRUFGVjtJQUdFLFFBQVEsRUFIVjtJQUlFLFNBQVMsRUFKWDtJQUtFLFdBQVcsRUFMYjtJQU1FLFdBQVcsRUFOYjtJQU9FLFlBQVksRUFQZDtBQVFBLElBQU0sV0FBVyxFQUFqQjtBQUNBLElBQU0scUJBQXFCO0FBQ3pCLFlBQVUsQ0FEZTtBQUV6QixjQUFZO0FBRmEsQ0FBM0I7O0lBS3FCLE07QUFDbkIsa0JBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixlQUExQixFQUEyQztBQUFBOztBQUN6QyxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFNBQUssUUFBTCxHQUFnQixlQUFoQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLGNBQUwsRUFBbkI7QUFDQSxTQUFLLFFBQUwsR0FBZ0Isb0JBQVUsQ0FBVixFQUFhLENBQWIsQ0FBaEI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLG9CQUFVLENBQVYsRUFBYSxDQUFiLENBQXhCO0FBQ0Q7Ozs7cUNBQ2dCOztBQUVmLGFBQU8sd0JBQWMsS0FBSyxRQUFMLENBQWMsQ0FBNUIsRUFBK0IsS0FBSyxRQUFMLENBQWMsQ0FBN0MsRUFBZ0QsU0FBaEQsRUFBMkQsU0FBM0QsQ0FBUDtBQUNEOzs7MkJBQ00sSyxFQUFPLEssRUFBTzs7Ozs7QUFLbkIsVUFBSSxlQUFlLG9CQUFVLENBQVYsRUFBYSxDQUFiLENBQW5COzs7QUFHQSxVQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixZQUFJLE1BQU0sU0FBTixDQUFnQixLQUFoQixLQUEwQixNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQTlCLEVBQW9ELGFBQWEsQ0FBYixHQUFpQixDQUFqQixDQUFwRCxLQUNLLElBQUksTUFBTSxTQUFOLENBQWdCLEtBQWhCLEtBQTBCLE1BQU0sT0FBTixDQUFjLEtBQWQsQ0FBOUIsRUFBb0QsYUFBYSxDQUFiLEdBQWlCLENBQUMsQ0FBbEI7QUFDekQsWUFBSSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsS0FBMEIsTUFBTSxPQUFOLENBQWMsS0FBZCxDQUE5QixFQUFvRCxhQUFhLENBQWIsR0FBaUIsQ0FBakIsQ0FBcEQsS0FDSyxJQUFJLE1BQU0sU0FBTixDQUFnQixLQUFoQixLQUEwQixNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQTlCLEVBQW9ELGFBQWEsQ0FBYixHQUFpQixDQUFDLENBQWxCO0FBQzFELE9BTEQsTUFLTztBQUNMLFlBQUksTUFBTSxTQUFOLENBQWdCLFNBQWhCLEtBQThCLE1BQU0sT0FBTixDQUFjLFFBQWQsQ0FBbEMsRUFBMkQsYUFBYSxDQUFiLEdBQWlCLENBQWpCLENBQTNELEtBQ0ssSUFBSSxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsS0FBNkIsTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFqQyxFQUEyRCxhQUFhLENBQWIsR0FBaUIsQ0FBQyxDQUFsQjtBQUNoRSxZQUFJLE1BQU0sU0FBTixDQUFnQixNQUFoQixLQUEyQixNQUFNLE9BQU4sQ0FBYyxRQUFkLENBQS9CLEVBQXdELGFBQWEsQ0FBYixHQUFpQixDQUFqQixDQUF4RCxLQUNLLElBQUksTUFBTSxTQUFOLENBQWdCLFFBQWhCLEtBQTZCLE1BQU0sT0FBTixDQUFjLE1BQWQsQ0FBakMsRUFBd0QsYUFBYSxDQUFiLEdBQWlCLENBQUMsQ0FBbEI7QUFDOUQ7Ozs7O0FBS0QsV0FBSyxRQUFMLENBQWMsQ0FBZCxJQUFtQixhQUFhLENBQWIsR0FBaUIsVUFBakIsR0FBOEIsS0FBakQ7QUFDQSxXQUFLLFFBQUwsQ0FBYyxDQUFkLElBQW1CLGFBQWEsQ0FBYixHQUFpQixVQUFqQixHQUE4QixLQUFqRDs7Ozs7QUFLQSxXQUFLLFFBQUwsQ0FBYyxDQUFkLElBQW1CLFdBQVcsS0FBOUI7QUFDQSxXQUFLLFFBQUwsQ0FBYyxDQUFkLElBQW1CLFdBQVcsS0FBOUI7Ozs7Ozs7QUFPQSxXQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLEtBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsS0FBSyxRQUFMLENBQWMsQ0FBbEQ7OztBQUdBLFVBQUksUUFBUSxLQUFLLFFBQUwsQ0FBYyxDQUExQjs7QUFFQSxVQUFJLEtBQUssUUFBTCxDQUFjLENBQWQsS0FBb0IsS0FBSyxnQkFBTCxDQUFzQixDQUE5QyxFQUNFLEtBQUssZ0JBQUwsQ0FBc0IsbUJBQW1CLFVBQXpDOzs7QUFHRixXQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLEtBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsS0FBSyxRQUFMLENBQWMsQ0FBbEQ7QUFDQSxVQUFJLFFBQVEsS0FBSyxRQUFMLENBQWMsQ0FBMUI7QUFDQSxVQUFJLEtBQUssUUFBTCxDQUFjLENBQWQsS0FBb0IsS0FBSyxnQkFBTCxDQUFzQixDQUE5QyxFQUNFLEtBQUssZ0JBQUwsQ0FBc0IsbUJBQW1CLFFBQXpDOzs7O0FBSUYsVUFBSSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEtBQW9CLEtBQXhCLEVBQStCO0FBQzdCLGFBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsQ0FBbEI7QUFDRDtBQUNELFVBQUksS0FBSyxRQUFMLENBQWMsQ0FBZCxLQUFvQixLQUF4QixFQUErQjtBQUM3QixhQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLENBQWxCO0FBQ0Q7QUFDRCxXQUFLLGdCQUFMLEdBQXdCLG9CQUFVLEtBQUssUUFBTCxDQUFjLENBQXhCLEVBQTJCLEtBQUssUUFBTCxDQUFjLENBQXpDLENBQXhCO0FBQ0Q7Ozt5QkFDSSxRLEVBQVUsSyxFQUFPOztBQUVwQixlQUFTLGFBQVQsQ0FBdUIsS0FBSyxLQUFMLENBQVcsS0FBSyxRQUFMLENBQWMsQ0FBekIsQ0FBdkIsRUFBb0QsS0FBSyxLQUFMLENBQVcsS0FBSyxRQUFMLENBQWMsQ0FBekIsQ0FBcEQsRUFBaUYsS0FBSyxXQUFMLENBQWlCLEtBQWxHLEVBQXlHLEtBQUssV0FBTCxDQUFpQixNQUExSCxFQUFrSSxLQUFLLEtBQXZJO0FBQ0Q7OztxQ0FDZ0IsUyxFQUFXOztBQUUxQixXQUFLLFdBQUwsR0FBbUIsS0FBSyxjQUFMLEVBQW5COzs7OztBQUtBLFVBQUksV0FBVyxLQUFLLEtBQUwsQ0FBVyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsR0FBcUIsU0FBaEMsQ0FBZjtBQUNBLFVBQUksWUFBWSxLQUFLLElBQUwsQ0FBVSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsR0FBeUIsU0FBbkMsSUFBZ0QsQ0FBaEU7QUFDQSxVQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsS0FBSyxXQUFMLENBQWlCLENBQWpCLEdBQXFCLFNBQWhDLENBQWQ7QUFDQSxVQUFJLGFBQWEsS0FBSyxJQUFMLENBQVUsS0FBSyxXQUFMLENBQWlCLE1BQWpCLEdBQTBCLFNBQXBDLElBQWlELENBQWxFOztBQUVBLFdBQUssSUFBSSxJQUFJLE9BQWIsRUFBc0IsS0FBSyxVQUEzQixFQUF1QyxFQUFFLENBQXpDLEVBQTRDO0FBQzFDLGFBQUssSUFBSSxJQUFJLFFBQWIsRUFBdUIsS0FBSyxTQUE1QixFQUF1QyxFQUFFLENBQXpDLEVBQTRDO0FBQzFDLGNBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQVg7O0FBRUEsY0FBSSxLQUFLLElBQUwsS0FBYyxNQUFNLEtBQXhCLEVBQStCOzs7O0FBSTdCLGdCQUFJLGFBQWEsS0FBSyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLENBQXZCLENBQWpCOzs7QUFHQSxnQkFBSSxTQUFRLEtBQUssVUFBTCxDQUFnQixVQUFoQixFQUE0QixTQUE1QixDQUFaOztBQUVBLGlCQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsRUFBMkIsTUFBM0I7QUFDRDtBQUNGO0FBQ0Y7OztBQUdELFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLE1BQXZDLEVBQStDLEdBQS9DLEVBQW9EO0FBQ2xELFlBQUksS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixDQUFuQixNQUEwQixJQUE5QixFQUFvQyxTO0FBQ3BDLFlBQUksZUFBZSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLENBQW5CLEVBQXNCLGNBQXRCLEVBQW5CLEM7QUFDQSxZQUFJLFFBQVEsS0FBSyxVQUFMLENBQWdCLFlBQWhCLEVBQThCLFNBQTlCLENBQVo7O0FBRUEsYUFBSyxVQUFMLENBQWdCLFNBQWhCLEVBQTJCLEtBQTNCO0FBQ0Q7QUFDRjs7OytCQUNVLFMsRUFBVyxLLEVBQU87O0FBRTNCLFVBQUksVUFBVSxDQUFkLEVBQWlCO0FBQ2YsWUFBSSxhQUFhLG1CQUFtQixVQUFwQyxFQUNFLEtBQUssUUFBTCxDQUFjLENBQWQsSUFBbUIsS0FBbkIsQ0FERixLQUVLLElBQUksYUFBYSxtQkFBbUIsUUFBcEMsRUFDSCxLQUFLLFFBQUwsQ0FBYyxDQUFkLElBQW1CLEtBQW5CO0FBQ0YsYUFBSyxXQUFMLEdBQW1CLEtBQUssY0FBTCxFQUFuQixDO0FBQ0Q7QUFDRjs7OytCQUNVLEcsRUFBSyxTLEVBQVc7OztBQUd6QixhQUFPLGFBQWEsbUJBQW1CLFFBQWhDLEdBQTJDLEtBQUssV0FBTCxDQUFpQiw0QkFBakIsQ0FBOEMsR0FBOUMsQ0FBM0MsR0FBZ0csS0FBSyxXQUFMLENBQWlCLDhCQUFqQixDQUFnRCxHQUFoRCxDQUF2RztBQUNEOzs7Ozs7a0JBbklrQixNOzs7Ozs7Ozs7OztBQ3BCckI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU0sUUFBUSxlQUFLLFFBQUwsRUFBZDtBQUNBLElBQU0sWUFBWSxFQUFsQjtBQUNBLElBQU0sY0FBYyxTQUFwQjtBQUNBLElBQU0sYUFBYSxDQUFuQjtJQUNFLGNBQWMsQ0FEaEI7QUFFQSxJQUFNLHFCQUFxQjtBQUN6QixZQUFVLENBRGU7QUFFekIsY0FBWTtBQUZhLENBQTNCOztJQUtxQixLO0FBQ25CLGlCQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkI7QUFBQTs7QUFDekIsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFNBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxTQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBSyxPQUFMLEdBQWUsRUFBZjs7O0FBR0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssS0FBekIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkMsV0FBSyxLQUFMLENBQVcsQ0FBWCxJQUFnQixFQUFoQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDOztBQUVwQyxZQUFJLE1BQU0sQ0FBTixJQUFXLE1BQU0sQ0FBakIsSUFBc0IsTUFBTSxLQUFLLEtBQUwsR0FBYSxDQUF6QyxJQUE4QyxNQUFNLEtBQUssTUFBTCxHQUFjLENBQXRFLEVBQ0UsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsSUFBbUIsbUJBQVMsTUFBTSxLQUFmLENBQW5CLENBREYsS0FHRSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxJQUFtQixtQkFBUyxNQUFNLEtBQWYsQ0FBbkI7QUFDSDtBQUNGOzs7QUFHRCxRQUFJLEtBQUsscUJBQVcsSUFBWCxFQUFpQixLQUFqQixFQUF3QixvQkFBVSxZQUFZLENBQXRCLEVBQXlCLFlBQVksQ0FBckMsQ0FBeEIsQ0FBVDtBQUNBLE9BQUcsT0FBSCxHQUFhLElBQWIsQztBQUNBLFNBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsRUFBbEI7QUFDQSxTQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLHFCQUFXLElBQVgsRUFBaUIsT0FBakIsRUFBMEIsb0JBQVUsWUFBWSxDQUF0QixFQUF5QixZQUFZLENBQXJDLENBQTFCLENBQWxCO0FBQ0Q7Ozs7aUNBQ1ksUSxFQUFVOztBQUVyQixhQUFPLG9CQUFVLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLLEtBQUwsQ0FBVyxTQUFTLENBQVQsR0FBYSxTQUF4QixDQUFaLENBQVQsRUFBMEQsS0FBSyxLQUFMLEdBQWEsQ0FBdkUsQ0FBVixFQUFxRixLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBSyxLQUFMLENBQVcsU0FBUyxDQUFULEdBQWEsU0FBeEIsQ0FBWixDQUFULEVBQTBELEtBQUssTUFBTCxHQUFjLENBQXhFLENBQXJGLENBQVA7QUFDRDs7OzJCQUNNLEssRUFBTyxLLEVBQU87O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBRW5CLDZCQUFtQixLQUFLLE9BQXhCLDhIQUFpQztBQUFBLGNBQXhCLE1BQXdCOztBQUMvQixpQkFBTyxNQUFQLENBQWMsS0FBZCxFQUFxQixLQUFyQjtBQUNEOzs7QUFKa0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPbkIsVUFBSSxNQUFNLFdBQU4sQ0FBa0IsVUFBbEIsS0FBaUMsTUFBTSxXQUFOLENBQWtCLFdBQWxCLENBQXJDLEVBQXFFO0FBQ25FLFlBQUksV0FBVyxLQUFLLFlBQUwsQ0FBa0IsTUFBTSxnQkFBTixFQUFsQixDQUFmO0FBQ0EsWUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLFNBQVMsQ0FBcEIsRUFBdUIsU0FBUyxDQUFoQyxDQUFYO0FBQ0EsWUFBSSxLQUFLLElBQUwsS0FBYyxNQUFNLEtBQXBCLElBQTZCLE1BQU0sV0FBTixDQUFrQixVQUFsQixDQUFqQyxFQUNFLEtBQUssSUFBTCxHQUFZLE1BQU0sS0FBbEIsQ0FERixLQUVLLElBQUksS0FBSyxJQUFMLEtBQWMsTUFBTSxLQUFwQixJQUE2QixNQUFNLFdBQU4sQ0FBa0IsV0FBbEIsQ0FBakMsRUFDSCxLQUFLLElBQUwsR0FBWSxNQUFNLEtBQWxCO0FBQ0g7QUFDRjs7O3lCQUNJLFEsRUFBVSxLLEVBQU87O0FBRXBCLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQXpCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ25DLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ3BDLGNBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFYO0FBQ0EsY0FBSSxLQUFLLElBQUwsS0FBYyxNQUFNLEtBQXhCLEVBQStCO0FBQzdCLHFCQUFTLGFBQVQsQ0FBdUIsSUFBSSxTQUEzQixFQUFzQyxJQUFJLFNBQTFDLEVBQXFELFNBQXJELEVBQWdFLFNBQWhFLEVBQTJFLFdBQTNFO0FBQ0Q7QUFDRjtBQUNGOzs7QUFUbUI7QUFBQTtBQUFBOztBQUFBO0FBWXBCLDhCQUFtQixLQUFLLE9BQXhCLG1JQUFpQztBQUFBLGNBQXhCLE1BQXdCOztBQUMvQixpQkFBTyxJQUFQLENBQVksUUFBWixFQUFzQixLQUF0QjtBQUNEO0FBZG1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFlckI7Ozs7OztrQkE1RGtCLEs7Ozs7Ozs7Ozs7O0FDWnJCOzs7Ozs7OztBQURBLElBQU0sWUFBWSxFQUFsQjs7SUFFcUIsSTtBQUNuQixnQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDRDs7OzttQ0FDYyxDLEVBQUcsQyxFQUFHOzs7QUFHbkIsYUFBTyx3QkFBYyxJQUFJLFNBQWxCLEVBQTZCLElBQUksU0FBakMsRUFBNEMsU0FBNUMsRUFBdUQsU0FBdkQsQ0FBUDtBQUNEOzs7K0JBQ2lCO0FBQ2hCLGFBQU87QUFDTCxlQUFPLENBREY7QUFFTCxlQUFPO0FBRkYsT0FBUDtBQUlEOzs7Ozs7a0JBZGtCLEk7Ozs7OztBQ0ZyQjs7Ozs7O0FBQ0EsT0FBTyxhQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBHYW1lIGZyb20gXCIuL0VuZ2luZS9HYW1lXCI7XHJcbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9Xb3JsZC9MZXZlbFwiO1xyXG5jb25zdCBUSUxFX1NJWkUgPSAzMjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxpc2lvbkdhbWUgZXh0ZW5kcyBHYW1lIHtcclxuICBjb25zdHJ1Y3RvcihzdGFnZSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgc3VwZXIoc3RhZ2UsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgdGhpcy5sZXZlbCA9IG5ldyBMZXZlbChNYXRoLmZsb29yKHdpZHRoIC8gVElMRV9TSVpFKSwgTWF0aC5mbG9vcihoZWlnaHQgLyBUSUxFX1NJWkUpKTtcclxuICB9XHJcbiAgdXBkYXRlKGlucHV0LCBkZWx0YSkge1xyXG4gICAgaWYgKHRoaXMubGV2ZWwgIT09IHVuZGVmaW5lZClcclxuICAgICAgdGhpcy5sZXZlbC51cGRhdGUoaW5wdXQsIGRlbHRhKTtcclxuICB9XHJcbiAgZHJhdyhyZW5kZXJlciwgZGVsdGEpIHtcclxuICAgIGlmICh0aGlzLmxldmVsICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHRoaXMubGV2ZWwuZHJhdyhyZW5kZXJlciwgZGVsdGEpO1xyXG4gIH1cclxufVxyXG4iLCIvLyBBIHNpbXBsZSBnYW1lIFwiZW5naW5lXCIgdG8gYWJzdHJhY3QgYXdheSBkcmF3aW5nIGFuZCBjYW52YXMgc3R1ZmZcclxuaW1wb3J0IFJlbmRlcmVyIGZyb20gXCIuL1JlbmRlcmVyXCI7XHJcbmltcG9ydCBJbnB1dEhhbmRsZXIgZnJvbSBcIi4vSW5wdXRIYW5kbGVyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xyXG4gIGNvbnN0cnVjdG9yKHN0YWdlLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvLyBDcmVhdGUgY2FudmFzXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0YWdlKTtcclxuICAgIHRoaXMuY2FudmFzID0gdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykpO1xyXG4gICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7IC8vIE1ha2UgZm9jdXNhYmxlIHNvIGV2ZW50cyB3b3JrXHJcbiAgICB0aGlzLmNhbnZhcy5mb2N1cygpO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcclxuICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcclxuICAgIHRoaXMuY2FudmFzLnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcclxuICAgIHRoaXMuY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHJlbmRlcmVyIHRvIGFic3RyYWN0IGF3YXkgZHJhdyBmdW5jdGlvbnNcclxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodGhpcy5jb250ZXh0LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBIb29rIHVwIGlucHV0IGV2ZW50c1xyXG4gICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dEhhbmRsZXIodGhpcy5jYW52YXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgIC8vIFNldHVwIGFuaW1hdGlvbiBsb29wXHJcbiAgICB2YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIHZhciBfc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgbGFzdEZyYW1lID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltbG9vcCgpIHtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1sb29wKTtcclxuXHJcbiAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgICB2YXIgZGVsdGEgPSAobm93IC0gbGFzdEZyYW1lKSAvIDEwMDA7XHJcblxyXG4gICAgICBfc2VsZi5jb250ZXh0LmZpbGxTdHlsZSA9IFwiI0ZGRlwiO1xyXG4gICAgICBfc2VsZi5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIF9zZWxmLndpZHRoLCBfc2VsZi53aWR0aCk7XHJcblxyXG4gICAgICBpZiAoX3NlbGYudXBkYXRlKVxyXG4gICAgICAgIF9zZWxmLnVwZGF0ZShfc2VsZi5pbnB1dCwgZGVsdGEpO1xyXG4gICAgICBpZiAoX3NlbGYuZHJhdylcclxuICAgICAgICBfc2VsZi5kcmF3KF9zZWxmLnJlbmRlcmVyLCBkZWx0YSk7XHJcbiAgICAgIGxhc3RGcmFtZSA9IG5vdztcclxuICAgIH1cclxuICAgIGFuaW1sb29wKCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dEhhbmRsZXIge1xyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIC8vIEhvb2sgdXAgZXZlbnRzXHJcbiAgICB0aGlzLl9rZXlzdGF0ZSA9IHt9O1xyXG4gICAgdmFyIF9zZWxmID0gdGhpcztcclxuICAgIHRoaXMuY29udGFpbmVyLm9ua2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgX3NlbGYuX2tleXN0YXRlW2Uua2V5Q29kZSA/IGUua2V5Q29kZSA6IGUuY2hhckNvZGVdID0gdHJ1ZTtcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbmtleXVwID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBfc2VsZi5fa2V5c3RhdGVbZS5rZXlDb2RlID8gZS5rZXlDb2RlIDogZS5jaGFyQ29kZV0gPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fbW91c2VzdGF0ZSA9IHt9O1xyXG4gICAgdGhpcy5fbW91c2Vwb3MgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgX3NlbGYuX21vdXNlc3RhdGVbZS5idXR0b25dID0gdHJ1ZTtcclxuICAgICAgX3NlbGYuX21vdXNlcG9zID0gbmV3IFBvaW50KGUub2Zmc2V0WCwgX3NlbGYuaGVpZ2h0IC0gZS5vZmZzZXRZKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNldXAgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIF9zZWxmLl9tb3VzZXN0YXRlW2UuYnV0dG9uXSA9IGZhbHNlO1xyXG4gICAgICBfc2VsZi5fbW91c2Vwb3MgPSBuZXcgUG9pbnQoZS5vZmZzZXRYLCBfc2VsZi5oZWlnaHQgLSBlLm9mZnNldFkpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuY29udGFpbmVyLm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgX3NlbGYuX21vdXNlcG9zID0gbmV3IFBvaW50KGUub2Zmc2V0WCwgX3NlbGYuaGVpZ2h0IC0gZS5vZmZzZXRZKTtcclxuICAgIH07XHJcbiAgfVxyXG4gIGdldE1vdXNlUG9zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW91c2Vwb3M7XHJcbiAgfVxyXG4gIGlzTW91c2VEb3duKGJ1dHRvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vdXNlc3RhdGVbYnV0dG9uXTtcclxuICB9XHJcbiAgaXNNb3VzZVVwKGJ1dHRvbikge1xyXG4gICAgcmV0dXJuICF0aGlzLl9tb3VzZXN0YXRlW2J1dHRvbl07XHJcbiAgfVxyXG4gIGlzS2V5RG93bihjaGFyQ29kZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2tleXN0YXRlW2NoYXJDb2RlXTtcclxuICB9XHJcbiAgaXNLZXlVcChjaGFyQ29kZSkge1xyXG4gICAgcmV0dXJuICF0aGlzLl9rZXlzdGF0ZVtjaGFyQ29kZV07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50IHtcclxuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgdGhpc25nbGUge1xyXG4gIGNvbnN0cnVjdG9yKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgfVxyXG4gIGdldCByaWdodCgpIHtcclxuICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoO1xyXG4gIH1cclxuICBnZXQgYm90dG9tKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xyXG4gIH1cclxuICBnZXQgbGVmdCgpIHtcclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuICBnZXQgdG9wKCkge1xyXG4gICAgcmV0dXJuIHk7XHJcbiAgfVxyXG4gIGlzSW50ZXJzZWN0aW5nKHJlY3QpIHtcclxuICAgIHJldHVybiAhKHJlY3QueCA+PSB0aGlzLnJpZ2h0IHx8IHJlY3QucmlnaHQgPD0gdGhpcy54IHx8IHJlY3QueSA+PSB0aGlzLmJvdHRvbSB8fCByZWN0LmJvdHRvbSA8PSB0aGlzLnkpO1xyXG4gIH1cclxuICBnZXRIb3Jpem9udGFsSW50ZXJzZWN0aW9uRGVwdGgocmVjdCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgb3ZlcmxhcHBpbmcgYXQgYWxsLlxyXG4gICAgaWYgKCF0aGlzLmlzSW50ZXJzZWN0aW5nKHJlY3QpKSByZXR1cm4gMDtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgaGFsZiBzaXplcy5cclxuICAgIHZhciBoYWxmd2lkdGhBID0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICB2YXIgaGFsZndpZHRoQiA9IHJlY3Qud2lkdGggLyAyO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBjZW50ZXJzLlxyXG4gICAgdmFyIGNlbnRlckEgPSB0aGlzLnggKyBoYWxmd2lkdGhBO1xyXG4gICAgdmFyIGNlbnRlckIgPSByZWN0LnggKyBoYWxmd2lkdGhCO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBjdXJyZW50IGFuZCBtaW5pbXVtLW5vbi1pbnRlcnNlY3RpbmcgZGlzdGFuY2VzIGJldHdlZW4gY2VudGVycy5cclxuICAgIHZhciBkaXN0YW5jZVggPSBjZW50ZXJBIC0gY2VudGVyQjtcclxuICAgIHZhciBtaW5EaXN0YW5jZVggPSBoYWxmd2lkdGhBICsgaGFsZndpZHRoQjtcclxuXHJcbiAgICAvLyBJZiB3ZSBhcmUgbm90IGludGVyc2VjdGluZyBhdCBhbGwgb24gdGhpcyBheGlzLCByZXR1cm4gMC5cclxuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZVgpID49IG1pbkRpc3RhbmNlWClcclxuICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGFuZCByZXR1cm4gaW50ZXJzZWN0aW9uIGRlcHRoLlxyXG4gICAgcmV0dXJuIGRpc3RhbmNlWCA+IDAgPyBtaW5EaXN0YW5jZVggLSBkaXN0YW5jZVggOiAtbWluRGlzdGFuY2VYIC0gZGlzdGFuY2VYO1xyXG4gIH1cclxuICBnZXRWZXJ0aWNhbEludGVyc2VjdGlvbkRlcHRoKHJlY3QpIHtcclxuICAgIC8vIENoZWNrIGlmIG92ZXJsYXBwaW5nIGF0IGFsbC5cclxuICAgIGlmICghdGhpcy5pc0ludGVyc2VjdGluZyhyZWN0KSkgcmV0dXJuIDA7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGhhbGYgc2l6ZXMuXHJcbiAgICB2YXIgaGFsZmhlaWdodEEgPSB0aGlzLmhlaWdodCAvIDI7XHJcbiAgICB2YXIgaGFsZmhlaWdodEIgPSByZWN0LmhlaWdodCAvIDI7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGNlbnRlcnMuXHJcbiAgICB2YXIgY2VudGVyQSA9IHRoaXMueSArIGhhbGZoZWlnaHRBO1xyXG4gICAgdmFyIGNlbnRlckIgPSByZWN0LnkgKyBoYWxmaGVpZ2h0QjtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgY3VycmVudCBhbmQgbWluaW11bS1ub24taW50ZXJzZWN0aW5nIGRpc3RhbmNlcyBiZXR3ZWVuIGNlbnRlcnMuXHJcbiAgICB2YXIgZGlzdGFuY2VZID0gY2VudGVyQSAtIGNlbnRlckI7XHJcbiAgICB2YXIgbWluRGlzdGFuY2VZID0gaGFsZmhlaWdodEEgKyBoYWxmaGVpZ2h0QjtcclxuXHJcbiAgICAvLyBJZiB3ZSBhcmUgbm90IGludGVyc2VjdGluZyBhdCBhbGwgb24gdGhpcyBheGlzLCByZXR1cm4gMC5cclxuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZVkpID49IG1pbkRpc3RhbmNlWSlcclxuICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGFuZCByZXR1cm4gaW50ZXJzZWN0aW9uIGRlcHRoLlxyXG4gICAgcmV0dXJuIGRpc3RhbmNlWSA+IDAgPyBtaW5EaXN0YW5jZVkgLSBkaXN0YW5jZVkgOiAtbWluRGlzdGFuY2VZIC0gZGlzdGFuY2VZO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciB7XHJcbiAgY29uc3RydWN0b3IoY29udGV4dCwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gIH1cclxuICBkcmF3UmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIGNvbG9yKSB7XHJcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAvLyB0aGlzLmhlaWdodCAtIHkgLSBoZWlnaHQgaXMgdG8gaW52ZXJ0IHRoZSB5IGF4aXMsIG1ha2luZyB0aGUgY29vcmRpbmF0ZSBzeXN0ZW0gbGlrZSB0aGF0IG9mIFhOQSBhbmQgb3RoZXIgZW5naW5lcy5cclxuICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCh4LCB0aGlzLmhlaWdodCAtIHkgLSBoZWlnaHQsIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuLi9FbmdpbmUvUmVjdGFuZ2xlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vRW5naW5lL1BvaW50XCI7XHJcbmltcG9ydCBUaWxlIGZyb20gXCIuLi9Xb3JsZC9UaWxlXCI7XHJcbmNvbnN0IFRJTEVTID0gVGlsZS5nZXRUeXBlcygpO1xyXG5jb25zdCBUSUxFX1NJWkUgPSAzMjsgLy8gQXNzdW1pbmcgcGxheWVyIGlzIHNhbWUgc2l6ZSBhcyB0aWxlLCBhbHRob3VnaCBpdCB3aWxsIHdvcmsgd2l0aCBvdGhlciBzaXplcyB0b28uXHJcbmNvbnN0IE1PVkVfU1BFRUQgPSAxOTA7XHJcbmNvbnN0IEtFWV9XID0gODcsXHJcbiAgS0VZX0EgPSA2NSxcclxuICBLRVlfUyA9IDgzLFxyXG4gIEtFWV9EID0gNjgsXHJcbiAgS0VZX1VQID0gMzgsXHJcbiAgS0VZX0xFRlQgPSAzNyxcclxuICBLRVlfRE9XTiA9IDQwLFxyXG4gIEtFWV9SSUdIVCA9IDM5O1xyXG5jb25zdCBGUklDVElPTiA9IDgwO1xyXG5jb25zdCBDb2xsaXNpb25EaXJlY3Rpb24gPSB7XHJcbiAgVkVSVElDQUw6IDEsXHJcbiAgSE9SSVpPTlRBTDogMlxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcclxuICBjb25zdHJ1Y3RvcihsZXZlbCwgY29sb3IsIGluaXRpYWxQb3NpdGlvbikge1xyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IGluaXRpYWxQb3NpdGlvbjtcclxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSB0aGlzLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFBvaW50KDAsIDApO1xyXG4gICAgdGhpcy5wcmV2aW91c1Bvc2l0aW9uID0gbmV3IFBvaW50KDAsIDApO1xyXG4gIH1cclxuICBnZXRCb3VuZGluZ0JveCgpIHtcclxuICAgIC8vIE1vZGlmeSB0aGlzIHRvIGNoYW5nZSB0aGUgcGh5c2ljYWwgc2hhcGUgb2YgdGhlIHBsYXllci5cclxuICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCBUSUxFX1NJWkUsIFRJTEVfU0laRSk7XHJcbiAgfVxyXG4gIHVwZGF0ZShpbnB1dCwgZGVsdGEpIHtcclxuICAgIC8vIFNURVAgMTogR2V0IHRoZSBkaXJlY3Rpb24gbW92aW5nIGJhc2VkIG9uIGtleWJvYXJkIG1vdmVtZW50XHJcbiAgICAvLyAxIGlzIHVwL2xlZnQsIDAgaXMgbm9uZSwgYW5kIC0xIGlzIGRvd24vcmlnaHRcclxuICAgIC8vIFRoaXMgd2lsbCBiZSBrbm93biBhcyB0aGUgYWNjZWxlcmF0aW9uLiBBY2NlbGVyYXRpb24gaXMgdGhlIGxvd2VzdCBsZXZlbCBvZiBpbnB1dCwgc28gaXQgZG9lcyBub3RcclxuICAgIC8vIG5lZWQgdG8gYmUgc3RvcmVkIGJldHdlZW4gZnJhbWVzLlxyXG4gICAgdmFyIGFjY2VsZXJhdGlvbiA9IG5ldyBQb2ludCgwLCAwKTtcclxuXHJcbiAgICAvLyBIYW5kbGUgV0FTRCBvciBhcnJvdyBrZXkgbW92ZW1lbnRcclxuICAgIGlmICh0aGlzLnVzZVdBU0QpIHtcclxuICAgICAgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfRCkgJiYgaW5wdXQuaXNLZXlVcChLRVlfQSkpIGFjY2VsZXJhdGlvbi54ID0gMTtcclxuICAgICAgZWxzZSBpZiAoaW5wdXQuaXNLZXlEb3duKEtFWV9BKSAmJiBpbnB1dC5pc0tleVVwKEtFWV9EKSkgYWNjZWxlcmF0aW9uLnggPSAtMTtcclxuICAgICAgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfVykgJiYgaW5wdXQuaXNLZXlVcChLRVlfUykpIGFjY2VsZXJhdGlvbi55ID0gMTtcclxuICAgICAgZWxzZSBpZiAoaW5wdXQuaXNLZXlEb3duKEtFWV9TKSAmJiBpbnB1dC5pc0tleVVwKEtFWV9XKSkgYWNjZWxlcmF0aW9uLnkgPSAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpbnB1dC5pc0tleURvd24oS0VZX1JJR0hUKSAmJiBpbnB1dC5pc0tleVVwKEtFWV9MRUZUKSkgYWNjZWxlcmF0aW9uLnggPSAxO1xyXG4gICAgICBlbHNlIGlmIChpbnB1dC5pc0tleURvd24oS0VZX0xFRlQpICYmIGlucHV0LmlzS2V5VXAoS0VZX1JJR0hUKSkgYWNjZWxlcmF0aW9uLnggPSAtMTtcclxuICAgICAgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfVVApICYmIGlucHV0LmlzS2V5VXAoS0VZX0RPV04pKSBhY2NlbGVyYXRpb24ueSA9IDE7XHJcbiAgICAgIGVsc2UgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfRE9XTikgJiYgaW5wdXQuaXNLZXlVcChLRVlfVVApKSBhY2NlbGVyYXRpb24ueSA9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNURVAgMjogQWRkIHRoZSBhY2NlbGVyYXRpb24gdG8gdGhlIHZlbG9jaXR5LCB0YWtpbmcgaW50byBhY2NvdW50IGZvciBkZWx0YSB0aW1lLlxyXG4gICAgLy8gRGVsdGEgdGltZSB3aWxsIGRpZmZlciBkZXBlbmRpbmcgb24gdGhlIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZC4gQnkgbXVsdGlwbHlpbmcgYnkgaXQsXHJcbiAgICAvLyBpdCBtYWtlcyB0aGUgbW92ZW1lbnQgdGhlIHNhbWUgc3BlZWQgcmVnYXJkbGVzcyBvZiB0aGUgc3lzdGVtJ3MgcGVyZm9ybWFuY2UuXHJcbiAgICB0aGlzLnZlbG9jaXR5LnggKz0gYWNjZWxlcmF0aW9uLnggKiBNT1ZFX1NQRUVEICogZGVsdGE7XHJcbiAgICB0aGlzLnZlbG9jaXR5LnkgKz0gYWNjZWxlcmF0aW9uLnkgKiBNT1ZFX1NQRUVEICogZGVsdGE7XHJcblxyXG4gICAgLy8gU1RFUCAzOiBBZGQgZnJpY3Rpb24gKGZyb20gc2xpZGluZyBvbiB0aGUgXCJiYWNrZ3JvdW5kXCIpLCBvciBlbHNlIHRoZSB2ZWxvY2l0eSB3aWxsIG5ldmVyIHNsb3cgZG93biB3aGVuIHRoZSBrZXlzIGlzIHJlbGVhc2VkLlxyXG4gICAgLy8gSGlnaGVyIGZyaWN0aW9uIHdpbGwgYWxzbyBzbG93IGRvd24gdGhlIG1vdmVtZW50LCBzbyBhanVzdCB0aGUgTU9WRV9TUEVFRCBhY2NvcmRpbmdseS5cclxuICAgIC8vIEZyaWN0aW9uIGNvdWxkIGFsc28gYmUgaGFuZGxlZCBmb3Igc29saWQgYmxvY2tzIGluIGhhbmRsZUNvbGxpc2lvbnMgdG8gZ2l2ZSBtb3JlIGZyaWN0aW9uIHRvIHNvbGlkIGJsb2Nrc1xyXG4gICAgdGhpcy52ZWxvY2l0eS54IC89IEZSSUNUSU9OICogZGVsdGE7XHJcbiAgICB0aGlzLnZlbG9jaXR5LnkgLz0gRlJJQ1RJT04gKiBkZWx0YTtcclxuXHJcbiAgICAvLyBTVEVQIDQ6IEhhbmRsZSBjb2xsaXNpb24uXHJcblxyXG4gICAgLy8gQ29sbGlzaW9ucyBhcmUgcmVzb2x2ZWQgb24gZWFjaCBheGlzIGluZGVwZW5kZW50bHkuXHJcbiAgICAvLyBUaGUgdmVsb2NpdHkgaXMgdGhlbiBhZGRlZCB0byB0aGUgcG9zaXRpb24sIHdoaWNoIG1ha2VzIHRoZSBwb3NpdGlvbiBpbmNyZWFzZSBhcyB0aGUgdmVsb2NpdHkgaXMgPiAwLCBhbmQgZGVjcmVhc2VzIHdoZW4gaXQgaXMgPCAwLlxyXG4gICAgLy8gQnkgdXNpbmcgYWNjZWxlcmF0aW9uLCB2ZWxvY2l0eSwgYW5kIHBvc2l0aW9uLCB3ZSBjYW4gZ2V0IGEgc21vb3RoIG1vdmVtZW50IHRoYXQgdGFrZXMgdGltZSB0byBzcGVlZCB1cCBhbmQgc2xvdyBkb3duLlxyXG4gICAgdGhpcy5wb3NpdGlvbi54ID0gdGhpcy5wb3NpdGlvbi54ICsgdGhpcy52ZWxvY2l0eS54O1xyXG4gICAgLy8gTm93IHRoYXQgdGhlIHBsYXllcidzIHBvc2l0aW9uIGhhcyBiZWVuIHVwZGF0ZWQgYmFzZWQgb24gdGhlIGFjY2VsZXJhdGlvbiBhbmQgdmVsb2NpdHksIGl0IG1heSBiZSBpbnRlcnNlY3RpbmcgYSBibG9jayBvciBwbGF5ZXIgYW5kIG11c3QgYmUgcmVzb2x2ZWQuXHJcbiAgICAvLyBSZWNvcmQgdGhlIHBvc2l0aW9uIGJlZm9yZSBoYW5kbGluZyBjb2xsaXNpb24uXHJcbiAgICB2YXIgbGFzdFggPSB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICAvLyBPbmx5IGhhbmRsZSBjb2xsaXNpb24gaWYgcG9zaXRpb24gaGFzIGNoYW5nZWQuXHJcbiAgICBpZiAodGhpcy5wb3NpdGlvbi54ICE9PSB0aGlzLnByZXZpb3VzUG9zaXRpb24ueClcclxuICAgICAgdGhpcy5oYW5kbGVDb2xsaXNpb25zKENvbGxpc2lvbkRpcmVjdGlvbi5IT1JJWk9OVEFMKTtcclxuXHJcbiAgICAvLyBEbyB0aGUgc2FtZSBmb3IgdGhlIFktQXhpc1xyXG4gICAgdGhpcy5wb3NpdGlvbi55ID0gdGhpcy5wb3NpdGlvbi55ICsgdGhpcy52ZWxvY2l0eS55O1xyXG4gICAgdmFyIGxhc3RZID0gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueSAhPT0gdGhpcy5wcmV2aW91c1Bvc2l0aW9uLnkpXHJcbiAgICAgIHRoaXMuaGFuZGxlQ29sbGlzaW9ucyhDb2xsaXNpb25EaXJlY3Rpb24uVkVSVElDQUwpO1xyXG5cclxuICAgIC8vIFNURVAgNTogSWYgdGhlIHBvc2l0aW9uIGFmdGVyIGhhbmRsaW5nIGNvbGxpc2lvbiBpcyBkaWZmZXJlbnQsIHRoYXQgbWVhbnMgY29sbGlzaW9uIHdhcyBoYW5kbGVkIGFuZCB0aGVcclxuICAgIC8vIHZlbG9jaXR5IHNob3VsZCBiZSBzZXQgdG8gMCB0byBmdWxseSBjb21lIHRvIGEgc3RvcC5cclxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnggIT09IGxhc3RYKSB7XHJcbiAgICAgIHRoaXMudmVsb2NpdHkueCA9IDA7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5wb3NpdGlvbi55ICE9PSBsYXN0WSkge1xyXG4gICAgICB0aGlzLnZlbG9jaXR5LnkgPSAwO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wcmV2aW91c1Bvc2l0aW9uID0gbmV3IFBvaW50KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICB9XHJcbiAgZHJhdyhyZW5kZXJlciwgZGVsdGEpIHtcclxuICAgIC8vIERyYXcgYSByZWN0YW5nbGUgZm9yIHRoZSBwbGF5ZXIuXHJcbiAgICByZW5kZXJlci5kcmF3UmVjdGFuZ2xlKE1hdGgucm91bmQodGhpcy5wb3NpdGlvbi54KSwgTWF0aC5yb3VuZCh0aGlzLnBvc2l0aW9uLnkpLCB0aGlzLmJvdW5kaW5nQm94LndpZHRoLCB0aGlzLmJvdW5kaW5nQm94LmhlaWdodCwgdGhpcy5jb2xvcik7XHJcbiAgfVxyXG4gIGhhbmRsZUNvbGxpc2lvbnMoZGlyZWN0aW9uKSB7XHJcbiAgICAvLyBVcGRhdGUgdGhlIHBsYXllciBib3VuZHMuXHJcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gdGhpcy5nZXRCb3VuZGluZ0JveCgpO1xyXG5cclxuICAgIC8vIFNURVAgMTogSGFuZGxlIFRpbGUgQ29sbGlzaW9uXHJcbiAgICAvLyBGaW5kIHRoZSB0aWxlcyBzdXJyb3VuZCB0aGUgcGxheWVyLlxyXG4gICAgLy8gT25seSB0aGVzZSB3aWxsIGJlIHRlc3RlZCBmb3IgY29sbGlzaW9uLlxyXG4gICAgdmFyIGxlZnRUaWxlID0gTWF0aC5mbG9vcih0aGlzLmJvdW5kaW5nQm94LnggLyBUSUxFX1NJWkUpO1xyXG4gICAgdmFyIHJpZ2h0VGlsZSA9IE1hdGguY2VpbCh0aGlzLmJvdW5kaW5nQm94LnJpZ2h0IC8gVElMRV9TSVpFKSAtIDE7XHJcbiAgICB2YXIgdG9wVGlsZSA9IE1hdGguZmxvb3IodGhpcy5ib3VuZGluZ0JveC55IC8gVElMRV9TSVpFKTtcclxuICAgIHZhciBib3R0b21UaWxlID0gTWF0aC5jZWlsKHRoaXMuYm91bmRpbmdCb3guYm90dG9tIC8gVElMRV9TSVpFKSAtIDE7XHJcblxyXG4gICAgZm9yICh2YXIgeSA9IHRvcFRpbGU7IHkgPD0gYm90dG9tVGlsZTsgKyt5KSB7XHJcbiAgICAgIGZvciAodmFyIHggPSBsZWZ0VGlsZTsgeCA8PSByaWdodFRpbGU7ICsreCkge1xyXG4gICAgICAgIHZhciB0aWxlID0gdGhpcy5sZXZlbC50aWxlc1t4XVt5XTtcclxuXHJcbiAgICAgICAgaWYgKHRpbGUudHlwZSA9PT0gVElMRVMuU09MSUQpIHtcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgdGlsZSwgd2hpY2ggd2lsbCBiZSB0ZXN0ZWQgZm9yIGludGVyc2VjdGlvbiB3aXRoIHRoZSBwbGF5ZXIncyBib3VuZHMuXHJcbiAgICAgICAgICAvLyBUaGUgYm91bmRpbmcgYm94IGRvZXMgbm90IGhhdmUgdG8gYmUgc3RhdGlvbmFyeSwgaXQgd291bGQgcmVwcmVzZW50IGEgbW92aW5nIHRpbGUgYW5kIGl0IHdvdWxkIHN0aWxsIHdvcmsuXHJcbiAgICAgICAgICB2YXIgdGlsZUJvdW5kcyA9IHRpbGUuZ2V0Qm91bmRpbmdCb3goeCwgeSk7XHJcblxyXG4gICAgICAgICAgLy8gRmluZCBob3cgZmFyIHRoZSB0aWxlIGludGVyc2VjdHMgdGhlIHBsYXllciAoaWYgYXQgYWxsKVxyXG4gICAgICAgICAgbGV0IGRlcHRoID0gdGhpcy5pbnRlcnNlY3RzKHRpbGVCb3VuZHMsIGRpcmVjdGlvbik7XHJcblxyXG4gICAgICAgICAgdGhpcy5hcHBseURlcHRoKGRpcmVjdGlvbiwgZGVwdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNURVAgMjogSGFuZGxlIFBsYXllciBDb2xsaXNpb25cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZXZlbC5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxldmVsLnBsYXllcnNbaV0gPT09IHRoaXMpIGNvbnRpbnVlOyAvLyBEb24ndCBjb2xsaWRlIHdpdGggb3Vyc2VsdmVzIVxyXG4gICAgICB2YXIgcGxheWVyQm91bmRzID0gdGhpcy5sZXZlbC5wbGF5ZXJzW2ldLmdldEJvdW5kaW5nQm94KCk7IC8vIEdldCBib3VuZHMgb2YgdGhlIG90aGVyIHBsYXllci5cclxuICAgICAgdmFyIGRlcHRoID0gdGhpcy5pbnRlcnNlY3RzKHBsYXllckJvdW5kcywgZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgIHRoaXMuYXBwbHlEZXB0aChkaXJlY3Rpb24sIGRlcHRoKTtcclxuICAgIH1cclxuICB9XHJcbiAgYXBwbHlEZXB0aChkaXJlY3Rpb24sIGRlcHRoKSB7XHJcbiAgICAvLyBJZiB0aGUgZGVwdGggaXMgbm90IHplcm8sIHRoZSBwbGF5ZXIgYW5kIHRpbGUgYXJlIGNvbGxpZGluZyBvbiB0aGlzIGF4aXNcclxuICAgIGlmIChkZXB0aCAhPT0gMCkge1xyXG4gICAgICBpZiAoZGlyZWN0aW9uID09IENvbGxpc2lvbkRpcmVjdGlvbi5IT1JJWk9OVEFMKVxyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSBkZXB0aDtcclxuICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uID09IENvbGxpc2lvbkRpcmVjdGlvbi5WRVJUSUNBTClcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gZGVwdGg7XHJcbiAgICAgIHRoaXMuYm91bmRpbmdCb3ggPSB0aGlzLmdldEJvdW5kaW5nQm94KCk7IC8vIFVwZGF0ZSB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBwbGF5ZXJcclxuICAgIH1cclxuICB9XHJcbiAgaW50ZXJzZWN0cyhib3gsIGRpcmVjdGlvbikge1xyXG4gICAgLy8gUmV0dXJuIHRoZSBpbnRlcnNlY3Rpb24gZGVwdGggYmV0d2VlbiB0aGUgcGxheWVyIGFuZCB0aGUgb2JqZWN0J3MgYm91bmRpbmcgYm94LlxyXG4gICAgLy8gSW4gb3JkZXIgdG8gZG8gY29sbGlzaW9uLCB3ZSB3aWxsIHJ1biB0aGlzIG1ldGhvZCBmb3IgdGhlIGJsb2NrcyBhcm91bmQgdGhlIHBsYXllciwgYW5kIGFueSBvdGhlciBwbGF5ZXJzLlxyXG4gICAgcmV0dXJuIGRpcmVjdGlvbiA9PSBDb2xsaXNpb25EaXJlY3Rpb24uVkVSVElDQUwgPyB0aGlzLmJvdW5kaW5nQm94LmdldFZlcnRpY2FsSW50ZXJzZWN0aW9uRGVwdGgoYm94KSA6IHRoaXMuYm91bmRpbmdCb3guZ2V0SG9yaXpvbnRhbEludGVyc2VjdGlvbkRlcHRoKGJveCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBUaWxlIGZyb20gXCIuL1RpbGVcIjtcclxuaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vRW50aXRpZXMvUGxheWVyLmpzXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vRW5naW5lL1BvaW50LmpzXCI7XHJcbmNvbnN0IFRJTEVTID0gVGlsZS5nZXRUeXBlcygpO1xyXG5jb25zdCBUSUxFX1NJWkUgPSAzMjtcclxuY29uc3QgU09MSURfQ09MT1IgPSAnI2I0YjRiNCc7XHJcbmNvbnN0IExFRlRfTU9VU0UgPSAwLFxyXG4gIFJJR0hUX01PVVNFID0gMjtcclxuY29uc3QgQ29sbGlzaW9uRGlyZWN0aW9uID0ge1xyXG4gIFZFUlRJQ0FMOiAxLFxyXG4gIEhPUklaT05UQUw6IDJcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExldmVsIHtcclxuICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIHRoaXMudGlsZXMgPSBbXTtcclxuICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIHRoZSBsZXZlbCB0aWxlcy5cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XHJcbiAgICAgIHRoaXMudGlsZXNbeF0gPSBbXTtcclxuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIGJvcmRlciBhcm91bmQgbGV2ZWxcclxuICAgICAgICBpZiAoeCA9PT0gMCB8fCB5ID09PSAwIHx8IHggPT09IHRoaXMud2lkdGggLSAxIHx8IHkgPT09IHRoaXMuaGVpZ2h0IC0gMSlcclxuICAgICAgICAgIHRoaXMudGlsZXNbeF1beV0gPSBuZXcgVGlsZShUSUxFUy5TT0xJRCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdGhpcy50aWxlc1t4XVt5XSA9IG5ldyBUaWxlKFRJTEVTLkVNUFRZKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBwbGF5ZXJzXHJcbiAgICB2YXIgbWUgPSBuZXcgUGxheWVyKHRoaXMsICdyZWQnLCBuZXcgUG9pbnQoVElMRV9TSVpFICogNiwgVElMRV9TSVpFICogNikpO1xyXG4gICAgbWUudXNlV0FTRCA9IHRydWU7IC8vIENvbnRyb2wgdGhpcyBwbGF5ZXIgd2l0aCBXQVNEIGFuZCB0aGUgb3RoZXIgd2l0aCB0aGUgYXJyb3cga2V5c1xyXG4gICAgdGhpcy5wbGF5ZXJzLnB1c2gobWUpO1xyXG4gICAgdGhpcy5wbGF5ZXJzLnB1c2gobmV3IFBsYXllcih0aGlzLCAnZ3JlZW4nLCBuZXcgUG9pbnQoVElMRV9TSVpFICogMiwgVElMRV9TSVpFICogMikpKTtcclxuICB9XHJcbiAgbW91c2VUb1dvcmxkKHBvc2l0aW9uKSB7XHJcbiAgICAvLyBDb252ZXJ0IG1vdXNlIGNvb3JkaW5hdGVzIHRvIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAgcmV0dXJuIG5ldyBQb2ludChNYXRoLm1pbihNYXRoLm1heCgwLCBNYXRoLmZsb29yKHBvc2l0aW9uLnggLyBUSUxFX1NJWkUpKSwgdGhpcy53aWR0aCAtIDEpLCBNYXRoLm1pbihNYXRoLm1heCgwLCBNYXRoLmZsb29yKHBvc2l0aW9uLnkgLyBUSUxFX1NJWkUpKSwgdGhpcy5oZWlnaHQgLSAxKSk7XHJcbiAgfVxyXG4gIHVwZGF0ZShpbnB1dCwgZGVsdGEpIHtcclxuICAgIC8vIFVwZGF0ZSBwbGF5ZXJzXHJcbiAgICBmb3IgKHZhciBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgIHBsYXllci51cGRhdGUoaW5wdXQsIGRlbHRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQbGFjZSBibG9ja3NcclxuICAgIGlmIChpbnB1dC5pc01vdXNlRG93bihMRUZUX01PVVNFKSB8fCBpbnB1dC5pc01vdXNlRG93bihSSUdIVF9NT1VTRSkpIHtcclxuICAgICAgdmFyIHdvcmxkUG9zID0gdGhpcy5tb3VzZVRvV29ybGQoaW5wdXQuZ2V0TW91c2VQb3NpdGlvbigpKTtcclxuICAgICAgdmFyIHRpbGUgPSB0aGlzLnRpbGVzW3dvcmxkUG9zLnhdW3dvcmxkUG9zLnldO1xyXG4gICAgICBpZiAodGlsZS50eXBlID09PSBUSUxFUy5FTVBUWSAmJiBpbnB1dC5pc01vdXNlRG93bihMRUZUX01PVVNFKSlcclxuICAgICAgICB0aWxlLnR5cGUgPSBUSUxFUy5TT0xJRDtcclxuICAgICAgZWxzZSBpZiAodGlsZS50eXBlID09PSBUSUxFUy5TT0xJRCAmJiBpbnB1dC5pc01vdXNlRG93bihSSUdIVF9NT1VTRSkpXHJcbiAgICAgICAgdGlsZS50eXBlID0gVElMRVMuRU1QVFk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGRyYXcocmVuZGVyZXIsIGRlbHRhKSB7XHJcbiAgICAvLyBEcmF3IHRpbGVzXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xyXG4gICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICB2YXIgdGlsZSA9IHRoaXMudGlsZXNbeF1beV07XHJcbiAgICAgICAgaWYgKHRpbGUudHlwZSA9PT0gVElMRVMuU09MSUQpIHtcclxuICAgICAgICAgIHJlbmRlcmVyLmRyYXdSZWN0YW5nbGUoeCAqIFRJTEVfU0laRSwgeSAqIFRJTEVfU0laRSwgVElMRV9TSVpFLCBUSUxFX1NJWkUsIFNPTElEX0NPTE9SKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBEcmF3IHBsYXllcnNcclxuICAgIGZvciAodmFyIHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgcGxheWVyLmRyYXcocmVuZGVyZXIsIGRlbHRhKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiY29uc3QgVElMRV9TSVpFID0gMzI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4uL0VuZ2luZS9SZWN0YW5nbGVcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZSB7XHJcbiAgY29uc3RydWN0b3IodHlwZSkge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICB9XHJcbiAgZ2V0Qm91bmRpbmdCb3goeCwgeSkge1xyXG4gICAgLy8gUmV0dXJuIHJlY3RhbmdsZSB0aGF0IGRlZmluZXMgdGhlIHNoYXBlIG9mIHRoZSBwbGF5ZXIuXHJcbiAgICAvLyBJdCBjYW4gYmUgbW9kaWZpZWQgdG8gc3VwcG9ydCBibG9ja3Mgd2l0aCBkaWZmZXJlbnQgc2hhcGVzIChpZSBoYWxmIGJsb2NrcylcclxuICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHggKiBUSUxFX1NJWkUsIHkgKiBUSUxFX1NJWkUsIFRJTEVfU0laRSwgVElMRV9TSVpFKTtcclxuICB9XHJcbiAgc3RhdGljIGdldFR5cGVzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgRU1QVFk6IDEsXHJcbiAgICAgIFNPTElEOiAwLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENvbGxpc2lvbkdhbWUgZnJvbSBcIi4vQ29sbGlzaW9uR2FtZVwiO1xyXG5nbG9iYWwuQ29sbGlzaW9uR2FtZSA9IENvbGxpc2lvbkdhbWU7XHJcbiJdfQ==
