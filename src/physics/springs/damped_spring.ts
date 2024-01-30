import { Vector } from '../../math/vector.js';
import { MassPoint } from '../points/mass_point.js';
import { Spring } from './spring.js';

export class DampedSpring extends Spring {
  damping: number;

  constructor(
    stiffness: number,
    damping: number,
    restLength: number,
    point1: MassPoint,
    point2: MassPoint,
  ) {
    super(stiffness, restLength, point1, point2);
    this.damping = damping;
  }

  update(dt: number) {
    super.update(dt);

    const getForceFunction = (referencePoint: MassPoint) => (
      (time: number, position: Vector, velocity: Vector) => {
        // calculate the damping force
        const direction = referencePoint.transform.position.subtract(position).normalize();
        const relativeVelocity = referencePoint.velocity.subtract(velocity);

        return direction.multiply(relativeVelocity.dot(direction)).multiply(this.damping);
      }
    );

    this.point1.applyForce(getForceFunction(this.point2));
    this.point2.applyForce(getForceFunction(this.point1));
  }
}
