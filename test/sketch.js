import {
  World, Vector, MassPoint, DampedSpring,
} from '../src/index.js';

class MainWorld extends World {
  GRAVITY = 9.81;

  constructor() {
    super();

    this.gravitationalAcceleration = new Vector(0, this.GRAVITY, 0);

    this.points = [];
    this.springs = [];

    this.points[0] = new MassPoint(1, new Vector(3, 3, 0));
    this.points[1] = new MassPoint(1, new Vector(4, 4, 0));
    this.points[2] = new MassPoint(1, new Vector(1, 5, 0));

    this.springs[0] = new DampedSpring(0.0002, 0.001, 1, this.points[0], this.points[1]);
    this.springs[1] = new DampedSpring(0.0002, 0.001, 1, this.points[1], this.points[2]);
    this.springs[2] = new DampedSpring(0.0002, 0.001, 1, this.points[0], this.points[2]);

    this.registerObject(...this.points, ...this.springs);
  }

  simulate() {
    super.simulate();

    // add gravity
    this.points.forEach((point) => {
      point.applyForce(this.gravitationalAcceleration.multiply(point.mass));
    });
  }
}

const sketch = (p) => {
  const world = new MainWorld();

  p.setup = () => {
    p.createCanvas(600, 600);
  };

  p.draw = () => {
    p.background(51);

    p.noStroke();
    p.fill(255, 0, 0);

    world.points.forEach((point) => {
      p.ellipse(point.position.get(0) * 100, point.position.get(1) * 100, 30);
    });

    world.simulate();
  };
};

new p5(sketch, document.getElementsByTagName('main')[0]);
