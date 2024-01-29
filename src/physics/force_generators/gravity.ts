import { Vector } from '../../math/vector.js';
import { MassPoint } from '../points/mass_point.js';
import { ForceGenerator } from './force_generator.js';

export class Gravity implements ForceGenerator {
  gravitationalAcceleration: number;

  constructor(gravitationalAcceleration: number = 9.81) {
    this.gravitationalAcceleration = gravitationalAcceleration;
  }

  apply(target: MassPoint) {
    target.applyForce(new Vector(0, this.gravitationalAcceleration * target.mass, 0));
  }
}
