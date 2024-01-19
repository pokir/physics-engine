import { Updatable } from './updateable';

export class World {
  updatables: Updatable[];

  lastUpdateTime: number;

  constructor() {
    this.updatables = [];
    this.lastUpdateTime = Date.now();
  }

  register(...updatables: Updatable[]) {
    this.updatables.push(...updatables);
  }

  simulate() {
    const currentTime = Date.now();

    this.updatables.forEach((updatable) => {
      const dt = (currentTime - this.lastUpdateTime) / 1000;
      updatable.update(dt);
    });

    this.lastUpdateTime = currentTime;
  }
}
