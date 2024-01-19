import { Vector } from '../math/vector.js';

export class Transform {
  position: Vector;

  scale: number;

  // TODO: rotation

  constructor(position: Vector = new Vector(0, 0, 0), scale: number = 1) {
    this.position = position;
    this.scale = scale;
  }
}
