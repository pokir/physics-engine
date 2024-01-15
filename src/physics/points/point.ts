import { Vector } from '../../math/vector.js';

export class Point {
  position: Vector;

  velocity: Vector;

  constructor(position: Vector) {
    this.position = position;

    this.velocity = new Vector(0, 0, 0);
  }

  update(dt: number) {
    this.position = this.position.add(this.velocity);
  }
}
