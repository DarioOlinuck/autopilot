import { FallingObjectType } from './falling-object-type.model';

export class FallingObject {
  y = 0;

  constructor(
    public x: number,
    readonly type: FallingObjectType,
  ) {}

  get speed(): number { return this.type.terminalVelocity; }
  get width(): number { return this.type.width; }
  get height(): number { return this.type.height; }

  draw(ctx: CanvasRenderingContext2D): void {
    this.type.draw(ctx, this.x, this.y);
  }
}
