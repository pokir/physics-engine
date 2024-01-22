import { Vector } from '../math/vector.js';
import { Collider } from './collider.js';
import { PhysicsObject } from './physics_object.js';
import { Transform } from './transform.js';

export class MassPhysicsObject extends PhysicsObject {
  mass: number;

  totalForce: Vector = new Vector(0, 0, 0);

  constructor(transform: Transform, collider: Collider, mass: number) {
    super(transform, collider);

    this.mass = mass;
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
