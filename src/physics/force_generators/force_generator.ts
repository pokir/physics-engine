import { MassPoint } from '../points/mass_point';

export abstract class ForceGenerator {
  abstract apply(target: MassPoint): void;
}
