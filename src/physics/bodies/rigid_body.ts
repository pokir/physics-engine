import { Matrix } from '../../math/matrix.js';
import { Vector } from '../../math/vector.js';
import { Collider } from '../collider.js';
import { MassPhysicsObject } from '../mass_physics_object.js';
import { Transform } from '../transform.js';

export class RigidBody extends MassPhysicsObject {
  inertiaTensor: Matrix;

  // store the inverse inertia tensor to avoid recalculating it every time
  inverseInertiaTensor: Matrix;

  angularVelocity: Vector = new Vector(0, 0, 0);

  totalTorque: Vector = new Vector(0, 0, 0);

  constructor(transform: Transform, collider: Collider, mass: number, inertiaTensor: Matrix) {
    // inertiaTensor must be in the (x, y, z) basis relative to the object
    super(transform, collider, mass);

    this.inertiaTensor = inertiaTensor;
    this.inverseInertiaTensor = this.inertiaTensor.inverse();
  }

  update(dt: number) {
    const { rotation } = this.transform;

    // rotate the vectors to represent them in the same base as the inertia tensor
    const rotatedAngularVelocity = this.angularVelocity
      .applyQuaternionRotation(rotation.conjugate());
    const rotatedTotalTorque = this.totalTorque.applyQuaternionRotation(rotation.conjugate());

    const angularAcceleration = Vector.fromMatrix(this.inverseInertiaTensor.product(
      rotatedTotalTorque.subtract(
        rotatedAngularVelocity.cross(
          Vector.fromMatrix(this.inertiaTensor.product(rotatedAngularVelocity)),
        ),
      ),
    )).applyQuaternionRotation(rotation);

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

  static createDisk(radius: number, mass: number) {
    const inertiaTensor = new Matrix([3, 3], [
      [(radius ** 2) * (mass / 4), 0, 0],
      [0, (radius ** 2) * (mass / 4), 0],
      [0, 0, (radius ** 2) * (mass / 2)],
    ]);
    return new RigidBody(new Transform(), new Collider(), mass, inertiaTensor);
  }
}
