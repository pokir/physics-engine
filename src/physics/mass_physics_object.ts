import { rungeKutta4Method } from '../math/differential_equation_solvers/runge_kutta_4_method.js';
import { Vector } from '../math/vector.js';
import { Updatable } from '../updatable.js';
import { Collider } from './collider.js';
import { Transform } from './transform.js';

type ForceFunction = (time: number, position: Vector, velocity: Vector) => Vector;

export class MassPhysicsObject implements Updatable {
  transform: Transform;

  collider: Collider;

  velocity: Vector;

  mass: number;

  forces: ForceFunction[] = [];

  constructor(transform: Transform, collider: Collider, mass: number) {
    this.transform = transform;
    this.collider = collider;

    this.velocity = new Vector(0, 0, 0);

    this.mass = mass;
  }

  update(dt: number) {
    // solve second order ODE: F = ma
    const lastState = [this.transform.position, this.velocity];
    const nextState = rungeKutta4Method(lastState, 0, dt, [
      (time: number, [position, velocity]: Vector[]) => velocity,
      (time: number, [position, velocity]: Vector[]) => this.forces.reduce(
        (sum: Vector, force: ForceFunction) => sum.add(force(time, position, velocity)),
        new Vector(0, 0, 0),
      ).divide(this.mass),
    ]);

    [this.transform.position, this.velocity] = nextState;

    // clear the forces
    this.forces = [];
  }

  applyForce(force: ForceFunction) {
    this.forces.push(force);
  }

  applyConstantForce(force: Vector) {
    this.applyForce((time: number, positoin: Vector, velocity: Vector) => force);
  }
}
