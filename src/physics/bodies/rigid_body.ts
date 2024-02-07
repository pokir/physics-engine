import { rungeKutta4Method } from '../../math/differential_equation_solvers/runge_kutta_4_method.js';
import { Matrix } from '../../math/matrix.js';
import { Vector } from '../../math/vector.js';
import { Mesh } from '../../meshes/mesh.js';
import { MassPhysicsObject } from '../mass_physics_object.js';
import { Transform } from '../transform.js';

export class RigidBody extends MassPhysicsObject {
  inertiaTensor: Matrix;

  // store the inverse inertia tensor to avoid recalculating it every time
  inverseInertiaTensor: Matrix;

  mesh: Mesh;

  angularVelocity: Vector = new Vector(0, 0, 0);

  totalTorque: Vector = new Vector(0, 0, 0);

  constructor(transform: Transform, mass: number, mesh: Mesh, inertiaTensor: Matrix) {
    // inertiaTensor must be in the (x, y, z) basis relative to the object
    super(transform, mass);

    this.mesh = mesh;

    this.inertiaTensor = inertiaTensor;
    this.inverseInertiaTensor = this.inertiaTensor.inverse();
  }

  update(dt: number) {
    const { rotation } = this.transform;

    [this.angularVelocity] = rungeKutta4Method([this.angularVelocity], 0, dt, [
      (time: number, [angularVelocity]: Vector[]) => {
        // rotate the vectors to represent them in the same basis as the inertia tensor
        const rotatedAngularVelocity = angularVelocity
          .applyQuaternionRotation(rotation.conjugate());
        const rotatedTotalTorque = this.totalTorque
          .applyQuaternionRotation(rotation.conjugate());

        const angularAcceleration = Vector.fromMatrix(this.inverseInertiaTensor.product(
          rotatedTotalTorque.subtract(
            rotatedAngularVelocity.cross(
              Vector.fromMatrix(this.inertiaTensor.product(rotatedAngularVelocity)),
            ),
          ),
        )).applyQuaternionRotation(rotation);

        return angularAcceleration;
      },
    ]);

    // apply the rotation directly (no ODE solver)
    const angularSpeed = this.angularVelocity.getNorm();
    const axis = angularSpeed === 0 ? new Vector(1, 0, 0) : this.angularVelocity.normalize();

    this.transform.rotate(angularSpeed * dt, axis);

    // reset torque
    this.totalTorque = this.totalTorque.multiply(0);

    super.update(dt);
  }

  applyTorque(torque: Vector) {
    this.totalTorque = this.totalTorque.add(torque);
  }

  applyForceAtPoint(force: Vector, point: Vector) {
    // applies force and torque at the same time
    this.applyForce(force);
    this.applyTorque(point.subtract(this.transform.position).cross(force));
  }

  getVertices() {
    return this.mesh.vertices.map((vertex) => this.transform.applyTransform(vertex));
  }

  getKineticEnergy() {
    return (this.mass * (this.velocity.getNorm() ** 2)) / 2
      + (this.angularVelocity.dot(
        Vector.fromMatrix(this.inertiaTensor.product(this.angularVelocity)),
      )) / 2;
  }

  static getCubeInertiaTensor(sideLength: number, mass: number) {
    return Matrix.identity(3).multiply((2 * (sideLength ** 2)) * (mass / 12));
  }

  static getDiskInertiaTensor(radius: number, mass: number, normalAxis: number) {
    // axis: 0 for x, 1 for y, 2 for z
    const planeInertia = (radius ** 2) * (mass / 4);
    const normalInertia = (radius ** 2) * (mass / 2);

    const inertiaMatrix = Matrix.identity(3).multiply(planeInertia);
    inertiaMatrix.values[normalAxis][normalAxis] = normalInertia;

    return inertiaMatrix;
  }

  static getSphereInertiaTensor(radius: number, mass: number) {
    return Matrix.identity(3).multiply((2 / 5) * mass * (radius ** 2));
  }
}
