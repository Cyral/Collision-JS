export default class Renderer {
  constructor(context, width, height) {
    this.context = context;
    this.width = width;
    this.height = height;
  }
  drawRectangle(x, y, width, height, color) {
    this.context.fillStyle = color;
    // this.height - y - height is to invert the y axis, making the coordinate system like that of XNA and other engines.
    this.context.fillRect(x, this.height - y - height, width, height);
  }
}
