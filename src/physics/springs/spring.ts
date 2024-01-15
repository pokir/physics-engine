import { MassPoint } from '../points/mass_point';

export class Spring {
  stiffness: number;

  restLength: number;

  point1: MassPoint;

  point2: MassPoint;

  constructor(stiffness: number, restLength: number, point1: MassPoint, point2: MassPoint) {
    if (Number.isNaN(stiffness)) throw new Error('not a number');

    if (Number.isNaN(restLength)) throw new Error('not a number');

    this.stiffness = stiffness;
    this.restLength = restLength;
    this.point1 = point1;
    this.point2 = point2;
  }

  update(dt: number) {
    const displacement = this.point2.position.subtract(this.point1.position);
    const lengthDifference = displacement.getNorm() - this.restLength;

    const force = displacement
      .normalize()
      .multiply(this.stiffness * lengthDifference);

    this.point1.applyForce(force);
    this.point2.applyForce(force.multiply(-1));
  }
}