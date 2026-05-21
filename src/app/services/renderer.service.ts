import { Injectable } from '@angular/core';
import { Car } from '../models/car.model';
import { FallingObject } from '../models/flyweight/falling-object.model';
import { removeGreenBackground } from '../helpers/canvas.helper';

const ASPHALT_COLOR = '#333';
const LANE_LINE_COLOR = '#f0f0f0';
const SHOULDER_STRIPE_COLOR = '#ffd166';
const SKY_COLOR = '#87ceeb';
const GRASS_COLOR = '#3a8a3a';
const SKY_HEIGHT = 60;
const GRASS_HEIGHT = 100;
const STRIPE_PERIOD = 80;
const DASH_LENGTH = 40;
const SHOULDER_HEIGHT = 6;
const CENTER_LINE_HEIGHT = 6;

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

  get maxHeight(): number {
    return this.canvas.height;
  }

  prepareCar(car: Car): void {
    this.carOffscreen = removeGreenBackground(car.imgTag);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground(offset: number): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const tarmacTop = SKY_HEIGHT;
    const tarmacBottom = h - GRASS_HEIGHT;

    this.ctx.fillStyle = SKY_COLOR;
    this.ctx.fillRect(0, 0, w, SKY_HEIGHT);

    this.ctx.fillStyle = ASPHALT_COLOR;
    this.ctx.fillRect(0, tarmacTop, w, tarmacBottom - tarmacTop);

    this.ctx.fillStyle = GRASS_COLOR;
    this.ctx.fillRect(0, tarmacBottom, w, GRASS_HEIGHT);

    this.ctx.fillStyle = SHOULDER_STRIPE_COLOR;
    this.ctx.fillRect(0, tarmacTop, w, SHOULDER_HEIGHT);
    this.ctx.fillRect(0, tarmacBottom - SHOULDER_HEIGHT, w, SHOULDER_HEIGHT);

    const centerY = (tarmacTop + tarmacBottom - CENTER_LINE_HEIGHT) / 2;
    const shift = offset % STRIPE_PERIOD;
    this.ctx.fillStyle = LANE_LINE_COLOR;
    for (let x = -shift; x < w; x += STRIPE_PERIOD) {
      this.ctx.fillRect(x, centerY, DASH_LENGTH, CENTER_LINE_HEIGHT);
    }
  }

  drawCar(x: number, y: number): void {
    this.ctx.drawImage(this.carOffscreen, x, y);
  }

  drawFallingObject(obj: FallingObject): void {
    obj.draw(this.ctx);
  }
}
