import { SteeringContext, SteeringStrategy } from './steering-strategy.model';

const FREQUENCY = 0.1;
const AMPLITUDE = 5;

export class WeavingStrategy implements SteeringStrategy {
  readonly name = 'Weave';

  private tick = 0;

  decideSteer(_ctx: SteeringContext): number {
    this.tick += 1;
    return Math.sin(this.tick * FREQUENCY) * AMPLITUDE;
  }
}
