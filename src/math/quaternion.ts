import { Vector } from './vector.js';

export class Quaternion extends Vector {
  constructor(...values: number[]) {
    if (values.length !== 4) throw new Error('quaternion has an incorrect number of values');

    super(...values);
  }

  static fromVector(quaternionAsVector: Vector) {
    if (quaternionAsVector.dimensions[0] !== 4) throw new Error('vector cannot be converted to quaternion as the dimensions do not match');

    return new Quaternion(...quaternionAsVector.getValues());
  }

  clone() {
    return Quaternion.fromVector(super.clone());
  }

  // overrride to return a quaternion instead of a vector
  add(quaternion: Quaternion) {
    return Quaternion.fromVector(super.add(quaternion));
  }

  // overrride to return a quaternion instead of a vector
  subtract(quaternion: Quaternion) {
    return Quaternion.fromVector(super.subtract(quaternion));
  }

  // overrride to return a quaternion instead of a vector
  multiply(factor: number) {
    return Quaternion.fromVector(super.multiply(factor));
  }

  // overrride to return a quaternion instead of a vector
  divide(divisor: number) {
    return Quaternion.fromVector(super.divide(divisor));
  }

  // overrride to return a quaternion instead of a vector
  normalize() {
    return Quaternion.fromVector(super.normalize());
  }

  conjugate() {
    return new Quaternion(this.get(0), -this.get(1), -this.get(2), -this.get(3));
  }

  hamilton(quaternion: Quaternion) {
    return new Quaternion(
      this.get(0) * quaternion.get(0) - this.get(1) * quaternion.get(1)
        - this.get(2) * quaternion.get(2) - this.get(3) * quaternion.get(3),
      this.get(0) * quaternion.get(1) + this.get(1) * quaternion.get(0)
        + this.get(2) * quaternion.get(3) - this.get(3) * quaternion.get(2),
      this.get(0) * quaternion.get(2) - this.get(1) * quaternion.get(3)
        + this.get(2) * quaternion.get(0) + this.get(3) * quaternion.get(1),
      this.get(0) * quaternion.get(3) + this.get(1) * quaternion.get(2)
        - this.get(2) * quaternion.get(1) + this.get(3) * quaternion.get(0),
    );
  }
}
