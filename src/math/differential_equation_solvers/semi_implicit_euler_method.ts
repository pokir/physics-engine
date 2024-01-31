import { Vector } from '../vector.js';
import { FirstOrderOrdinaryDifferentialEquationSystemSolver } from './first_order_ordinary_differential_equation_system_solver.js';

export const semiImplicitEulerMethod:
  FirstOrderOrdinaryDifferentialEquationSystemSolver<2> = (
    lastState: Vector[] & { length: 2 },
    lastTime: number,
    deltaTime: number,
    derivativeFunctions: (
    (time: number, state: Vector[] & { length: 2 }) => Vector
  )[] & { length: 2 },
  ) => {
    const [x, y] = lastState;
    const nextY = y.add(derivativeFunctions[1](lastTime, lastState).multiply(deltaTime));
    const nextX = x.add(derivativeFunctions[0](lastTime, [x, nextY]).multiply(deltaTime));
    return [nextX, nextY];
  };
