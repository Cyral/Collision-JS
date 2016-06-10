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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rectangle = function Rectangle(x, y, width, height) {
  _classCallCheck(this, Rectangle);

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
};

exports.default = Rectangle;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TILE_SIZE = 32; // Assuming player is same size as tile, although it will work with other sizes too.
var MOVE_SPEED = 200;
var KEY_W = 87,
    KEY_A = 65,
    KEY_S = 83,
    KEY_D = 68;
var FRICTION = 100;

var Player = function () {
  function Player(level, color, initialPosition) {
    _classCallCheck(this, Player);

    this.level = level;
    this.color = color;
    this.position = initialPosition;
    this.velocity = new _Point2.default(0, 0);
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
      if (this.controllable) {
        if (input.isKeyDown(KEY_D) && input.isKeyUp(KEY_A)) acceleration.x = 1;else if (input.isKeyDown(KEY_A) && input.isKeyUp(KEY_D)) acceleration.x = -1;
        if (input.isKeyDown(KEY_W) && input.isKeyUp(KEY_S)) acceleration.y = 1;else if (input.isKeyDown(KEY_S) && input.isKeyUp(KEY_W)) acceleration.y = -1;
      }

      // STEP 2: Add the acceleration to the velocity, taking into account for delta time.
      // Delta time will differ depending on the number of frames per second. By multiplying by it,
      // it makes the movement the same speed regardless of the system's performance.
      this.velocity.x += acceleration.x * MOVE_SPEED * delta;
      this.velocity.y += acceleration.y * MOVE_SPEED * delta;

      // STEP 3: Add friction, or else the velocity will never slow down when the keys is released.
      // Higher friction will also slow down the movement, so ajust the MOVE_SPEED accordingly.
      this.velocity.x /= FRICTION * delta;
      this.velocity.y /= FRICTION * delta;

      // STEP 4: The velocity is then added to the position, which makes the position increase as the velocity is > 0, and decreases when it is < 0.
      // By using acceleration, velocity, and position, we can get a smooth movement that takes time to speed up and slow down.
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }, {
    key: "draw",
    value: function draw(renderer, delta) {
      renderer.drawRectangle(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE, this.color);
    }
  }]);

  return Player;
}();

exports.default = Player;

},{"../Engine/Point":4,"../Engine/Rectangle":5}],8:[function(require,module,exports){
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
    me.controllable = true; // Control this player with the keyboard
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

      // Draw playrs
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tile = function () {
  function Tile(type) {
    _classCallCheck(this, Tile);

    this.type = type;
  }

  _createClass(Tile, null, [{
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

},{}],10:[function(require,module,exports){
(function (global){
"use strict";

var _CollisionGame = require("./CollisionGame");

var _CollisionGame2 = _interopRequireDefault(_CollisionGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.CollisionGame = _CollisionGame2.default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./CollisionGame":1}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXENvbGxpc2lvbkdhbWUuanMiLCJzcmNcXEVuZ2luZVxcR2FtZS5qcyIsInNyY1xcRW5naW5lXFxJbnB1dEhhbmRsZXIuanMiLCJzcmNcXEVuZ2luZVxcUG9pbnQuanMiLCJzcmNcXEVuZ2luZVxcUmVjdGFuZ2xlLmpzIiwic3JjXFxFbmdpbmVcXFJlbmRlcmVyLmpzIiwic3JjXFxFbnRpdGllc1xcUGxheWVyLmpzIiwic3JjXFxXb3JsZFxcTGV2ZWwuanMiLCJzcmNcXFdvcmxkXFxUaWxlLmpzIiwic3JjXFxzcmNcXGluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRXFCLGE7OztBQUNuQix5QkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE1BQTFCLEVBQWtDO0FBQUE7O0FBQUEsaUdBQzFCLEtBRDBCLEVBQ25CLEtBRG1CLEVBQ1osTUFEWTs7QUFFaEMsVUFBSyxLQUFMLEdBQWEsb0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBUSxTQUFuQixDQUFWLEVBQXlDLEtBQUssS0FBTCxDQUFXLFNBQVMsU0FBcEIsQ0FBekMsQ0FBYjtBQUZnQztBQUdqQzs7OzsyQkFDTSxLLEVBQU8sSyxFQUFPO0FBQ25CLFVBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFDRSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQWxCLEVBQXlCLEtBQXpCO0FBQ0g7Ozt5QkFDSSxRLEVBQVUsSyxFQUFPO0FBQ3BCLFVBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFDRSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFFBQWhCLEVBQTBCLEtBQTFCO0FBQ0g7Ozs7OztrQkFaa0IsYTs7Ozs7Ozs7O0FDSHJCOzs7O0FBQ0E7Ozs7Ozs7OztJQUNxQixJLEdBQ25CLGNBQVksS0FBWixF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aUM7QUFBQSxjQUF4QixNQUF3Qjs7QUFDL0IsaUJBQU8sSUFBUCxDQUFZLFFBQVosRUFBc0IsS0FBdEI7QUFDRDtBQWRtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZXJCOzs7Ozs7a0JBNURrQixLOzs7Ozs7Ozs7Ozs7O0lDVEEsSTtBQUNuQixnQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDRDs7OzsrQkFDaUI7QUFDaEIsYUFBTztBQUNMLGVBQU8sQ0FERjtBQUVMLGVBQU87QUFGRixPQUFQO0FBSUQ7Ozs7OztrQkFUa0IsSTs7Ozs7O0FDQXJCOzs7Ozs7QUFDQSxPQUFPLGFBQVAiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vRW5naW5lL0dhbWVcIjtcclxuaW1wb3J0IExldmVsIGZyb20gXCIuL1dvcmxkL0xldmVsXCI7XHJcbmNvbnN0IFRJTEVfU0laRSA9IDMyO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sbGlzaW9uR2FtZSBleHRlbmRzIEdhbWUge1xyXG4gIGNvbnN0cnVjdG9yKHN0YWdlLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBzdXBlcihzdGFnZSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB0aGlzLmxldmVsID0gbmV3IExldmVsKE1hdGguZmxvb3Iod2lkdGggLyBUSUxFX1NJWkUpLCBNYXRoLmZsb29yKGhlaWdodCAvIFRJTEVfU0laRSkpO1xyXG4gIH1cclxuICB1cGRhdGUoaW5wdXQsIGRlbHRhKSB7XHJcbiAgICBpZiAodGhpcy5sZXZlbCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLmxldmVsLnVwZGF0ZShpbnB1dCwgZGVsdGEpO1xyXG4gIH1cclxuICBkcmF3KHJlbmRlcmVyLCBkZWx0YSkge1xyXG4gICAgaWYgKHRoaXMubGV2ZWwgIT09IHVuZGVmaW5lZClcclxuICAgICAgdGhpcy5sZXZlbC5kcmF3KHJlbmRlcmVyLCBkZWx0YSk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIEEgc2ltcGxlIGdhbWUgXCJlbmdpbmVcIiB0byBhYnN0cmFjdCBhd2F5IGRyYXdpbmcgYW5kIGNhbnZhcyBzdHVmZlxyXG5pbXBvcnQgUmVuZGVyZXIgZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuaW1wb3J0IElucHV0SGFuZGxlciBmcm9tIFwiLi9JbnB1dEhhbmRsZXJcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhZ2UsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vIENyZWF0ZSBjYW52YXNcclxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhZ2UpO1xyXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSk7XHJcbiAgICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTsgLy8gTWFrZSBmb2N1c2FibGUgc28gZXZlbnRzIHdvcmtcclxuICAgIHRoaXMuY2FudmFzLmZvY3VzKCk7XHJcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xyXG4gICAgdGhpcy5jYW52YXMuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHJlbmRlcmVyIHRvIGFic3RyYWN0IGF3YXkgZHJhdyBmdW5jdGlvbnNcclxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodGhpcy5jb250ZXh0LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBIb29rIHVwIGlucHV0IGV2ZW50c1xyXG4gICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dEhhbmRsZXIodGhpcy5jYW52YXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgIC8vIFNldHVwIGFuaW1hdGlvbiBsb29wXHJcbiAgICB2YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIHZhciBfc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgbGFzdEZyYW1lID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltbG9vcCgpIHtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1sb29wKTtcclxuXHJcbiAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgICB2YXIgZGVsdGEgPSAobm93IC0gbGFzdEZyYW1lKSAvIDEwMDA7XHJcblxyXG4gICAgICBfc2VsZi5jb250ZXh0LmZpbGxTdHlsZSA9IFwiI0ZGRlwiO1xyXG4gICAgICBfc2VsZi5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIF9zZWxmLndpZHRoLCBfc2VsZi53aWR0aCk7XHJcblxyXG4gICAgICBpZiAoX3NlbGYudXBkYXRlKVxyXG4gICAgICAgIF9zZWxmLnVwZGF0ZShfc2VsZi5pbnB1dCwgZGVsdGEpO1xyXG4gICAgICBpZiAoX3NlbGYuZHJhdylcclxuICAgICAgICBfc2VsZi5kcmF3KF9zZWxmLnJlbmRlcmVyLCBkZWx0YSk7XHJcbiAgICAgIGxhc3RGcmFtZSA9IG5vdztcclxuICAgIH1cclxuICAgIGFuaW1sb29wKCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dEhhbmRsZXIge1xyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIC8vIEhvb2sgdXAgZXZlbnRzXHJcbiAgICB0aGlzLl9rZXlzdGF0ZSA9IHt9O1xyXG4gICAgdmFyIF9zZWxmID0gdGhpcztcclxuICAgIHRoaXMuY29udGFpbmVyLm9ua2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgX3NlbGYuX2tleXN0YXRlW2Uua2V5Q29kZSA/IGUua2V5Q29kZSA6IGUuY2hhckNvZGVdID0gdHJ1ZTtcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbmtleXVwID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBfc2VsZi5fa2V5c3RhdGVbZS5rZXlDb2RlID8gZS5rZXlDb2RlIDogZS5jaGFyQ29kZV0gPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fbW91c2VzdGF0ZSA9IHt9O1xyXG4gICAgdGhpcy5fbW91c2Vwb3MgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgX3NlbGYuX21vdXNlc3RhdGVbZS5idXR0b25dID0gdHJ1ZTtcclxuICAgICAgX3NlbGYuX21vdXNlcG9zID0gbmV3IFBvaW50KGUub2Zmc2V0WCwgX3NlbGYuaGVpZ2h0IC0gZS5vZmZzZXRZKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNldXAgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIF9zZWxmLl9tb3VzZXN0YXRlW2UuYnV0dG9uXSA9IGZhbHNlO1xyXG4gICAgICBfc2VsZi5fbW91c2Vwb3MgPSBuZXcgUG9pbnQoZS5vZmZzZXRYLCBfc2VsZi5oZWlnaHQgLSBlLm9mZnNldFkpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuY29udGFpbmVyLm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgX3NlbGYuX21vdXNlcG9zID0gbmV3IFBvaW50KGUub2Zmc2V0WCwgX3NlbGYuaGVpZ2h0IC0gZS5vZmZzZXRZKTtcclxuICAgIH07XHJcbiAgfVxyXG4gIGdldE1vdXNlUG9zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW91c2Vwb3M7XHJcbiAgfVxyXG4gIGlzTW91c2VEb3duKGJ1dHRvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vdXNlc3RhdGVbYnV0dG9uXTtcclxuICB9XHJcbiAgaXNNb3VzZVVwKGJ1dHRvbikge1xyXG4gICAgcmV0dXJuICF0aGlzLl9tb3VzZXN0YXRlW2J1dHRvbl07XHJcbiAgfVxyXG4gIGlzS2V5RG93bihjaGFyQ29kZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2tleXN0YXRlW2NoYXJDb2RlXTtcclxuICB9XHJcbiAgaXNLZXlVcChjaGFyQ29kZSkge1xyXG4gICAgcmV0dXJuICF0aGlzLl9rZXlzdGF0ZVtjaGFyQ29kZV07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50IHtcclxuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlIHtcclxuICBjb25zdHJ1Y3Rvcih4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciB7XHJcbiAgY29uc3RydWN0b3IoY29udGV4dCwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gIH1cclxuICBkcmF3UmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIGNvbG9yKSB7XHJcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAvLyB0aGlzLmhlaWdodCAtIHkgLSBoZWlnaHQgaXMgdG8gaW52ZXJ0IHRoZSB5IGF4aXMsIG1ha2luZyB0aGUgY29vcmRpbmF0ZSBzeXN0ZW0gbGlrZSB0aGF0IG9mIFhOQSBhbmQgb3RoZXIgZW5naW5lcy5cclxuICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCh4LCB0aGlzLmhlaWdodCAtIHkgLSBoZWlnaHQsIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuLi9FbmdpbmUvUmVjdGFuZ2xlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vRW5naW5lL1BvaW50XCI7XHJcbmNvbnN0IFRJTEVfU0laRSA9IDMyOyAvLyBBc3N1bWluZyBwbGF5ZXIgaXMgc2FtZSBzaXplIGFzIHRpbGUsIGFsdGhvdWdoIGl0IHdpbGwgd29yayB3aXRoIG90aGVyIHNpemVzIHRvby5cclxuY29uc3QgTU9WRV9TUEVFRCA9IDIwMDtcclxuY29uc3QgS0VZX1cgPSA4NyxcclxuICBLRVlfQSA9IDY1LFxyXG4gIEtFWV9TID0gODMsXHJcbiAgS0VZX0QgPSA2ODtcclxuY29uc3QgRlJJQ1RJT04gPSAxMDA7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcclxuICBjb25zdHJ1Y3RvcihsZXZlbCwgY29sb3IsIGluaXRpYWxQb3NpdGlvbikge1xyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IGluaXRpYWxQb3NpdGlvbjtcclxuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgfVxyXG4gIGdldEJvdW5kaW5nQm94KCkge1xyXG4gICAgLy8gTW9kaWZ5IHRoaXMgdG8gY2hhbmdlIHRoZSBwaHlzaWNhbCBzaGFwZSBvZiB0aGUgcGxheWVyLlxyXG4gICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIFRJTEVfU0laRSwgVElMRV9TSVpFKTtcclxuICB9XHJcbiAgdXBkYXRlKGlucHV0LCBkZWx0YSkge1xyXG4gICAgLy8gU1RFUCAxOiBHZXQgdGhlIGRpcmVjdGlvbiBtb3ZpbmcgYmFzZWQgb24ga2V5Ym9hcmQgbW92ZW1lbnRcclxuICAgIC8vIDEgaXMgdXAvbGVmdCwgMCBpcyBub25lLCBhbmQgLTEgaXMgZG93bi9yaWdodFxyXG4gICAgLy8gVGhpcyB3aWxsIGJlIGtub3duIGFzIHRoZSBhY2NlbGVyYXRpb24uIEFjY2VsZXJhdGlvbiBpcyB0aGUgbG93ZXN0IGxldmVsIG9mIGlucHV0LCBzbyBpdCBkb2VzIG5vdFxyXG4gICAgLy8gbmVlZCB0byBiZSBzdG9yZWQgYmV0d2VlbiBmcmFtZXMuXHJcbiAgICB2YXIgYWNjZWxlcmF0aW9uID0gbmV3IFBvaW50KDAsIDApO1xyXG4gICAgaWYgKHRoaXMuY29udHJvbGxhYmxlKSB7XHJcbiAgICAgIGlmIChpbnB1dC5pc0tleURvd24oS0VZX0QpICYmIGlucHV0LmlzS2V5VXAoS0VZX0EpKSBhY2NlbGVyYXRpb24ueCA9IDE7XHJcbiAgICAgIGVsc2UgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfQSkgJiYgaW5wdXQuaXNLZXlVcChLRVlfRCkpIGFjY2VsZXJhdGlvbi54ID0gLTE7XHJcbiAgICAgIGlmIChpbnB1dC5pc0tleURvd24oS0VZX1cpICYmIGlucHV0LmlzS2V5VXAoS0VZX1MpKSBhY2NlbGVyYXRpb24ueSA9IDE7XHJcbiAgICAgIGVsc2UgaWYgKGlucHV0LmlzS2V5RG93bihLRVlfUykgJiYgaW5wdXQuaXNLZXlVcChLRVlfVykpIGFjY2VsZXJhdGlvbi55ID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU1RFUCAyOiBBZGQgdGhlIGFjY2VsZXJhdGlvbiB0byB0aGUgdmVsb2NpdHksIHRha2luZyBpbnRvIGFjY291bnQgZm9yIGRlbHRhIHRpbWUuXHJcbiAgICAvLyBEZWx0YSB0aW1lIHdpbGwgZGlmZmVyIGRlcGVuZGluZyBvbiB0aGUgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kLiBCeSBtdWx0aXBseWluZyBieSBpdCxcclxuICAgIC8vIGl0IG1ha2VzIHRoZSBtb3ZlbWVudCB0aGUgc2FtZSBzcGVlZCByZWdhcmRsZXNzIG9mIHRoZSBzeXN0ZW0ncyBwZXJmb3JtYW5jZS5cclxuICAgIHRoaXMudmVsb2NpdHkueCArPSBhY2NlbGVyYXRpb24ueCAqIE1PVkVfU1BFRUQgKiBkZWx0YTtcclxuICAgIHRoaXMudmVsb2NpdHkueSArPSBhY2NlbGVyYXRpb24ueSAqIE1PVkVfU1BFRUQgKiBkZWx0YTtcclxuXHJcbiAgICAvLyBTVEVQIDM6IEFkZCBmcmljdGlvbiwgb3IgZWxzZSB0aGUgdmVsb2NpdHkgd2lsbCBuZXZlciBzbG93IGRvd24gd2hlbiB0aGUga2V5cyBpcyByZWxlYXNlZC5cclxuICAgIC8vIEhpZ2hlciBmcmljdGlvbiB3aWxsIGFsc28gc2xvdyBkb3duIHRoZSBtb3ZlbWVudCwgc28gYWp1c3QgdGhlIE1PVkVfU1BFRUQgYWNjb3JkaW5nbHkuXHJcbiAgICB0aGlzLnZlbG9jaXR5LnggLz0gRlJJQ1RJT04gKiBkZWx0YTtcclxuICAgIHRoaXMudmVsb2NpdHkueSAvPSBGUklDVElPTiAqIGRlbHRhO1xyXG5cclxuICAgIC8vIFNURVAgNDogVGhlIHZlbG9jaXR5IGlzIHRoZW4gYWRkZWQgdG8gdGhlIHBvc2l0aW9uLCB3aGljaCBtYWtlcyB0aGUgcG9zaXRpb24gaW5jcmVhc2UgYXMgdGhlIHZlbG9jaXR5IGlzID4gMCwgYW5kIGRlY3JlYXNlcyB3aGVuIGl0IGlzIDwgMC5cclxuICAgIC8vIEJ5IHVzaW5nIGFjY2VsZXJhdGlvbiwgdmVsb2NpdHksIGFuZCBwb3NpdGlvbiwgd2UgY2FuIGdldCBhIHNtb290aCBtb3ZlbWVudCB0aGF0IHRha2VzIHRpbWUgdG8gc3BlZWQgdXAgYW5kIHNsb3cgZG93bi5cclxuICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5Lng7XHJcbiAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55O1xyXG4gIH1cclxuICBkcmF3KHJlbmRlcmVyLCBkZWx0YSkge1xyXG4gICAgcmVuZGVyZXIuZHJhd1JlY3RhbmdsZSh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgVElMRV9TSVpFLCBUSUxFX1NJWkUsIHRoaXMuY29sb3IpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgVGlsZSBmcm9tIFwiLi9UaWxlXCI7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL0VudGl0aWVzL1BsYXllci5qc1wiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL0VuZ2luZS9Qb2ludC5qc1wiO1xyXG5jb25zdCBUSUxFUyA9IFRpbGUuZ2V0VHlwZXMoKTtcclxuY29uc3QgVElMRV9TSVpFID0gMzI7XHJcbmNvbnN0IFNPTElEX0NPTE9SID0gJyNiNGI0YjQnO1xyXG5jb25zdCBMRUZUX01PVVNFID0gMCxcclxuICBSSUdIVF9NT1VTRSA9IDI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbCB7XHJcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLnRpbGVzID0gW107XHJcbiAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSB0aGUgbGV2ZWwgdGlsZXMuXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xyXG4gICAgICB0aGlzLnRpbGVzW3hdID0gW107XHJcbiAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xyXG4gICAgICAgIC8vIENyZWF0ZSBib3JkZXIgYXJvdW5kIGxldmVsXHJcbiAgICAgICAgaWYgKHggPT09IDAgfHwgeSA9PT0gMCB8fCB4ID09PSB0aGlzLndpZHRoIC0gMSB8fCB5ID09PSB0aGlzLmhlaWdodCAtIDEpXHJcbiAgICAgICAgICB0aGlzLnRpbGVzW3hdW3ldID0gbmV3IFRpbGUoVElMRVMuU09MSUQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRoaXMudGlsZXNbeF1beV0gPSBuZXcgVGlsZShUSUxFUy5FTVBUWSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgcGxheWVyc1xyXG4gICAgdmFyIG1lID0gbmV3IFBsYXllcih0aGlzLCAncmVkJywgbmV3IFBvaW50KFRJTEVfU0laRSAqIDYsIFRJTEVfU0laRSAqIDYpKTtcclxuICAgIG1lLmNvbnRyb2xsYWJsZSA9IHRydWU7IC8vIENvbnRyb2wgdGhpcyBwbGF5ZXIgd2l0aCB0aGUga2V5Ym9hcmRcclxuICAgIHRoaXMucGxheWVycy5wdXNoKG1lKTtcclxuICAgIHRoaXMucGxheWVycy5wdXNoKG5ldyBQbGF5ZXIodGhpcywgJ2dyZWVuJywgbmV3IFBvaW50KFRJTEVfU0laRSAqIDIsIFRJTEVfU0laRSAqIDIpKSk7XHJcbiAgfVxyXG4gIG1vdXNlVG9Xb3JsZChwb3NpdGlvbikge1xyXG4gICAgLy8gQ29udmVydCBtb3VzZSBjb29yZGluYXRlcyB0byB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgIHJldHVybiBuZXcgUG9pbnQoTWF0aC5taW4oTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihwb3NpdGlvbi54IC8gVElMRV9TSVpFKSksIHRoaXMud2lkdGggLSAxKSwgTWF0aC5taW4oTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihwb3NpdGlvbi55IC8gVElMRV9TSVpFKSksIHRoaXMuaGVpZ2h0IC0gMSkpO1xyXG4gIH1cclxuICB1cGRhdGUoaW5wdXQsIGRlbHRhKSB7XHJcbiAgICAvLyBVcGRhdGUgcGxheWVyc1xyXG4gICAgZm9yICh2YXIgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICBwbGF5ZXIudXBkYXRlKGlucHV0LCBkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGxhY2UgYmxvY2tzXHJcbiAgICBpZiAoaW5wdXQuaXNNb3VzZURvd24oTEVGVF9NT1VTRSkgfHwgaW5wdXQuaXNNb3VzZURvd24oUklHSFRfTU9VU0UpKSB7XHJcbiAgICAgIHZhciB3b3JsZFBvcyA9IHRoaXMubW91c2VUb1dvcmxkKGlucHV0LmdldE1vdXNlUG9zaXRpb24oKSk7XHJcbiAgICAgIHZhciB0aWxlID0gdGhpcy50aWxlc1t3b3JsZFBvcy54XVt3b3JsZFBvcy55XTtcclxuICAgICAgaWYgKHRpbGUudHlwZSA9PT0gVElMRVMuRU1QVFkgJiYgaW5wdXQuaXNNb3VzZURvd24oTEVGVF9NT1VTRSkpXHJcbiAgICAgICAgdGlsZS50eXBlID0gVElMRVMuU09MSUQ7XHJcbiAgICAgIGVsc2UgaWYgKHRpbGUudHlwZSA9PT0gVElMRVMuU09MSUQgJiYgaW5wdXQuaXNNb3VzZURvd24oUklHSFRfTU9VU0UpKVxyXG4gICAgICAgIHRpbGUudHlwZSA9IFRJTEVTLkVNUFRZO1xyXG4gICAgfVxyXG4gIH1cclxuICBkcmF3KHJlbmRlcmVyLCBkZWx0YSkge1xyXG4gICAgLy8gRHJhdyB0aWxlc1xyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcclxuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgdmFyIHRpbGUgPSB0aGlzLnRpbGVzW3hdW3ldO1xyXG4gICAgICAgIGlmICh0aWxlLnR5cGUgPT09IFRJTEVTLlNPTElEKSB7XHJcbiAgICAgICAgICByZW5kZXJlci5kcmF3UmVjdGFuZ2xlKHggKiBUSUxFX1NJWkUsIHkgKiBUSUxFX1NJWkUsIFRJTEVfU0laRSwgVElMRV9TSVpFLCBTT0xJRF9DT0xPUik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRHJhdyBwbGF5cnNcclxuICAgIGZvciAodmFyIHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgcGxheWVyLmRyYXcocmVuZGVyZXIsIGRlbHRhKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZSB7XHJcbiAgY29uc3RydWN0b3IodHlwZSkge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICB9XHJcbiAgc3RhdGljIGdldFR5cGVzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgRU1QVFk6IDEsXHJcbiAgICAgIFNPTElEOiAwLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENvbGxpc2lvbkdhbWUgZnJvbSBcIi4vQ29sbGlzaW9uR2FtZVwiO1xyXG5nbG9iYWwuQ29sbGlzaW9uR2FtZSA9IENvbGxpc2lvbkdhbWU7XHJcbiJdfQ==
