import { World, Vector, MassPoint, Spring, DampedSpring } from '../src/index.js';


const sketch = p => {
  const world = new World();
  let point1, point2, point3, spring1, spring2, spring3;

  p.setup = () => {
    p.createCanvas(600, 600);

    point1 = new MassPoint(3000, new Vector(300, 300, 0));
    point2 = new MassPoint(3000, new Vector(400, 400, 0));
    point3 = new MassPoint(3000, new Vector(100, 500, 0));

    spring1 = new DampedSpring(10, 10, 50, point1, point2);
    spring2 = new DampedSpring(10, 10, 50, point2, point3);
    spring3 = new DampedSpring(10, 10, 50, point1, point3);

    world.registerObject(point1);
    world.registerObject(point2);
    world.registerObject(point3);
    world.registerObject(spring1);
    world.registerObject(spring2);
    world.registerObject(spring3);
  };

  p.draw = () => {
    p.background(51);

    p.noStroke();

    p.fill(255, 0, 0);
    p.ellipse(point1.position.get(0), point1.position.get(1), 30);

    p.fill(0, 255, 0);
    p.ellipse(point2.position.get(0), point2.position.get(1), 30);

    p.fill(0, 0, 255);
    p.ellipse(point3.position.get(0), point3.position.get(1), 30);

    world.simulate();
  };
};

new p5(sketch, document.getElementsByTagName('main')[0]);
