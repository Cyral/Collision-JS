export default class thisngle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return x;
  }
  get top() {
    return y;
  }
  isIntersecting(rect) {
    return !(rect.x >= this.right || rect.right <= this.x || rect.y >= this.bottom || rect.bottom <= this.y);
  }
  getHorizontalIntersectionDepth(rect) {
    // Check if overlapping at all.
    if (!this.isIntersecting(rect)) return 0;

    // Calculate half sizes.
    var halfwidthA = this.width / 2;
    var halfwidthB = rect.width / 2;

    // Calculate centers.
    var centerA = this.x + halfwidthA;
    var centerB = rect.x + halfwidthB;

    // Calculate current and minimum-non-intersecting distances between centers.
    var distanceX = centerA - centerB;
    var minDistanceX = halfwidthA + halfwidthB;

    // If we are not intersecting at all on this axis, return 0.
    if (Math.abs(distanceX) >= minDistanceX)
      return 0;

    // Calculate and return intersection depth.
    return distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
  }
  getVerticalIntersectionDepth(rect) {
    // Check if overlapping at all.
    if (!this.isIntersecting(rect)) return 0;

    // Calculate half sizes.
    var halfheightA = this.height / 2;
    var halfheightB = rect.height / 2;

    // Calculate centers.
    var centerA = this.y + halfheightA;
    var centerB = rect.y + halfheightB;

    // Calculate current and minimum-non-intersecting distances between centers.
    var distanceY = centerA - centerB;
    var minDistanceY = halfheightA + halfheightB;

    // If we are not intersecting at all on this axis, return 0.
    if (Math.abs(distanceY) >= minDistanceY)
      return 0;

    // Calculate and return intersection depth.
    return distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
  }
}
