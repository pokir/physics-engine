import { Vector } from '../../math/vector.js';
import { Collider } from '../collider.js';
import { MassPhysicsObject } from '../mass_physics_object.js';
import { Transform } from '../transform.js';

export class RigidBody extends MassPhysicsObject {
  angularVelocity: Vector = new Vector(0, 0, 0);

  totalTorque: Vector = new Vector(0, 0, 0);

  update(dt: number) {
    // TODO: replace mass by inertia tensor
    const angularAcceleration = this.totalTorque.divide(this.mass);
    this.angularVelocity = this.angularVelocity.add(angularAcceleration.multiply(dt));

    // reset torque
    this.totalTorque = this.totalTorque.multiply(0);

    // apply the rotation
    const angularSpeed = this.angularVelocity.getNorm();
    const axis = angularSpeed === 0 ? new Vector(1, 0, 0) : this.angularVelocity.normalize();

    this.transform.rotate(angularSpeed * dt, axis);

    super.update(dt);
  }

  applyTorque(torque: Vector) {
    this.totalTorque = this.totalTorque.add(torque);
  }

  static createCube(sideLength: number, mass: number) {
    return new RigidBody(new Transform(), new Collider(), mass);
  }
}
