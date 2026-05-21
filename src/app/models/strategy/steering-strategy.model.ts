import { FallingObject } from '../flyweight/falling-object.model';

export interface SteeringContext {
  carYAxis: number;
  carFixedX: number;
  obstacles: FallingObject[];
  canvasHeight: number;
}

export interface SteeringStrategy {
  readonly name: string;
  decideSteer(ctx: SteeringContext): number;
}
