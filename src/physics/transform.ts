import { Quaternion } from '../math/quaternion.js';
import { Vector } from '../math/vector.js';

export class Transform {
  position: Vector;

  rotation: Quaternion;

  scaling: Vector;

  constructor(
    position: Vector = new Vector(0, 0, 0),
    rotation: Quaternion = new Quaternion(1, 0, 0, 0),
    scaling: Vector = new Vector(0, 0, 0),
  ) {
    this.position = position;
    this.rotation = rotation;
    this.scaling = scaling;
  }

  translate(translation: Vector) {
    this.position = this.position.add(translation);
  }

  rotate(angle: number, axis: Vector) {
    const newRotation = new Quaternion(
      Math.cos(angle / 2),
      ...axis.multiply(Math.sin(angle / 2)).getValues(),
    );
    this.rotation = newRotation.hamilton(this.rotation);
  }

  scale(scaling: Vector) {
    // TODO
  }
}
