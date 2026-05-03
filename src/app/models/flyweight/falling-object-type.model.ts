export abstract class FallingObjectType {
  abstract readonly terminalVelocity: number;
  abstract readonly width: number;
  abstract readonly height: number;
  abstract draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
}

export class StaticFallingObjectType extends FallingObjectType {
  private readonly image = new Image();

  constructor(
    src: string,
    readonly terminalVelocity: number,
    readonly width: number,
    readonly height: number,
  ) {
    super();
    this.image.src = src;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.drawImage(this.image, x, y);
  }
}
