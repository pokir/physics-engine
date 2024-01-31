import { FirstOrderOrdinaryDifferentialEquationSystemSolver } from './first_order_ordinary_differential_equation_system_solver.js';

export const semiImplicitEulerMethod:
  FirstOrderOrdinaryDifferentialEquationSystemSolver<2> = (
    lastState,
    lastTime,
    deltaTime,
    derivativeFunctions,
  ) => {
    const [x, y] = lastState;
    const nextY = y.add(derivativeFunctions[1](lastTime, lastState).multiply(deltaTime));
    const nextX = x.add(derivativeFunctions[0](lastTime, [x, nextY]).multiply(deltaTime));
    return [nextX, nextY];
  };
