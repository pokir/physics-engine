import { Matrix } from './matrix.js';
import { Quaternion } from './quaternion.js';

export class Vector extends Matrix {
  constructor(...values: number[]) {
    super([values.length, 1], values.map((value) => [value]));
  }

  static fromMatrix(vectorAsMatrix: Matrix) {
    if (vectorAsMatrix.dimensions[1] !== 1) throw new Error('matrix cannot be converted to vector as the dimensions do not match');

    return new Vector(...vectorAsMatrix.values.map((line) => line[0]));
  }

  clone() {
    return Vector.fromMatrix(super.clone());
  }

  getValues() {
    return this.values.map((line) => line[0]);
  }

  get(index: number) {
    return this.getValues()[index];
  }

  getDimension() {
    return this.dimensions[0];
  }

  // overrride to return a vector instead of a matrix
  add(vector: Vector) {
    return Vector.fromMatrix(super.add(vector));
  }

  // overrride to return a vector instead of a matrix
  subtract(vector: Vector) {
    return Vector.fromMatrix(super.subtract(vector));
  }

  // overrride to return a vector instead of a matrix
  multiply(factor: number) {
    return Vector.fromMatrix(super.multiply(factor));
  }

  // overrride to return a vector instead of a matrix
  divide(divisor: number) {
    return Vector.fromMatrix(super.divide(divisor));
  }

  dot(vector: Vector) {
    return vector.transpose().product(this).values[0][0];
  }

  getNorm() {
    return Math.sqrt(this.dot(this));
  }

  normalize(ignoreZero: boolean = false) {
    // ignoreZero: false to error if a zero vector is given, true to return the zero vector
    const norm = this.getNorm();

    if (this.getNorm() === 0) {
      if (ignoreZero) return this; // return the zero vector
      throw new Error('cannot normalize zero vector');
    }

    return this.divide(norm);
  }

  // TODO: move to separate file: Vector3 ?
  cross(vector: Vector) {
    if (this.getDimension() !== 3 || vector.getDimension() !== 3) throw new Error('cross product on vectors with dimensions not equal to 3');

    return new Vector(
      this.get(1) * vector.get(2) - this.get(2) * vector.get(1),
      this.get(2) * vector.get(0) - this.get(0) * vector.get(2),
      this.get(0) * vector.get(1) - this.get(1) * vector.get(0),
    );
  }

  applyQuaternionRotation(quaternion: Quaternion) {
    // quaternion must be a unit quaternion
    if (this.getDimension() !== 3) throw new Error('cannot rotate vector that is not 3 dimensional');

    const axis = new Vector(...quaternion.getValues().slice(1));
    const scalar = quaternion.get(0);

    // https://gamedev.stackexchange.com/a/50545
    return axis.multiply(2 * axis.dot(this)).add(
      this.multiply(scalar ** 2 - axis.getNorm() ** 2),
    ).add(
      axis.cross(this).multiply(2 * scalar),
    );
  }
}
