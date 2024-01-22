import { World } from '../dist/world.js';
import { Vector } from '../dist/math/vector.js';
import { SoftBody } from '../dist/physics/bodies/soft_body.js';
import { RigidBody } from '../dist/physics/bodies/rigid_body.js';
import { Spring } from '../dist/physics/springs/spring.js';
import { MassPoint } from '../dist/physics/points/mass_point.js';
import { Gravity } from '../dist/physics/force_generators/gravity.js';
import { PhysicsObject } from '../dist/physics/physics_object.js';

class MainWorld extends World {
  constructor(timeStep) {
    super(timeStep);

    // this.sphere = SoftBody.createSphere(1, 10, 1, 300, 20);
    // this.sphere = SoftBody.createLine(1, 1, 300, 20);
    this.sphere = SoftBody.createCube(1, 1, 300, 15);
    // this.sphere.points[0].transform.position = this.sphere.points[0].transform.position.add(new Vector(0.5, 0, 0));

    this.cube = RigidBody.createCube(1, 10);

    this.register(...this.sphere.points, ...this.sphere.connections);
    this.register(this.cube);

    this.addForceGenerator(new Gravity(0));
  }

  simulate() {
    super.simulate();

    if (this.time < 0.2) {
      this.cube.applyTorque(new Vector(1, 1, 1).multiply(100));
      // this.sphere.points[0].applyForce(new Vector(1, 0, 0).multiply(10));
      // this.sphere.points[5].applyForce(new Vector(-1, 0, 0).multiply(10));
      // this.sphere.points(0).applyTorque(new
    }
  }
}

const sketch = (p) => {
  const timeStep = 1 / 60;

  const world = new MainWorld(timeStep);

  let lastTime = Date.now() / 1000;

  p.setup = () => {
    p.createCanvas(600, 600, p.WEBGL);
  };

  p.draw = () => {
    p.background(51);

    p.orbitControl();

    world.updatables.forEach((updatable) => {
      p.push();

      if (updatable instanceof PhysicsObject) {
        const { position, rotation } = updatable.transform;

        const angle = Math.acos(rotation.get(0));
        const axis = [rotation.get(1), rotation.get(2), rotation.get(3)]
          .map((value) => value / Math.sin(angle));

        p.rotate(angle, axis);
        p.translate(position.get(0) * 100, position.get(1) * 100, position.get(2) * 100);
      }

      if (updatable instanceof MassPoint) {
        p.noStroke();
        p.fill(255, 0, 0);

        p.sphere(5);
      } else if (updatable instanceof RigidBody) {
        p.noStroke();
        p.fill(255, 0, 0);

        p.box(50);
      } else if (updatable instanceof Spring) {
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

    const currentTime = Date.now() / 1000;

    // number of times to update the simulation
    const numUpdates = Math.floor((currentTime - lastTime) / timeStep);

    for (let i = 0; i < numUpdates; i += 1) {
      world.simulate();
    }

    // time left to simulate due to rounding
    const nonSimulatedTime = (currentTime - lastTime) - numUpdates * timeStep;

    lastTime = currentTime - nonSimulatedTime;
  };
};

new p5(sketch, document.getElementsByTagName('main')[0]);
