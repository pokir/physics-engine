import { Quaternion } from '../math/quaternion.js';
import { Vector } from '../math/vector.js';

export class Transform {
  position: Vector;

  rotation: Quaternion;

  scaling: Vector;

  constructor(
    position: Vector = new Vector(0, 0, 0),
    rotation: Quaternion = new Quaternion(1, 0, 0, 0),
    scaling: Vector = new Vector(1, 1, 1),
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
      ...axis.normalize().multiply(Math.sin(angle / 2)).getValues(),
    );
    this.rotation = newRotation.hamilton(this.rotation);
  }

  scale(scaling: Vector) {
    this.scaling = new Vector(
      this.scaling.get(0) * scaling.get(0),
      this.scaling.get(1) * scaling.get(1),
      this.scaling.get(2) * scaling.get(2),
    );
  }

  scaleUniformly(factor: number) {
    this.scale(new Vector(1, 1, 1).multiply(factor));
  }

  applyTransform(vector: Vector) {
    return new Vector(
      vector.get(0) * this.scaling.get(0),
      vector.get(1) * this.scaling.get(1),
      vector.get(2) * this.scaling.get(2),
    ).applyQuaternionRotation(this.rotation)
      .add(this.position);
  }
}
