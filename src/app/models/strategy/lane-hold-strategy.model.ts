import { SteeringContext, SteeringStrategy } from './steering-strategy.model';

const CENTER_Y = 300;
const STEP_PX = 3;
const EPSILON = 2;

export class LaneHoldStrategy implements SteeringStrategy {
  readonly name = 'Hold lane';

  decideSteer(ctx: SteeringContext): number {
    const diff = CENTER_Y - ctx.carYAxis;
    if (Math.abs(diff) < EPSILON) return 0;
    return diff > 0 ? STEP_PX : -STEP_PX;
  }
}
