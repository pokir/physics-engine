import { Vector } from '../../math/vector.js';
import { RigidBody } from '../bodies/rigid_body.js';

export class Collisions {
  body1: RigidBody;

  body2: RigidBody;

  constructor(body1: RigidBody, body2: RigidBody) {
    this.body1 = body1;
    this.body2 = body2;
  }

  private support(direction: Vector) {
    // returns the farthest point of the difference of the two objects in the direction
    return this.body1.support(direction).subtract(this.body2.support(direction.multiply(-1)));
  }

  private static vectorEquals(vector1: Vector, vector2: Vector) {
    const vector2Values = vector2.getValues();
    return vector1.getValues().every((value, i) => value === vector2Values[i]);
  }

  colliding() {
    const simplex: Vector[] = [];

    // choose an arbitrary initial direction
    const initialDirection = this.body2.transform.position.subtract(this.body1.transform.position);

    // use the initial direction when simplex.length === 0
    let direction = initialDirection;

    while (true) {
      const previousDirection = direction;
      const previousPoint = simplex[simplex.length - 1];

      if (simplex.length < 4) {
        if (simplex.length === 1) {
          // next direction points from the previous point to the origin
          direction = previousPoint.multiply(-1);
        } else if (simplex.length === 2) {
          // next direction is the vector normal to the line connecting the two points
          // and pointing to the origin

          direction = previousDirection
            .cross(previousPoint.multiply(-1))
            .cross(previousDirection);

          // const lineDirection = simplex[1].subtract(simplex[0]);
          // direction = simplex[0].multiply(-1).subtract(lineDirection);
        } else if (simplex.length === 3) {
          // next direction is the vector normal to the triangle connecting the three points
          // and pointing to the origin
          const planeDirection1 = simplex[1].subtract(simplex[0]);
          const planeDirection2 = simplex[2].subtract(simplex[0]);

          direction = planeDirection1.cross(planeDirection2);

          // make sure the direction points to the origin
          if (direction.dot(simplex[0]) < 0) direction = direction.multiply(-1);
        }

        // add the farthest point in the direction to the simplex
        const nextPoint = this.support(direction);
        simplex.push(nextPoint);
        if (nextPoint.dot(direction) < 0) return false;
      } else if (simplex.length === 4) {
        // the three edges of the tetrahedron connected to the last point
        const edge1 = simplex[3].subtract(simplex[0]);
        const edge2 = simplex[3].subtract(simplex[1]);
        const edge3 = simplex[3].subtract(simplex[2]);

        // normals to each of the three triangles of the tetrahedron connected to the last point
        let triangleNormal1 = edge1.cross(edge2);
        let triangleNormal2 = edge2.cross(edge3);
        let triangleNormal3 = edge3.cross(edge1);

        // make sure the normals are pointing outwards
        const heightVector = edge1.normalize(true)
          .add(edge2.normalize(true))
          .add(edge3.normalize(true));

        if (triangleNormal1.dot(heightVector) < 0) {
          triangleNormal1 = triangleNormal1.multiply(-1);
          triangleNormal2 = triangleNormal2.multiply(-1);
          triangleNormal3 = triangleNormal3.multiply(-1);
        }

        // centers of each triangle above the base of the tetrahedron
        const triangleCenter1 = simplex[0].add(simplex[1]).add(simplex[3]).divide(3);
        const triangleCenter2 = simplex[1].add(simplex[2]).add(simplex[3]).divide(3);
        const triangleCenter3 = simplex[0].add(simplex[2]).add(simplex[3]).divide(3);

        // check if the origin is inside the tetrahedron
        if (
          triangleCenter1.dot(triangleNormal1) >= 0
          && triangleCenter2.dot(triangleNormal2) >= 0
          && triangleCenter3.dot(triangleNormal3) >= 0
        ) return true;

        const triangles = [
          [triangleNormal1, triangleCenter1],
          [triangleNormal2, triangleCenter2],
          [triangleNormal3, triangleCenter3],
        ];

        // find the direction from the closest triangle to the origin
        direction = triangleNormal1;
        let closestDotProduct = triangleNormal1.dot(triangleCenter1.multiply(-1));

        for (let i = 1; i < triangles.length; i += 1) {
          const [normal, center] = triangles[i];
          const dotProduct = normal.dot(center.multiply(-1));

          if (dotProduct < closestDotProduct) {
            direction = normal;
            closestDotProduct = dotProduct;
          }
        }

        const nextPoint = this.support(direction);

        // if the next point is already in the simplex, collision is impossible
        if (simplex.some((point) => Collisions.vectorEquals(point, nextPoint))) return false;

        // replace the correct point
        if (direction === triangleNormal1) simplex[2] = nextPoint;
        else if (direction === triangleNormal2) simplex[0] = nextPoint;
        else if (direction === triangleNormal3) simplex[1] = nextPoint;
      }
    }
  }
}
