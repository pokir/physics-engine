import { Vector } from '../math/vector.js';

export class Transform {
  position: Vector;

  rotation: Vector;

  scaling: Vector;

  constructor(position: Vector = new Vector(0, 0, 0), rotation: Vector = new Vector(1, 0, 0, 0), scaling: Vector = new Vector(0, 0, 0)) {
    this.position = position;
    this.rotation = rotation;
    this.scaling = scaling;
  }

  translate(translation: Vector) {
    this.position = this.position.add(translation);
  }

  rotate(angle: number, axis: Vector) {
    const newRotation = new Vector(Math.cos(angle), ...axis.multiply(Math.sin(angle)).getValues());
    this.rotation = this.rotation.hamilton(newRotation);
  }

  scale(scaling: Vector) {
    // TODO
  }
}
