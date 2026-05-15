import { Injectable } from '@angular/core';
import { Car } from '../models/car.model';
import { FallingObject } from '../models/flyweight/falling-object.model';
import { removeGreenBackground } from '../helpers/canvas.helper';

@Injectable({ providedIn: 'root' })
export class RendererService {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private carOffscreen!: HTMLCanvasElement;

  bindMainCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  get maxWidth(): number {
    return this.canvas.width;
  }

  prepareCar(car: Car): void {
    this.carOffscreen = removeGreenBackground(car.imgTag);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCar(x: number, y: number): void {
    this.ctx.drawImage(this.carOffscreen, x, y);
  }

  drawFallingObject(obj: FallingObject): void {
    obj.draw(this.ctx);
  }
}
