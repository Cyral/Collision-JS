const TILE_SIZE = 32;
import Rectangle from "../Engine/Rectangle";
export default class Tile {
  constructor(type) {
    this.type = type;
  }
  getBoundingBox(x, y) {
    // Return rectangle that defines the shape of the player.
    // It can be modified to support blocks with different shapes (ie half blocks)
    return new Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  static getTypes() {
    return {
      EMPTY: 1,
      SOLID: 0,
    };
  }
}
