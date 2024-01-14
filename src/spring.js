export class Spring {
  constructor(stiffness, restLength, point1, point2) {
    if (isNaN(stiffness))
      throw new Error('not a number');

    if (isNaN(restLength))
      throw new Error('not a number');

    this.stiffness = stiffness;
    this.restLength = restLength;
    this.point1 = point1;
    this.point2 = point2;
  }

  update(dt) {
    const displacement = this.point2.position.subtract(this.point1.position);
    const lengthDifference = displacement.getNorm() - this.restLength;

    const force = displacement
      .normalize()
      .multiply(this.stiffness * lengthDifference);

    this.point1.applyForce(force);
    this.point2.applyForce(force.multiply(-1));
  }
}
