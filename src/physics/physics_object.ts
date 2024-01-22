import { Vector } from '../math/vector.js';
import { Collider } from './collider.js';
import { Updatable } from '../updatable.js';
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
    this.transform.translate(this.velocity.multiply(dt));
  }
}
