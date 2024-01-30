import { Vector } from '../../math/vector.js';
import { Updatable } from '../../updatable.js';
import { MassPoint } from '../points/mass_point.js';

export class Spring implements Updatable {
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
    const getForceFunction = (referencePoint: MassPoint) => (
      (time: number, position: Vector, velocity: Vector) => {
        const displacement = referencePoint.transform.position.subtract(position);
        const lengthDifference = displacement.getNorm() - this.restLength;

        return displacement.normalize().multiply(this.stiffness * lengthDifference);
      }
    );

    this.point1.applyForce(getForceFunction(this.point2));
    this.point2.applyForce(getForceFunction(this.point1));
  }
}
