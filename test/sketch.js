import { World } from '../dist/world.js';
import { Vector } from '../dist/math/vector.js';
import { SoftBody } from '../dist/physics/bodies/soft_body.js';
import { RigidBody } from '../dist/physics/bodies/rigid_body.js';
import { Spring } from '../dist/physics/springs/spring.js';
import { MassPoint } from '../dist/physics/points/mass_point.js';
import { Mesh } from '../dist/meshes/mesh.js';
import { Transform } from '../dist/physics/transform.js';

const cubeModelPath = 'models/cube.obj';
const diskModelPath = 'models/disk.obj';
const floorModelPath = 'models/floor.obj';

function getMesh(path) {
  const request = new XMLHttpRequest();

  let mesh;
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      mesh = Mesh.fromWavefront(this.responseText);
    }
  };
  request.open('GET', path, false);
  request.send();

  return mesh;
}

class MainWorld extends World {
  GRAVITATIONAL_ACCELERATION = new Vector(0, 9.81, 0);

  constructor(timeStep) {
    super(timeStep);

    // get the meshes
    const cubeMesh = getMesh(cubeModelPath);
    const diskMesh = getMesh(diskModelPath);
    const floorMesh = getMesh(floorModelPath);

    this.softCube = SoftBody.createCube(3, 1, 300, 15);
    this.softCube.points[0].transform.translate(new Vector(50, 0, 0));

    const cubeMass = 10;
    this.rigidCube = new RigidBody(
      new Transform(),
      cubeMass,
      cubeMesh,
      RigidBody.getCubeInertiaTensor(1, cubeMass),
    );

    const diskMass = 10;
    this.rigidDisk = new RigidBody(
      new Transform(new Vector(0, -5, 0)),
      diskMass,
      diskMesh,
      RigidBody.getDiskInertiaTensor(1, diskMass, 1),
    );
    this.rigidDisk.transform.rotate(Math.PI / 2, new Vector(1, 0, 0));

    this.floor = RigidBody.withInfiniteMass(
      new Transform(new Vector(0, 5, 0)),
      floorMesh,
    );

    this.register(...this.softCube.points, ...this.softCube.connections);
    this.register(this.rigidCube);
    this.register(this.rigidDisk);
    this.register(this.floor);
  }

  simulate() {
    super.simulate();

    // apply gravitational force
    this.rigidCube.applyForce(this.GRAVITATIONAL_ACCELERATION.multiply(this.rigidCube.mass));
    this.rigidDisk.applyForce(this.GRAVITATIONAL_ACCELERATION.multiply(this.rigidDisk.mass));
    // this.softCube.applyForce(this.GRAVITATIONAL_FORCE);

    /*
    if (this.time < 0.2) {
      this.softCube.points[0].applyForce(new Vector(1, 0, 0).multiply(30));
      this.softCube.points[7].applyForce(new Vector(-1, 0, 0).multiply(30));
    }

    this.rigidCube.applyForceAtPoint(new Vector(1, 0, 0), new Vector(0, -1, 0));
    this.rigidCube.applyForce(new Vector(0, -1, 0));

    if (this.time < 5) {
      this.rigidDisk.applyTorque(new Vector(0, 0, 1).multiply(100));
    } else {
      const direction = new Vector(0, 1, 0).cross(this.rigidDisk.angularVelocity).normalize(true);

      this.rigidDisk.applyTorque(direction.multiply(1000));
    }
    */
  }
}

function drawRigidBody(p, rigidBody) {
  const vertices = rigidBody.getVertices();
  const { edges, faces } = rigidBody.mesh;

  p.stroke(0, 0, 0);
  p.fill(255, 0, 0);

  // draw each edge
  edges.forEach((edge) => {
    const vertex1 = vertices[edge[0]];
    const vertex2 = vertices[edge[1]];

    p.line(...vertex1.getValues(), ...vertex2.getValues());
  });

  // draw each face
  p.noStroke();
  faces.forEach((face) => {
    const faceVerticesIndices = [];

    face.forEach((edgeIndex, i) => {
      const edge = edges[edgeIndex];

      if (i === 0) {
        const nextEdge = edges[face[1]];

        // add the vertices of the first edge in the right order
        if (nextEdge.includes(edge[0])) faceVerticesIndices.push(...edge.toReversed());
        else faceVerticesIndices.push(...edge);

        return;
      }

      // add the vertices in the right order
      if (edge[0] === faceVerticesIndices[faceVerticesIndices.length - 1]) {
        faceVerticesIndices.push(edge[1]);
      } else if (edge[1] === faceVerticesIndices[faceVerticesIndices.length - 1]) {
        faceVerticesIndices.push(edge[0]);
      } else {
        faceVerticesIndices.push(...edge);
      }
    });

    p.beginShape();
    faceVerticesIndices.forEach((vertexIndex) => {
      p.vertex(...vertices[vertexIndex].getValues());
    });
    p.endShape();
  });
}

const sketch = (p) => {
  const timeStep = 1 / 120;

  const world = new MainWorld(timeStep);

  let lastTime = Date.now() / 1000;

  let font;

  let debug = true;

  /* eslint-disable-next-line no-param-reassign */
  p.keyPressed = () => {
    if (p.key === ' ') debug = !debug;

    if (p.key === 'w') world.rigidDisk.applyForce(new Vector(0, -1000, 0));
    if (p.key === 'a') world.rigidDisk.applyForce(new Vector(-1000, 0, 0));
    if (p.key === 's') world.rigidDisk.applyForce(new Vector(0, 1000, 0));
    if (p.key === 'd') world.rigidDisk.applyForce(new Vector(1000, 0, 0));
  };

  /* eslint-disable-next-line no-param-reassign */
  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth - 20, window.innerHeight - 20);
  };

  /* eslint-disable-next-line no-param-reassign */
  p.preload = () => {
    font = p.loadFont('fonts/Arial.ttf');
  };

  /* eslint-disable-next-line no-param-reassign */
  p.setup = () => {
    p.createCanvas(window.innerWidth - 20, window.innerHeight - 20, p.WEBGL);
  };

  /* eslint-disable-next-line no-param-reassign */
  p.draw = () => {
    p.background(51);
    p.orbitControl();

    // scale the world
    p.scale(20);

    // draw the axes
    p.push();
    p.stroke(255, 0, 0);
    p.line(0, 0, 0, 10, 0, 0);
    p.stroke(0, 255, 0);
    p.line(0, 0, 0, 0, 10, 0);
    p.stroke(0, 0, 255);
    p.line(0, 0, 0, 0, 0, 10);
    p.pop();

    // draw the objects in the world
    world.updatables.forEach((updatable) => {
      p.push();

      p.strokeWeight(0.2);

      if (updatable instanceof MassPoint) {
        p.stroke(255, 0, 0);
        p.noStroke();
        p.fill(255, 0, 0);

        p.translate(...updatable.transform.position.getValues());
        p.sphere(0.1);
      } else if (updatable instanceof RigidBody) {
        drawRigidBody(p, updatable);

        const vectorToString = (vector) => vector.getValues().map((value) => value.toFixed(2));
        const vectorNormToString = (vector) => vector.getNorm().toFixed(3).toString();

        if (debug) {
          let information = `${updatable.constructor.name}`;
          information += `\nposition: ${vectorToString(updatable.transform.position)}`;
          information += `\nrotation: ${vectorToString(updatable.transform.rotation)}`;
          information += `\nscaling: ${vectorToString(updatable.transform.scaling)}`;
          information += `\nangular velocity: ${vectorToString(updatable.angularVelocity)}`;
          information += `\nangular speed: ${vectorNormToString(updatable.angularVelocity)}`;
          information += `\ntotal forces: ${vectorToString(updatable.totalForces)}`;
          information += `\ntotal forces norm: ${vectorNormToString(updatable.totalForces)}`;
          information += `\ntotal torque: ${vectorToString(updatable.totalTorque)}`;
          information += `\ntotal torque norm: ${vectorNormToString(updatable.totalTorque)}`;
          information += `\nkinetic energy: ${updatable.getKineticEnergy().toFixed(3)}`;

          p.push();

          p.stroke(0, 128, 255);
          p.fill(0, 128, 255);
          p.strokeWeight(1);

          p.textFont(font);
          p.textSize(0.3);

          p.translate(...updatable.transform.position.getValues());
          p.line(0, 0, 0, 2.3, -1.5, -1.5);

          p.push();
          p.translate(2.5, -1.5, -1.5);
          p.text(information, 0, 0);
          p.pop();

          // draw the angular velocity vector
          p.stroke(255, 128, 0);
          p.line(0, 0, 0, ...updatable.angularVelocity.divide(40).getValues());
          p.fill(255, 128, 0);
          p.noStroke();
          p.push();
          p.translate(...updatable.angularVelocity.divide(40).getValues());
          p.sphere(0.1);
          p.pop();

          p.pop();
        }
      } else if (updatable instanceof Spring) {
        p.noFill();
        p.stroke(255, 255, 255);

        const position1 = updatable.point1.transform.position;
        const position2 = updatable.point2.transform.position;

        p.line(
          position1.get(0),
          position1.get(1),
          position1.get(2),
          position2.get(0),
          position2.get(1),
          position2.get(2),
        );
      }

      p.pop();
    });

    // update the simulation in real time

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
