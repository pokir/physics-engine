import { World } from '../dist/world.js';
import { Vector } from '../dist/math/vector.js';
import { SoftBody } from '../dist/physics/bodies/soft_body.js';
import { RigidBody } from '../dist/physics/bodies/rigid_body.js';
import { Spring } from '../dist/physics/springs/spring.js';
import { MassPoint } from '../dist/physics/points/mass_point.js';
import { Gravity } from '../dist/physics/force_generators/gravity.js';
import { MassPhysicsObject } from '../dist/physics/mass_physics_object.js';
import { Mesh } from '../dist/meshes/mesh.js';
import { Transform } from '../dist/physics/transform.js';

const cubeModelPath = 'models/cube.obj';
const diskModelPath = 'models/disk.obj';

class MainWorld extends World {
  constructor(timeStep) {
    super(timeStep);

    // get the meshes
    let cubeMesh;
    let diskMesh;

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        cubeMesh = Mesh.fromWavefront(this.responseText);
      }
    };
    request.open('GET', cubeModelPath, false);
    request.send();

    request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        diskMesh = Mesh.fromWavefront(this.responseText);
      }
    };
    request.open('GET', diskModelPath, false);
    request.send();

    this.softCube = SoftBody.createCube(1, 1, 300, 15);
    this.softCube.points[0].transform.translate(new Vector(20, 0, 0));

    const cubeMass = 10;
    this.rigidCube = new RigidBody(
      new Transform(),
      cubeMass,
      cubeMesh,
      RigidBody.getCubeInertiaTensor(1, cubeMass),
    );

    const diskMass = 10;
    this.rigidDisk = new RigidBody(
      new Transform(),
      diskMass,
      diskMesh,
      RigidBody.getDiskInertiaTensor(1, diskMass),
    );
    this.rigidDisk.transform.translate(new Vector(0, -1, 0));

    this.register(...this.softCube.points, ...this.softCube.connections);
    this.register(this.rigidCube);
    this.register(this.rigidDisk);

    this.addForceGenerator(new Gravity(0));
  }

  simulate() {
    super.simulate();

    if (this.time < 0.2) {
      this.softCube.points[0].applyForce(new Vector(1, 0, 0).multiply(30));
      this.softCube.points[7].applyForce(new Vector(-1, 0, 0).multiply(30));
    }

    this.rigidCube.applyForceAtPoint(new Vector(1, 0, 0), new Vector(0, -1, 0));
    this.rigidCube.applyForce(new Vector(0, -1, 0));

    if (this.time < 5) {
      this.rigidDisk.applyTorque(new Vector(0, 0, 1).multiply(100));
    } else if (this.time < 10) {
      this.rigidDisk.applyTorque(new Vector(1, 0, 0).multiply(100));
    }
  }
}

const sketch = (p) => {
  const timeStep = 1 / 120;

  const world = new MainWorld(timeStep);

  let lastTime = Date.now() / 1000;

  let cubeModel;
  let diskModel;

  /* eslint-disable-next-line no-param-reassign */
  p.preload = () => {
    cubeModel = p.loadModel(cubeModelPath);
    diskModel = p.loadModel(diskModelPath);
  };

  /* eslint-disable-next-line no-param-reassign */
  p.setup = () => {
    p.createCanvas(600, 600, p.WEBGL);
  };

  /* eslint-disable-next-line no-param-reassign */
  p.draw = () => {
    p.background(51);

    p.orbitControl();

    p.push();
    p.stroke(0, 255, 0);
    p.line(0, 0, 0, 100, 0, 0);
    p.line(0, 0, 0, 0, 100, 0);
    p.line(0, 0, 0, 0, 0, 100);
    p.pop();

    // draw the objects in the world
    world.updatables.forEach((updatable) => {
      p.push();

      if (updatable instanceof MassPhysicsObject) {
        const { position, rotation } = updatable.transform;

        const angle = Math.acos(rotation.get(0)) * 2;
        const axis = rotation.getValues().slice(1);

        p.translate(position.get(0) * 100, position.get(1) * 100, position.get(2) * 100);
        if (!axis.every((value) => value === 0)) p.rotate(angle, axis);
      }

      p.strokeWeight(0.2);

      if (updatable instanceof MassPoint) {
        p.noStroke();
        p.fill(255, 0, 0);

        p.sphere(5);
      } else if (updatable instanceof RigidBody) {
        p.stroke(0, 0, 0);
        p.fill(255, 0, 0);

        if (updatable === world.rigidCube) {
          p.scale(20);
          p.model(cubeModel);
        } else if (updatable === world.rigidDisk) {
          p.scale(20);
          p.rotateX(Math.PI / 2);
          p.model(diskModel);
        }
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

    // avoid updating too many times in a single frame to avoid lag
    if (numUpdates > 20) {
      lastTime = currentTime;
      return;
    }

    for (let i = 0; i < numUpdates; i += 1) {
      world.simulate();
    }

    // time left to simulate due to rounding
    const nonSimulatedTime = (currentTime - lastTime) - numUpdates * timeStep;

    lastTime = currentTime - nonSimulatedTime;
  };
};

/* eslint-disable-next-line no-undef, new-cap, no-new */
window.p = new p5(sketch, document.getElementsByTagName('main')[0]);
