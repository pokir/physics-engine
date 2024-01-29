import { MassPhysicsObject } from '../mass_physics_object';

export abstract class ForceGenerator {
  abstract apply(target: MassPhysicsObject): void;
}
