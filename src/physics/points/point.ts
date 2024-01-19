import { Collider } from '../collider.js';
import { PhysicsObject } from '../physics_object.js';
import { Transform } from '../transform.js';

export class Point extends PhysicsObject {
  constructor(transform: Transform) {
    super(transform, new Collider());
  }

  update(dt: number) {
    super.update(dt);
  }
}
