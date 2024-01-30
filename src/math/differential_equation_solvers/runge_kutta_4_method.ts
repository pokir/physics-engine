import { Vector } from '../vector.js';
import { OrdinaryDifferentialEquationSolver } from './ordinary_differential_equation_solver';

export const rungeKutta4Method: OrdinaryDifferentialEquationSolver = (
  lastValue: Vector,
  lastTime: number,
  deltaTime: number,
  derivativeFunction: (time: number, value: Vector) => Vector,
) => {
  const k1 = derivativeFunction(lastTime, lastValue);
  const k2 = derivativeFunction(lastTime + deltaTime / 2, lastValue.add(k1.divide(2)));
  const k3 = derivativeFunction(lastTime + deltaTime / 2, lastValue.add(k2.divide(2)));
  const k4 = derivativeFunction(lastTime + deltaTime, lastValue.add(k3));

  return lastValue.add(
    k1.divide(6)
      .add(k2.divide(3))
      .add(k3.divide(3))
      .add(k4.divide(6))
      .multiply(deltaTime),
  );
};
