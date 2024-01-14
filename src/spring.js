class Spring {
  constructor(stiffness, restLength, massPoint1, massPoint2) {
    if (isNaN(stiffness))
      throw new Error('not a number');

    if (isNaN(restLength))
      throw new Error('not a number');

    this.stiffness = stiffness;
    this.restLength = restLength;
    this.massPoint1 = massPoint1;
    this.massPoint2 = massPoint2;
  }

  update(dt) {
    const displacement = this.massPoint2.position.sub(this.massPoint1.position);
    const lengthDifference = displacement.getNorm() - this.restLength;
    console.log(displacement.getNorm());

    const force = displacement
      .normalize()
      .multiply(this.stiffness * lengthDifference);

    this.massPoint1.applyForce(force);
    this.massPoint2.applyForce(force.multiply(-1));
  }
}
