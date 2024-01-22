export class Vector {
  values: number[];

  constructor(...values: number[]) {
    /* values.forEach((value) => {
      if (Number.isNaN(value)) throw new Error('not a number');
    }); */

    this.values = values;
  }

  clone() {
    return new Vector(...this.values);
  }

  get(index: number) {
    return this.values[index];
  }

  getDimension() {
    return this.values.length;
  }

  getNorm() {
    return Math.sqrt(this.dot(this));
  }

  dot(vector: Vector) {
    if (vector.getDimension() !== this.getDimension()) throw new Error('vector dimensions do not match');

    return this.values.reduce((total, value, index) => (
      total + value * vector.values[index]
    ), 0);
  }

  add(vector: Vector) {
    if (vector.getDimension() !== this.getDimension()) throw new Error('vector dimensions do not match');

    const result = this.clone();

    for (let i = 0; i < vector.values.length; i += 1) {
      result.values[i] += vector.values[i];
    }

    return result;
  }

  subtract(vector: Vector) {
    if (vector.getDimension() !== this.getDimension()) throw new Error('vector dimensions do not match');

    const result = this.clone();

    for (let i = 0; i < vector.values.length; i += 1) {
      result.values[i] -= vector.values[i];
    }

    return result;
  }

  multiply(factor: number) {
    // if (Number.isNaN(factor)) throw new Error('not a number');

    const result = this.clone();
    result.values = result.values.map((value) => value * factor);
    return result;
  }

  divide(divisor: number) {
    if (divisor === 0) throw new Error('division by zero');

    // if (Number.isNaN(divisor)) throw new Error('not a number');

    const result = this.clone();
    result.values = result.values.map((value) => value / divisor);
    return result;
  }

  normalize() {
    const norm = this.getNorm();

    if (this.getNorm() === 0) throw new Error('cannot normalize zero vector');

    return this.divide(norm);
  }

  cross(vector: Vector) {
    if (this.getDimension() !== 3 || vector.getDimension() !== 3) throw new Error('cross product on vectors with dimensions not equal to 3');

    return new Vector(
      this.values[1] * vector.values[2] - this.values[2] * vector.values[1],
      this.values[0] * vector.values[2] - this.values[2] * vector.values[0],
      this.values[0] * vector.values[1] - this.values[1] * vector.values[0],
    );
  }

  hamilton(vector: Vector) {
    if (this.getDimension() !== 4 || vector.getDimension() !== 4) throw new Error('hamilton product on vectors with dimensions not equal to 4');

    return new Vector(
      this.values[0] * vector.values[0] - this.values[1] * vector.values[1] - this.values[2] * vector.values[2] - this.values[3] * vector.values[3],
      this.values[0] * vector.values[1] + this.values[1] * vector.values[0] + this.values[2] * vector.values[3] - this.values[3] * vector.values[2],
      this.values[0] * vector.values[2] - this.values[1] * vector.values[3] + this.values[2] * vector.values[0] + this.values[3] * vector.values[1],
      this.values[0] * vector.values[3] + this.values[1] * vector.values[2] - this.values[2] * vector.values[1] + this.values[3] * vector.values[0],
    );
  }
}
