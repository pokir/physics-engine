import { Vector } from '../vector.js';
import { FirstOrderOrdinaryDifferentialEquationSystemSolver } from './first_order_ordinary_differential_equation_system_solver.js';

export const rungeKutta4Method:
  FirstOrderOrdinaryDifferentialEquationSystemSolver = <n extends number>(
    lastState: Vector[] & { length: n },
    lastTime: number,
    deltaTime: number,
    derivativeFunctions: (
    (time: number, state: Vector[] & { length: n }) => Vector
  )[] & { length: n },
  ) => {
    const k1s: Vector[] = [];
    const k2s: Vector[] = [];
    const k3s: Vector[] = [];
    const k4s: Vector[] = [];

    derivativeFunctions.forEach((derivativeFunction) => {
      const k1 = derivativeFunction(lastTime, lastState);

      k1s.push(k1);
    });

    derivativeFunctions.forEach((derivativeFunction) => {
      const k2 = derivativeFunction(
        lastTime + deltaTime / 2,
        lastState.map(
          (lastValue, i) => lastValue.add(k1s[i].divide(2).multiply(deltaTime)),
        ) as Vector[] & { length: n },
      );

      k2s.push(k2);
    });

    derivativeFunctions.forEach((derivativeFunction) => {
      const k3 = derivativeFunction(
        lastTime + deltaTime / 2,
        lastState.map(
          (lastValue, i) => lastValue.add(k2s[i].divide(2).multiply(deltaTime)),
        ) as Vector[] & { length: n },
      );

      k3s.push(k3);
    });

    derivativeFunctions.forEach((derivativeFunction) => {
      const k4 = derivativeFunction(
        lastTime + deltaTime,
        lastState.map(
          (lastValue, i) => lastValue.add(k3s[i].multiply(deltaTime)),
        ) as Vector[] & { length: n },
      );

      k4s.push(k4);
    });

    return lastState.map((lastValue, i) => lastValue.add(
      k1s[i].divide(6)
        .add(k2s[i].divide(3))
        .add(k3s[i].divide(3))
        .add(k4s[i].divide(6))
        .multiply(deltaTime),
    )) as Vector[] & { length: n };
  };
