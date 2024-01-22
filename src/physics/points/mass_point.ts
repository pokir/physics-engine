import { Collider } from '../collider.js';
import { MassPhysicsObject } from '../mass_physics_object.js';
import { Transform } from '../transform.js';

export class MassPoint extends MassPhysicsObject {
  constructor(transform: Transform, mass: number) {
    super(transform, new Collider(), mass);
  }
}
