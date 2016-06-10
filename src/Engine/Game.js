// A simple game "engine" to abstract away drawing and canvas stuff
import Renderer from "./Renderer";
import InputHandler from "./InputHandler";
export default class Game {
  constructor(stage, width, height) {
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
    this.renderer = new Renderer(this.context, width, height);

    // Hook up input events
    this.input = new InputHandler(this.canvas, width, height);

    // Setup animation loop
    var requestAnimationFrame = (function() {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    var _self = this;
    var lastFrame = Date.now();

    function animloop() {
      requestAnimationFrame(animloop);

      var now = Date.now();
      var delta = (now - lastFrame) / 1000;

      _self.context.fillStyle = "#FFF";
      _self.context.fillRect(0, 0, _self.width, _self.width);

      if (_self.update)
        _self.update(_self.input, delta);
      if (_self.draw)
        _self.draw(_self.renderer, delta);
      lastFrame = now;
    }
    animloop();
  }
}
