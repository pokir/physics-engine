import { Vector } from '../vector.js';
import { FirstOrderOrdinaryDifferentialEquationSystemSolver } from './first_order_ordinary_differential_equation_system_solver.js';

export const forwardEulerMethod:
  FirstOrderOrdinaryDifferentialEquationSystemSolver = <n extends number>(
    lastState: Vector[] & { length: n },
    lastTime: number,
    deltaTime: number,
    derivativeFunctions: (
    (time: number, state: Vector[] & { length: n }) => Vector
  )[] & { length: n },
  ) => lastState.map((lastValue, i) => lastValue.add(
    derivativeFunctions[i](lastTime, lastState)
      .multiply(deltaTime),
  )) as Vector[] & { length: n };
