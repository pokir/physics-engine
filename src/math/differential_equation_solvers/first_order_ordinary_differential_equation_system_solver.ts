import { Vector } from '../vector.js';

export type FirstOrderOrdinaryDifferentialEquationSystemSolver<n extends number> = (
  // every variable in the last state
  lastState: Vector[] & { length: n },
  lastTime: number,
  deltaTime: number,
  // the derivative function for each variable in function of time and every other variable
  derivativeFunctions: (
    (time: number, state: Vector[] & { length: n }) => Vector
  )[] & { length: n },
  // return the next state (next value of every variable)
) => Vector[] & { length: n };
