import { Matrix } from '../../math/matrix.js';
import { Vector } from '../../math/vector.js';
import { Collider } from '../collider.js';
import { MassPhysicsObject } from '../mass_physics_object.js';
import { Transform } from '../transform.js';

export class RigidBody extends MassPhysicsObject {
  inertiaTensor: Matrix;

  angularVelocity: Vector = new Vector(0, 0, 0);

  totalTorque: Vector = new Vector(0, 0, 0);

  constructor(transform: Transform, collider: Collider, mass: number, inertiaTensor: Matrix) {
    super(transform, collider, mass);

    this.inertiaTensor = inertiaTensor;
  }

  update(dt: number) {
    const angularAcceleration = Vector.fromMatrix(this.inertiaTensor.inverse().product(
      this.totalTorque.subtract(
        this.angularVelocity.cross(
          Vector.fromMatrix(this.inertiaTensor.product(this.angularVelocity)),
        ),
      ),
    ));

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
    const inertiaTensor = new Matrix([3, 3], [
      [(2 * (sideLength ** 2)) * (mass / 12), 0, 0],
      [0, (2 * (sideLength ** 2)) * (mass / 12), 0],
      [0, 0, (2 * (sideLength ** 2)) * (mass / 12)],
    ]);
    return new RigidBody(new Transform(), new Collider(), mass, inertiaTensor);
  }
}
