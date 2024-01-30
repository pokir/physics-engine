import { Vector } from '../vector.js';
import { OrdinaryDifferentialEquationSolver } from './ordinary_differential_equation_solver';

export const forwardEulerMethod: OrdinaryDifferentialEquationSolver = (
  lastValue: Vector,
  lastTime: number,
  deltaTime: number,
  derivativeFunction: (time: number, value: Vector) => Vector,
) => (
  lastValue.add(derivativeFunction(lastTime, lastValue).multiply(deltaTime))
);
