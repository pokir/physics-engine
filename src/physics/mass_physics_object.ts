import { rungeKutta4Method } from '../math/differential_equation_solvers/runge_kutta_4_method.js';
import { Vector } from '../math/vector.js';
import { Updatable } from '../updatable.js';
import { Collider } from './collider.js';
import { Transform } from './transform.js';

export class MassPhysicsObject implements Updatable {
  transform: Transform;

  collider: Collider;

  velocity: Vector = new Vector(0, 0, 0);

  mass: number;

  totalForces: Vector = new Vector(0, 0, 0);

  constructor(transform: Transform, collider: Collider, mass: number) {
    this.transform = transform;
    this.collider = collider;
    this.mass = mass;
  }

  update(dt: number) {
    // solve second order ODE: F = ma
    const lastState = [this.transform.position, this.velocity];
    const nextState = rungeKutta4Method(lastState, 0, dt, [
      (time: number, [position, velocity]: Vector[]) => velocity,
      (time: number, [position, velocity]: Vector[]) => this.totalForces.divide(this.mass),
    ]);

    [this.transform.position, this.velocity] = nextState;

    // clear the forces
    this.totalForces = this.totalForces.multiply(0);
  }

  applyForce(force: Vector) {
    this.totalForces = this.totalForces.add(force);
  }
}
