export class Matrix {
  dimensions: [number, number]; // lines, columns

  values: number[][];

  constructor(dimensions: [number, number], values?: number[][]) {
    this.dimensions = dimensions;

    // null values by default
    if (values === undefined) {
      this.values = [];

      for (let i = 0; i < this.dimensions[0]; i += 1) {
        this.values.push([]);
        for (let j = 0; j < this.dimensions[1]; j += 1) {
          this.values[i].push(0);
        }
      }
    } else {
      if (values.length !== this.dimensions[0]) throw new Error('number of lines does not match dimensions');

      values.forEach((line) => {
        if (line.length !== this.dimensions[1]) throw new Error('number of columns does not match dimensions');
      });

      this.values = values;
    }
  }

  clone() {
    const values: number[][] = [];

    // copy the values
    this.values.forEach((line) => {
      values.push([...line]);
    });

    return new Matrix(this.dimensions, values);
  }

  static identity(dimension: number) {
    const matrix = new Matrix([dimension, dimension]);

    for (let i = 0; i < dimension; i += 1) {
      matrix.values[i][i] = 1;
    }

    return matrix;
  }

  add(matrix: Matrix) {
    if (matrix.dimensions[0] !== this.dimensions[0] || matrix.dimensions[1] !== this.dimensions[1]) throw new Error('matrix dimensions do not match');

    const result = this.clone();

    for (let i = 0; i < result.dimensions[0]; i += 1) {
      for (let j = 0; j < result.dimensions[1]; j += 1) {
        result.values[i][j] += matrix.values[i][j];
      }
    }

    return result;
  }

  multiply(factor: number) {
    const result = this.clone();

    for (let i = 0; i < result.dimensions[0]; i += 1) {
      for (let j = 0; j < result.dimensions[1]; j += 1) {
        result.values[i][j] *= factor;
      }
    }

    return result;
  }

  subtract(matrix: Matrix) {
    return this.add(matrix.multiply(-1));
  }

  divide(divisor: number) {
    return this.multiply(1 / divisor);
  }

  product(matrix: Matrix) {
    if (this.dimensions[1] !== matrix.dimensions[0]) throw new Error('matrix dimensions do not match');

    const result = new Matrix([this.dimensions[0], matrix.dimensions[1]]);

    for (let j = 0; j < matrix.dimensions[1]; j += 1) {
      for (let i = 0; i < this.dimensions[0]; i += 1) {
        for (let k = 0; k < this.dimensions[1]; k += 1) {
          result.values[i][j] += this.values[i][k] * matrix.values[k][j];
        }
      }
    }

    return result;
  }

  transpose() {
    const result = new Matrix([this.dimensions[1], this.dimensions[0]]);

    for (let i = 0; i < this.dimensions[0]; i += 1) {
      for (let j = 0; j < this.dimensions[1]; j += 1) {
        result.values[j][i] = this.values[i][j];
      }
    }

    return result;
  }

  inInputBase(baseMatrix: Matrix) {
    return this.product(baseMatrix);
  }

  inOutputBase(baseMatrix: Matrix) {
    return baseMatrix.inverse().product(this);
  }

  augment(matrix: Matrix) {
    // concatenate a matrix to the right
    if (this.dimensions[0] !== matrix.dimensions[0]) throw new Error('matrix dimensions do not match');

    return new Matrix(
      [this.dimensions[0], this.dimensions[1] + matrix.dimensions[1]],
      this.values.map((line, i) => [...line, ...matrix.values[i]]),
    );
  }

  extract(startingLine: number, startingColumn: number, endingLine: number, endingColumn: number) {
    if (startingLine < 0 || startingLine > this.dimensions[0]
        || endingLine < 0 || endingLine > this.dimensions[0]
        || startingColumn < 0 || startingColumn > this.dimensions[1]
        || endingColumn < 0 || endingColumn > this.dimensions[1]
        || endingLine <= startingLine || endingColumn <= startingColumn
    ) throw new Error('invalid range');

    const result = new Matrix([endingLine - startingLine, endingColumn - startingColumn]);
    for (let i = 0; i < result.dimensions[0]; i += 1) {
      for (let j = 0; j < result.dimensions[1]; j += 1) {
        result.values[i][j] = this.values[startingLine + i][startingColumn + j];
      }
    }

    return result;
  }

  private swapLines(line1: number, line2: number) {
    const result = this.clone();

    const temp = result.values[line1];
    result.values[line1] = result.values[line2];
    result.values[line2] = temp;

    return result;
  }

  private multiplyLine(line: number, factor: number) {
    const result = this.clone();

    result.values[line] = result.values[line].map((value) => value * factor)
      .map((value) => (value === 0 ? 0 : value)); // remove negative zeros

    return result;
  }

  private addLine(sourceLine: number, targetLine: number, factor: number = 1) {
    const result = this.clone();

    result.values[targetLine] = result.values[targetLine]
      .map((value, i) => value + result.values[sourceLine][i] * factor);

    return result;
  }

  reduce(): {reduced: Matrix, pivots: number} {
    let result = this.clone();

    const pivotLines: number[] = []; // lines containing a pivot

    // find pivots column by column
    for (let j = 0; j < result.dimensions[1]; j += 1) {
      let pivotLineIndex: number = -1;

      for (let i = 0; i < result.dimensions[0]; i += 1) {
        if (result.values[i][j] !== 0) {
          if (pivotLineIndex === -1 && !pivotLines.includes(i)) {
            // set this line as the pivot line
            pivotLineIndex = i;
            pivotLines.push(pivotLineIndex);

            // divide the pivot line so the pivot is 1
            const factor = 1 / result.values[pivotLineIndex][j];
            result = result.multiplyLine(pivotLineIndex, factor);
          } else if (pivotLineIndex !== -1 && i !== pivotLineIndex) {
            // add the pivot line to the current line
            const factor = -result.values[i][j];
            result = result.addLine(pivotLineIndex, i, factor);
          }
        }
      }
    }

    // simplify the pivot lines
    for (let i = pivotLines.length - 2; i >= 0; i -= 1) {
      // add multiples of each pivot line under it
      for (let j = i + 1; j < pivotLines.length; j += 1) {
        const pivotColumn = result.values[pivotLines[j]].findIndex((value) => value !== 0);

        const factor = -result.values[pivotLines[i]][pivotColumn];
        result = result.addLine(pivotLines[j], pivotLines[i], factor);
      }
    }

    // put the pivot lines in order
    for (let i = 0; i < pivotLines.length; i += 1) {
      const pivotLine = pivotLines[i];

      result = result.swapLines(i, pivotLine);

      // if the line swapped was also a pivot line, update its index
      if (pivotLines.includes(i)) {
        pivotLines[pivotLines.indexOf(i)] = pivotLine;
      }
    }

    return { reduced: result, pivots: pivotLines.length };
  }

  inverse() {
    if (this.dimensions[0] !== this.dimensions[1]) throw new Error('cannot get the inverse of a non square matrix');

    // check if it is invertible
    const { pivots } = this.reduce();
    if (pivots < this.dimensions[0]) throw new Error('matrix is not invertible');

    const { reduced } = this.augment(Matrix.identity(this.dimensions[0])).reduce();
    return reduced.extract(0, this.dimensions[1], this.dimensions[0], this.dimensions[1] * 2);
  }
}
