import Rectangle from "../Engine/Rectangle";
import Point from "../Engine/Point";
const TILE_SIZE = 32; // Assuming player is same size as tile, although it will work with other sizes too.
const MOVE_SPEED = 200;
const KEY_W = 87,
  KEY_A = 65,
  KEY_S = 83,
  KEY_D = 68;
const FRICTION = 100;


export default class Player {
  constructor(level, color, initialPosition) {
    this.level = level;
    this.color = color;
    this.position = initialPosition;
    this.velocity = new Point(0, 0);
  }
  getBoundingBox() {
    // Modify this to change the physical shape of the player.
    return new Rectangle(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE);
  }
  update(input, delta) {
    // STEP 1: Get the direction moving based on keyboard movement
    // 1 is up/left, 0 is none, and -1 is down/right
    // This will be known as the acceleration. Acceleration is the lowest level of input, so it does not
    // need to be stored between frames.
    var acceleration = new Point(0, 0);
    if (this.controllable) {
      if (input.isKeyDown(KEY_D) && input.isKeyUp(KEY_A)) acceleration.x = 1;
      else if (input.isKeyDown(KEY_A) && input.isKeyUp(KEY_D)) acceleration.x = -1;
      if (input.isKeyDown(KEY_W) && input.isKeyUp(KEY_S)) acceleration.y = 1;
      else if (input.isKeyDown(KEY_S) && input.isKeyUp(KEY_W)) acceleration.y = -1;
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
  draw(renderer, delta) {
    renderer.drawRectangle(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE, this.color);
  }
}
