import { SteeringContext, SteeringStrategy } from './steering-strategy.model';

const LOOKAHEAD_PX = 500;
const STEP_PX = 6;
const VERTICAL_THREAT_PADDING = 60;
const CAR_HALF_HEIGHT = 30;

export class DodgeNearestStrategy implements SteeringStrategy {
  readonly name = 'Dodge nearest';

  decideSteer(ctx: SteeringContext): number {
    const carCenterY = ctx.carYAxis + CAR_HALF_HEIGHT;

    let nearest = null;
    let nearestDx = Number.POSITIVE_INFINITY;

    for (const obj of ctx.obstacles) {
      const dx = obj.x - ctx.carFixedX;
      if (dx <= 0 || dx > LOOKAHEAD_PX) continue;
      const objCenterY = obj.y + obj.height / 2;
      if (Math.abs(objCenterY - carCenterY) > VERTICAL_THREAT_PADDING) continue;
      if (dx < nearestDx) {
        nearestDx = dx;
        nearest = obj;
      }
    }

    if (!nearest) return 0;

    const objCenterY = nearest.y + nearest.height / 2;
    return objCenterY < carCenterY ? STEP_PX : -STEP_PX;
  }
}
