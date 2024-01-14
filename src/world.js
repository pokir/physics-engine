export class World {
  constructor() {
    this.objects = [];
    this.lastUpdateTime = Date.now();
  }

  registerObject(...objects) {
    this.objects.push(...objects);
  }

  simulate() {
    const currentTime = Date.now();

    for (const object of this.objects) {
      const dt = (currentTime - this.lastUpdateTime) / 1000;
      object.update(dt);
    }

    this.lastUpdateTime = currentTime;
  }
}
