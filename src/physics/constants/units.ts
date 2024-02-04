export class Units {
  static METER = 1;

  static SECOND = 1;

  static KILOGRAM = 1;

  static NEWTON = Units.KILOGRAM * (Units.METER / (Units.SECOND ** 2));

  static HERTZ = 1 / Units.SECOND;
}
