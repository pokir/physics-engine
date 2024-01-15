import { Vector } from '../../math/index.js';

export class MassPoint {
  constructor(mass, position) {
    this.mass = mass;
    this.position = position;

    this.totalForce = new Vector(0, 0, 0);
    this.velocity = new Vector(0, 0, 0);
  }

  update(dt) {
    const acceleration = this.totalForce.divide(this.mass);
    this.velocity = this.velocity.add(acceleration.multiply(dt));
    this.position = this.position.add(this.velocity);

    // reset the forces
    this.totalForce = this.totalForce.multiply(0);
  }

  applyForce(force) {
    this.totalForce = this.totalForce.add(force);
  }
}
