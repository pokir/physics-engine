import {
  World, Vector, SoftBody, MassPoint, Spring,
} from '../dist/index.js';
import { Point } from '../dist/physics/points/point.js';

class MainWorld extends World {
  // GRAVITY = 9.81;
  GRAVITY = 0;

  constructor() {
    super();

    this.gravitationalAcceleration = new Vector(0, this.GRAVITY, 0);

    // this.sphere = SoftBody.createSphere(1, 10, 1, 300, 20);
    // this.sphere = SoftBody.createLine(1, 1, 300, 20);
    this.sphere = SoftBody.createCube(1, 1, 300, 15);
    // this.sphere.points[0].transform.position = this.sphere.points[0].transform.position.add(new Vector(0.5, 0, 0));

    this.sphere.points[0].applyForce(new Vector(Math.random(), Math.random(), Math.random()).multiply(10));

    this.register(...this.sphere.points, ...this.sphere.connections);
  }

  simulate() {
    super.simulate();

    this.sphere.points.forEach((point) => {
      point.applyForce(this.gravitationalAcceleration.multiply(point.mass));
    });
  }
}

const sketch = (p) => {
  const world = new MainWorld();

  p.setup = () => {
    p.createCanvas(600, 600, p.WEBGL);
  };

  p.draw = () => {
    p.background(51);

    p.orbitControl();

    world.updatables.forEach((updatable) => {
      p.push();

      if (updatable instanceof Point) {
        // p.noStroke();
        // p.fill(255, 0, 0);
        p.stroke(255, 0, 0);
        p.strokeWeight(20);

        // p.translate(updatable.transform.position.get(0) * 100, updatable.transform.position.get(1) * 100, updatable.transform.position.get(2) * 100);
        const { position } = updatable.transform;
        p.point(position.get(0) * 100, position.get(1) * 100, position.get(2) * 100);
        // p.sphere(5);
      } else if (updatable instanceof Spring) {
        // console.log(updatable.point1, updatable.point2);
        p.noFill();
        p.stroke(255, 255, 255);

        const position1 = updatable.point1.transform.position;
        const position2 = updatable.point2.transform.position;

        p.line(
          position1.get(0) * 100,
          position1.get(1) * 100,
          position1.get(2) * 100,
          position2.get(0) * 100,
          position2.get(1) * 100,
          position2.get(2) * 100,
        );
      }

      p.pop();
    });

    // if (p.frameCount === 0) world.simulate();
    world.simulate();
  };
};

new p5(sketch, document.getElementsByTagName('main')[0]);
