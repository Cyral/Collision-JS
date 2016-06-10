export default class Tile {
  constructor(type) {
    this.type = type;
  }
  static getTypes() {
    return {
      EMPTY: 1,
      SOLID: 0,
    };
  }
}
