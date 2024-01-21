import { ForceGenerator } from './physics/force_generators/force_generator.js';
import { MassPoint } from './physics/points/mass_point.js';
import { Updatable } from './updatable.js';

export class World {
  timeStep: number;

  time: number = 0;

  updatables: Updatable[] = [];

  forceGenerators: ForceGenerator[] = [];

  constructor(timeStep: number) {
    this.timeStep = timeStep;
  }

  register(...updatables: Updatable[]) {
    this.updatables.push(...updatables);
  }

  addForceGenerator(forceGenerator: ForceGenerator) {
    this.forceGenerators.push(forceGenerator);
  }

  simulate() {
    this.updatables.forEach((updatable) => {
      updatable.update(this.timeStep);

      // apply the forces of force generators on mass points
      if (updatable instanceof MassPoint) {
        this.forceGenerators.forEach((forceGenerator) => {
          forceGenerator.apply(updatable);
        });
      }
    });

    this.time += this.timeStep;
  }
}
