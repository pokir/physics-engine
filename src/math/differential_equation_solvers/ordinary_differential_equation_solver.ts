import { Vector } from '../vector.js';

export type OrdinaryDifferentialEquationSolver = (
    lastValue: Vector,
    lastTime: number,
    deltaTime: number,
    derivativeFunction: (time: number, value: Vector,) => Vector
) => Vector;
