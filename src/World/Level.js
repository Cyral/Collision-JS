import Tile from "./Tile";
import Player from "../Entities/Player.js";
import Point from "../Engine/Point.js";
const TILES = Tile.getTypes();
const TILE_SIZE = 32;
const SOLID_COLOR = '#b4b4b4';
const LEFT_MOUSE = 0,
  RIGHT_MOUSE = 2;
const CollisionDirection = {
  VERTICAL: 1,
  HORIZONTAL: 2
};

export default class Level {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.players = [];

    // Generate the level tiles.
    for (var x = 0; x < this.width; x++) {
      this.tiles[x] = [];
      for (var y = 0; y < this.height; y++) {
        // Create border around level
        if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1)
          this.tiles[x][y] = new Tile(TILES.SOLID);
        else
          this.tiles[x][y] = new Tile(TILES.EMPTY);
      }
    }

    // Add players
    var me = new Player(this, 'red', new Point(TILE_SIZE * 6, TILE_SIZE * 6));
    me.useWASD = true; // Control this player with WASD and the other with the arrow keys
    this.players.push(me);
    this.players.push(new Player(this, 'green', new Point(TILE_SIZE * 2, TILE_SIZE * 2)));
  }
  mouseToWorld(position) {
    // Convert mouse coordinates to world coordinates.
    return new Point(Math.min(Math.max(0, Math.floor(position.x / TILE_SIZE)), this.width - 1), Math.min(Math.max(0, Math.floor(position.y / TILE_SIZE)), this.height - 1));
  }
  update(input, delta) {
    // Update players
    for (var player of this.players) {
      player.update(input, delta);
    }

    // Place blocks
    if (input.isMouseDown(LEFT_MOUSE) || input.isMouseDown(RIGHT_MOUSE)) {
      var worldPos = this.mouseToWorld(input.getMousePosition());
      var tile = this.tiles[worldPos.x][worldPos.y];
      if (tile.type === TILES.EMPTY && input.isMouseDown(LEFT_MOUSE))
        tile.type = TILES.SOLID;
      else if (tile.type === TILES.SOLID && input.isMouseDown(RIGHT_MOUSE))
        tile.type = TILES.EMPTY;
    }
  }
  draw(renderer, delta) {
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
    for (var player of this.players) {
      player.draw(renderer, delta);
    }
  }
}
