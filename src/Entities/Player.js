import Rectangle from "../Engine/Rectangle";
import Point from "../Engine/Point";
import Tile from "../World/Tile";
const TILES = Tile.getTypes();
const TILE_SIZE = 32; // Assuming player is same size as tile, although it will work with other sizes too.
const MOVE_SPEED = 190;
const KEY_W = 87,
  KEY_A = 65,
  KEY_S = 83,
  KEY_D = 68,
  KEY_UP = 38,
  KEY_LEFT = 37,
  KEY_DOWN = 40,
  KEY_RIGHT = 39;
const FRICTION = 80;
const CollisionDirection = {
  VERTICAL: 1,
  HORIZONTAL: 2
};

export default class Player {
  constructor(level, color, initialPosition) {
    this.level = level;
    this.color = color;
    this.position = initialPosition;
    this.boundingBox = this.getBoundingBox();
    this.velocity = new Point(0, 0);
    this.previousPosition = new Point(0, 0);
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

    // Handle WASD or arrow key movement
    if (this.useWASD) {
      if (input.isKeyDown(KEY_D) && input.isKeyUp(KEY_A)) acceleration.x = 1;
      else if (input.isKeyDown(KEY_A) && input.isKeyUp(KEY_D)) acceleration.x = -1;
      if (input.isKeyDown(KEY_W) && input.isKeyUp(KEY_S)) acceleration.y = 1;
      else if (input.isKeyDown(KEY_S) && input.isKeyUp(KEY_W)) acceleration.y = -1;
    } else {
      if (input.isKeyDown(KEY_RIGHT) && input.isKeyUp(KEY_LEFT)) acceleration.x = 1;
      else if (input.isKeyDown(KEY_LEFT) && input.isKeyUp(KEY_RIGHT)) acceleration.x = -1;
      if (input.isKeyDown(KEY_UP) && input.isKeyUp(KEY_DOWN)) acceleration.y = 1;
      else if (input.isKeyDown(KEY_DOWN) && input.isKeyUp(KEY_UP)) acceleration.y = -1;
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
    if (this.position.x !== this.previousPosition.x)
      this.handleCollisions(CollisionDirection.HORIZONTAL);

    // Do the same for the Y-Axis
    this.position.y += this.velocity.y;
    var lastY = this.position.y;
    if (this.position.y !== this.previousPosition.y)
      this.handleCollisions(CollisionDirection.VERTICAL);

    // STEP 5: If the position after handling collision is different, that means collision was handled and the
    // velocity should be set to 0 to fully come to a stop.
    if (this.position.x !== lastX) {
      this.velocity.x = 0;
    }
    if (this.position.y !== lastY) {
      this.velocity.y = 0;
    }
    this.previousPosition = new Point(this.position.x, this.position.y);
  }
  draw(renderer, delta) {
    // Draw a rectangle for the player.
    renderer.drawRectangle(Math.round(this.position.x), Math.round(this.position.y), this.boundingBox.width, this.boundingBox.height, this.color);
  }
  handleCollisions(direction) {
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
          let depth = this.intersects(tileBounds, direction);

          this.applyDepth(direction, depth);
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
  applyDepth(direction, depth) {
    // If the depth is not zero, the player and tile are colliding on this axis
    if (depth !== 0) {
      if (direction == CollisionDirection.HORIZONTAL)
        this.position.x += depth;
      else if (direction == CollisionDirection.VERTICAL)
        this.position.y += depth;
      this.boundingBox = this.getBoundingBox(); // Update the bounding box of the player
    }
  }
  intersects(box, direction) {
    // Return the intersection depth between the player and the object's bounding box.
    // In order to do collision, we will run this method for the blocks around the player, and any other players.
    return direction == CollisionDirection.VERTICAL ? this.boundingBox.getVerticalIntersectionDepth(box) : this.boundingBox.getHorizontalIntersectionDepth(box);
  }
}
