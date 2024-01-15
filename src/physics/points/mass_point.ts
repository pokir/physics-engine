import { Vector } from '../../math/vector.js';
import { Point } from './point.js';

export class MassPoint extends Point {
  mass: number;

  totalForce: Vector;

  constructor(mass: number, position: Vector) {
    super(position);
    this.mass = mass;
    this.totalForce = new Vector(0, 0, 0);
    this.velocity = new Vector(0, 0, 0);
  }

  update(dt: number) {
    const acceleration = this.totalForce.divide(this.mass);
    this.velocity = this.velocity.add(acceleration.multiply(dt));

    // reset the forces
    this.totalForce = this.totalForce.multiply(0);

    super.update(dt);
  }

  applyForce(force: Vector) {
    this.totalForce = this.totalForce.add(force);
  }
}