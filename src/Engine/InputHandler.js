import Point from "./Point";
export default class InputHandler {
  constructor(container, width, height) {
    this.width = width;
    this.height = height;
    this.container = container;
    // Hook up events
    this._keystate = {};
    var _self = this;
    this.container.onkeydown = function(e) {
      _self._keystate[e.keyCode ? e.keyCode : e.charCode] = true;
    };
    this.container.onkeyup = function(e) {
      _self._keystate[e.keyCode ? e.keyCode : e.charCode] = false;
    };

    this._mousestate = {};
    this._mousepos = new Point(0, 0);
    this.container.onmousedown = function(e) {
      _self._mousestate[e.button] = true;
      _self._mousepos = new Point(e.offsetX, _self.height - e.offsetY);
    };
    this.container.onmouseup = function(e) {
      _self._mousestate[e.button] = false;
      _self._mousepos = new Point(e.offsetX, _self.height - e.offsetY);
    };
    this.container.oncontextmenu = function(e) {
      e.preventDefault();
    };
    this.container.onmousemove = function(e) {
      _self._mousepos = new Point(e.offsetX, _self.height - e.offsetY);
    };
  }
  getMousePosition() {
    return this._mousepos;
  }
  isMouseDown(button) {
    return this._mousestate[button];
  }
  isMouseUp(button) {
    return !this._mousestate[button];
  }
  isKeyDown(charCode) {
    return this._keystate[charCode];
  }
  isKeyUp(charCode) {
    return !this._keystate[charCode];
  }
}
