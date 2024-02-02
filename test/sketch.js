import { World } from '../dist/world.js';
import { Vector } from '../dist/math/vector.js';
import { SoftBody } from '../dist/physics/bodies/soft_body.js';
import { RigidBody } from '../dist/physics/bodies/rigid_body.js';
import { Spring } from '../dist/physics/springs/spring.js';
import { MassPoint } from '../dist/physics/points/mass_point.js';
import { Gravity } from '../dist/physics/force_generators/gravity.js';
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
      new Transform(),
      diskMass,
      diskMesh,
      RigidBody.getDiskInertiaTensor(1, diskMass, 1),
    );
    this.rigidDisk.transform.rotate(Math.PI / 2, new Vector(1, 0, 0));
    this.rigidDisk.transform.translate(new Vector(0, -5, 0));

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
      if (edge[0] === faceVerticesIndices[faceVerticesIndices.length - 1]) faceVerticesIndices.push(edge[1]);
      else if (edge[1] === faceVerticesIndices[faceVerticesIndices.length - 1]) faceVerticesIndices.push(edge[0]);
      else faceVerticesIndices.push(...edge);
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

  /* eslint-disable-next-line no-param-reassign */
  p.setup = () => {
    p.createCanvas(600, 600, p.WEBGL);
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
