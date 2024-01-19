import { Updatable } from './updateable';

export class World {
  timeStep: number;

  time: number = 0;

  updatables: Updatable[];

  constructor(timeStep: number) {
    this.timeStep = timeStep;

    this.updatables = [];
  }

  register(...updatables: Updatable[]) {
    this.updatables.push(...updatables);
  }

  simulate() {
    this.updatables.forEach((updatable) => {
      updatable.update(this.timeStep);
    });

    this.time += this.timeStep;
  }
}
