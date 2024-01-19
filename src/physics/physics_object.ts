import { Vector } from '../math/vector.js';
import { Collider } from './collider.js';
import { Updatable } from '../updateable.js';
import { Transform } from './transform.js';

export class PhysicsObject implements Updatable {
  transform: Transform;

  collider: Collider;

  velocity: Vector;

  constructor(transform: Transform, collider: Collider) {
    this.transform = transform;
    this.collider = collider;

    this.velocity = new Vector(0, 0, 0);
  }

  update(dt: number) {
    this.transform.position = this.transform.position.add(this.velocity.multiply(dt));
  }
}
