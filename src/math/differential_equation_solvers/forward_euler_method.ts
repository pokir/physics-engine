import { FirstOrderOrdinaryDifferentialEquationSystemSolver } from './first_order_ordinary_differential_equation_system_solver.js';

export const forwardEulerMethod:
  FirstOrderOrdinaryDifferentialEquationSystemSolver<number> = (
    lastState,
    lastTime,
    deltaTime,
    derivativeFunctions,
  ) => lastState.map((lastValue, i) => lastValue.add(
    derivativeFunctions[i](lastTime, lastState)
      .multiply(deltaTime),
  ));
