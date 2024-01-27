import { Matrix } from './matrix.js';

export class Vector extends Matrix {
  constructor(...values: number[]) {
    super([values.length, 1], values.map((value) => [value]));
  }

  static fromMatrix(vectorAsMatrix: Matrix) {
    if (vectorAsMatrix.dimensions[1] !== 1) throw new Error('matrix cannot be converted to vector as the dimensions do not match');

    return new Vector(...vectorAsMatrix.values.map((line) => line[0]));
  }

  clone(): Vector {
    return Vector.fromMatrix(Vector.fromMatrix(super.clone()));
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

  normalize() {
    const norm = this.getNorm();

    if (this.getNorm() === 0) throw new Error('cannot normalize zero vector');

    return this.divide(norm);
  }

  // TODO: move to separate file: Vector3 ?
  cross(vector: Vector) {
    if (this.getDimension() !== 3 || vector.getDimension() !== 3) throw new Error('cross product on vectors with dimensions not equal to 3');

    return new Vector(
      this.get(1) * vector.get(2) - this.get(2) * vector.get(1),
      this.get(0) * vector.get(2) - this.get(2) * vector.get(0),
      this.get(0) * vector.get(1) - this.get(1) * vector.get(0),
    );
  }

  // TODO: move to separate file: Quaternion
  hamilton(vector: Vector) {
    if (this.getDimension() !== 4 || vector.getDimension() !== 4) throw new Error('hamilton product on vectors with dimensions not equal to 4');

    return new Vector(
      this.get(0) * vector.get(0) - this.get(1) * vector.get(1) - this.get(2) * vector.get(2) - this.get(3) * vector.get(3),
      this.get(0) * vector.get(1) + this.get(1) * vector.get(0) + this.get(2) * vector.get(3) - this.get(3) * vector.get(2),
      this.get(0) * vector.get(2) - this.get(1) * vector.get(3) + this.get(2) * vector.get(0) + this.get(3) * vector.get(1),
      this.get(0) * vector.get(3) + this.get(1) * vector.get(2) - this.get(2) * vector.get(1) + this.get(3) * vector.get(0),
    );
  }
}
