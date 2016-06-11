import Point from "./Point";
export default class InputHandler {
  constructor(container, width, height) {
    this.width = width;
    this.height = height;
    this.container = container;
    // Hook up events
    this._keystate = {};
    
    this.container.onkeydown = e => {
      this._keystate[e.keyCode ? e.keyCode : e.charCode] = true;
    };
    this.container.onkeyup = e => {
      this._keystate[e.keyCode ? e.keyCode : e.charCode] = false;
    };

    this._mousestate = {};
    this._mousepos = new Point(0, 0);
    this.container.onmousedown = e => {
      this._mousestate[e.button] = true;
      this._mousepos = new Point(e.offsetX, this.height - e.offsetY);
    };
    this.container.onmouseup = e => {
      this._mousestate[e.button] = false;
      this._mousepos = new Point(e.offsetX, this.height - e.offsetY);
    };
    this.container.oncontextmenu = e => {
      e.preventDefault();
    };
    this.container.onmousemove = e => {
      this._mousepos = new Point(e.offsetX, this.height - e.offsetY);
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
