import { Vector } from './math/vector.js';
import { RigidBody } from './physics/bodies/rigid_body.js';
import { Collision } from './physics/collisions/collision.js';
import { Updatable } from './updatable.js';

type BoundingBox = {
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
};

export class World {
  timeStep: number;

  time: number = 0;

  updatables: Updatable[] = [];

  constructor(timeStep: number) {
    this.timeStep = timeStep;
  }

  register(...updatables: Updatable[]) {
    this.updatables.push(...updatables);
  }

  simulate() {
    this.updatables.forEach((updatable, i) => {
      updatable.update(this.timeStep);

      // do collisions
      if (updatable instanceof RigidBody) {
        this.updatables.slice(i + 1).forEach((otherUpdatable) => {
          if (!(otherUpdatable instanceof RigidBody)) return;

          this.handleCollision(updatable, otherUpdatable);
        });
      }
    });

    this.time += this.timeStep;
  }

  private static getBoundingBox(body: RigidBody): BoundingBox {
    const boundingBoxArray = [];

    for (let i = 0; i < 3; i += 1) {
      const smallest = body.getVertices().reduce(
        (accumulator, vertex) => (vertex.get(i) < accumulator.get(i) ? vertex : accumulator),
      );
      const largest = body.getVertices().reduce(
        (accumulator, vertex) => (vertex.get(i) > accumulator.get(i) ? vertex : accumulator),
      );

      boundingBoxArray.push([smallest.get(i), largest.get(i)]);
    }

    const [[x1, x2], [y1, y2], [z1, z2]] = boundingBoxArray;
    return {
      x1, y1, z1, x2, y2, z2,
    };
  }

  private static boundingBoxesColliding(box1: BoundingBox, box2: BoundingBox) {
    const separatingWidth = box2.x2 > box1.x1 ? box2.x1 - box1.x2 : box1.x1 - box2.x2;
    const separatingHeight = box2.y2 > box1.y1 ? box2.y1 - box1.y2 : box1.y1 - box2.y2;
    const separatingDepth = box2.z2 > box1.z1 ? box2.z1 - box1.z2 : box1.z1 - box2.z2;

    return separatingWidth < 0 && separatingHeight < 0 && separatingDepth < 0;
  }

  private handleCollision(body1: RigidBody, body2: RigidBody) {
    // only do collisions between rigid bodies for now

    // don't deal with infinite masses colliding together
    if (body1.mass === Infinity && body2.mass === Infinity) return;

    const box1 = World.getBoundingBox(body1);
    const box2 = World.getBoundingBox(body2);

    // if bounding boxes are colliding, do gjk
    if (World.boundingBoxesColliding(box1, box2)) {
      const collision = new Collision(body1, body2);

      if (collision.perform()) {
        // const contactNormal = collision.getContactNormal() as Vector;
        const contactPoint = collision.getContactPoint() as Vector;
        // const penetrationDepth = collision.getPenetrationDepth() as number;

        if (body1.mass !== Infinity && body2.mass !== Infinity) {
          const finalVelocity1 = body1.velocity.multiply(body1.mass - body2.mass)
            .add(body2.velocity.multiply(2 * body2.mass))
            .divide(body1.mass + body2.mass);

          const force = finalVelocity1
            .subtract(body1.velocity)
            .multiply(body1.mass / this.timeStep);

          body1.applyForceAtPoint(force, contactPoint);
          body2.applyForceAtPoint(force.multiply(-1), contactPoint);
        } else if (body1.mass === Infinity) {
          const finalVelocity2 = body1.velocity.multiply(2).subtract(body2.velocity);

          const force = finalVelocity2
            .subtract(body2.velocity)
            .multiply(body2.mass / this.timeStep);

          body2.applyForceAtPoint(force.multiply(-1), contactPoint);
        } else if (body2.mass === Infinity) {
          const finalVelocity1 = body2.velocity.multiply(2).subtract(body1.velocity);

          const force = finalVelocity1
            .subtract(body1.velocity)
            .multiply(body1.mass / this.timeStep);

          body1.applyForceAtPoint(force, contactPoint);
        }
      }
    }
  }
}
