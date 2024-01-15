import { MassPoint } from '../points/mass_point.js';
import { Spring } from './spring.js';

export class DampedSpring extends Spring {
  damping: number;

  constructor(stiffness: number, damping: number, restLength: number, point1: MassPoint, point2: MassPoint) {
    super(stiffness, restLength, point1, point2);
    this.damping = damping;
  }

  update(dt: number) {
    super.update(dt);

    // calculate the damping force
    const direction = this.point2.position
      .subtract(this.point1.position)
      .normalize();

    const relativeVelocity = this.point2.velocity.subtract(this.point1.velocity);

    const force = direction
      .multiply(relativeVelocity.dot(direction))
      .multiply(this.damping);

    this.point1.applyForce(force);
    this.point2.applyForce(force.multiply(-1));
  }
}
