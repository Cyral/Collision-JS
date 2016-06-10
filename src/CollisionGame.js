import Game from "./Engine/Game";
import Level from "./World/Level";
const TILE_SIZE = 32;

export default class CollisionGame extends Game {
  constructor(stage, width, height) {
    super(stage, width, height);
    this.level = new Level(Math.floor(width / TILE_SIZE), Math.floor(height / TILE_SIZE));
  }
  update(input, delta) {
    if (this.level !== undefined)
      this.level.update(input, delta);
  }
  draw(renderer, delta) {
    if (this.level !== undefined)
      this.level.draw(renderer, delta);
  }
}
