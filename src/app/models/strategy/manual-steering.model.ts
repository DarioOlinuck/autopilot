import { SteeringContext, SteeringStrategy } from './steering-strategy.model';

export class ManualSteering implements SteeringStrategy {
  readonly name = 'Manual';

  decideSteer(_ctx: SteeringContext): number {
    return 0;
  }
}
