export interface updateFunction {
  (dt: number): void
}

export interface WorldObject {
  update: updateFunction
}

export class World {
  objects: WorldObject[];

  lastUpdateTime: number;

  constructor() {
    this.objects = [];
    this.lastUpdateTime = Date.now();
  }

  registerObject(...objects: []) {
    this.objects.push(...objects);
  }

  simulate() {
    const currentTime = Date.now();

    this.objects.forEach((object) => {
      const dt = (currentTime - this.lastUpdateTime) / 1000;
      object.update(dt);
    });

    this.lastUpdateTime = currentTime;
  }
}
