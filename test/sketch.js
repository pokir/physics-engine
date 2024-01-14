const world = new World();
let node1, node2;


function setup() {
  createCanvas(600, 600);

  node1 = new MassPoint(3000, new Vector(300, 300, 0));
  node2 = new MassPoint(3000, new Vector(400, 400, 0));

  spring = new Spring(5, 110, node1, node2);

  world.registerObject(node1);
  world.registerObject(node2);
  world.registerObject(spring);
}

function draw() {
  background(51);

  fill(255, 0, 0);
  noStroke();

  ellipse(node1.position.get(0), node1.position.get(1), 50);
  ellipse(node2.position.get(0), node2.position.get(1), 50);

  world.simulate();
}
