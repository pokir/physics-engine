export class World {
  constructor() {
    this.objects = [];
    this.lastUpdateTime = Date.now();
  }

  registerObject(object) {
    this.objects.push(object);
  }

  simulate() {
    const currentTime = Date.now();

    for (const object of this.objects) {
      const dt = currentTime - this.lastUpdateTime;
      object.update(dt);
    }

    this.lastUpdateTime = currentTime;
  }
}
