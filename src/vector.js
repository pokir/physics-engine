class Vector {
  constructor(...values) {
    for (const value of values) {
      if (isNaN(value))
        throw new Error('not a number');
    }

    this.values = values;
  }

  clone() {
    return new Vector(...this.values);
  }

  get(index) {
    return this.values[index];
  }

  getNorm() {
    return Math.sqrt(this.values.reduce((total, value) => total + Math.pow(value, 2)));
  }

  getDimension() {
    return this.values.length;
  }

  add(vector) {
    if (vector.getDimension() !== this.getDimension())
      throw new Error('vector dimensions do not match');

    const result = this.clone();

    for (let i = 0; i < vector.values.length; ++i) {
      result.values[i] += vector.values[i];
    }

    return result;
  }

  sub(vector) {
    if (vector.getDimension() !== this.getDimension())
      throw new Error('vector dimensions do not match');

    const result = this.clone();

    for (let i = 0; i < vector.values.length; ++i) {
      result.values[i] -= vector.values[i];
    }

    return result;
  }

  multiply(factor) {
    if (isNaN(factor))
      throw new Error('not a number');

    const result = this.clone();
    result.values = result.values.map(value => value * factor);
    return result;
  }

  divide(divisor) {
    if (divisor === 0)
      throw new Error('division by zero');

    if (isNaN(divisor))
      throw new Error('not a number');

    const result = this.clone();
    result.values = result.values.map(value => value / divisor);
    return result;
  }

  normalize() {
    const norm = this.getNorm();

    if (this.getNorm() === 0)
      throw new Error('cannot normalize zero vector');

    return this.divide(norm);
  }
}
