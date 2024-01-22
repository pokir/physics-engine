import { Vector } from '../../math/vector.js';
import { MassPoint } from '../points/mass_point.js';
import { DampedSpring } from '../springs/damped_spring.js';
import { Spring } from '../springs/spring.js';
import { Transform } from '../transform.js';

export class SoftBody {
  points: MassPoint[];

  connections: Spring[];

  constructor(points: MassPoint[], connections: Spring[]) {
    this.points = points;
    this.connections = connections;
  }

  static createLine(
    length: number,
    massPerPoint: number,
    stiffness: number,
    damping: number,
  ) {
    const point1 = new MassPoint(new Transform(new Vector(-length / 2, 0, 0)), massPerPoint);
    const point2 = new MassPoint(new Transform(new Vector(length / 2, 0, 0)), massPerPoint);

    const spring = new DampedSpring(stiffness, damping, length, point1, point2);

    return new SoftBody([point1, point2], [spring]);
  }

  static createSphere(
    radius: number,
    detail: number,
    massPerPoint: number,
    stiffness: number,
    damping: number,
  ) {
    // TODO: fix
    const points = [];
    const connections = [];

    const step = (2 * radius) / detail;
    const arcLength = Math.PI * step;

    for (let y = -radius; y <= radius; y += step) {
      const currentRadius = Math.sqrt((radius ** 2 - Math.abs(y) ** 2));
      const currentPerimeter = 2 * Math.PI * currentRadius;
      const numPoints = currentPerimeter / arcLength;
      const angle = arcLength / currentRadius;

      for (let i = 0; i < numPoints; i += 1) {
        const currentAngle = angle * i;

        const x = Math.sin(currentAngle) * currentRadius;
        const z = Math.cos(currentAngle) * currentRadius;

        points.push(new MassPoint(new Transform(new Vector(x, y, z)), massPerPoint));
      }
    }

    for (let i = 0; i < points.length - 1; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const distance = points[j].transform.position
          .subtract(points[i].transform.position)
          .getNorm();

        connections.push(new DampedSpring(stiffness, damping, distance, points[i], points[j]));
      }
    }

    return new SoftBody(points, connections);
  }

  static createCube(sideLength: number, massPerPoint: number, stiffness: number, damping: number) {
    const positions = [
      new Vector(-1, -1, -1),
      new Vector(-1, -1, 1),
      new Vector(-1, 1, -1),
      new Vector(-1, 1, 1),
      new Vector(1, -1, -1),
      new Vector(1, -1, 1),
      new Vector(1, 1, -1),
      new Vector(1, 1, 1),
    ];

    const points = positions.map((position) => (
      new MassPoint(new Transform(position.multiply(sideLength / 2)), massPerPoint)
    ));

    const sides = [
      // sides
      [0, 1],
      [0, 2],
      [0, 4],
      [7, 3],
      [7, 5],
      [7, 6],
      [1, 3],
      [1, 5],
      [4, 5],
      [4, 6],
      [2, 3],
      [2, 6],

      // face diagonals
      [0, 3],
      [1, 7],
      [5, 6],
      [4, 2],
      [1, 4],
      [2, 7],

      // inner diagonals
      [0, 7],
      [1, 6],
      [2, 5],
      [3, 4],
    ];

    const connections = [];

    connections.push(...sides.map(([i, j]) => {
      const distance = points[i].transform.position
        .subtract(points[j].transform.position)
        .getNorm();

      return new DampedSpring(stiffness, damping, distance, points[i], points[j]);
    }));

    return new SoftBody(points, connections);
  }
}
