import { Injectable, inject } from '@angular/core';
import {
  Car,
  CarOnAutopilot,
  CarPickedState,
  CarStartedState,
  CupeFactory,
  FallingObject,
  FallingObjectFactory,
  SedanFactory,
} from '../models';
import { RendererService } from './renderer.service';
import { CollisionService } from './collision.service';

const TICK_MS = 50;
const TURN_STEP = 30;
const INITIAL_CAR_Y = 300;
const CAR_RIGHT_MARGIN = 100;

@Injectable({ providedIn: 'root' })
export class GameLoopService {
  private renderer = inject(RendererService);
  private collision = inject(CollisionService);

  car?: Car;
  fallingObjects: FallingObject[] = [];

  private cachedSedan?: Car;
  private cachedCupe?: Car;
  private carXAxis!: number;
  private carYAxis = 0;
  private carInterval: any;
  private fallingObjectIntervals: any[] = [];

  setFallingObjects(objects: FallingObject[]): void {
    this.fallingObjects = objects;
  }

  pickCar(carType: string): void {
    switch (carType) {
      case 'sedan':
        this.cachedSedan ??= new SedanFactory().createCar();
        this.car = this.cachedSedan.clone();
        break;
      case 'cupe':
        this.cachedCupe ??= new CupeFactory().createCar();
        this.car = this.cachedCupe.clone();
        break;
    }
  }

  setCarState(): void {
    if (!this.car) return;
    if (this.car.state instanceof CarPickedState) {
      this.car.state = new CarOnAutopilot();
    } else if (this.car.state instanceof CarStartedState) {
      alert('Can not change state on a running car');
    } else {
      this.car.state = new CarPickedState();
    }
  }

  turnLeft(): void {
    this.carYAxis -= TURN_STEP;
  }

  turnRight(): void {
    this.carYAxis += TURN_STEP;
  }

  start(): void {
    if (this.car == null) {
      alert('please select a car!!!');
      return;
    }

    this.car.state = new CarStartedState();
    this.initPosition();
    this.renderer.prepareCar(this.car);

    this.carInterval = setInterval(() => {
      this.renderer.clear();
      this.renderer.drawCar(this.carXAxis, this.carYAxis);
      this.carXAxis += this.car!.speed;

      if (this.timeOut()) {
        clearInterval(this.carInterval);
        this.car!.state = new CarPickedState();
      }
    }, TICK_MS);

    this.fallingObjects.forEach((obj, i) => {
      this.fallingObjectIntervals[i] = setInterval(() => {
        this.renderer.drawFallingObject(obj);
        obj.y += obj.speed;
        if (this.collision.collides(this.carXAxis, this.carYAxis, obj)) {
          alert('Craaashh');
          this.resetRace();
        }
        if (this.timeOut()) {
          clearInterval(this.fallingObjectIntervals[i]);
        }
      }, TICK_MS);
    });
  }

  private resetRace(): void {
    clearInterval(this.carInterval);
    this.fallingObjectIntervals.forEach(id => clearInterval(id));
  }

  private timeOut(): boolean {
    return this.carXAxis >= this.renderer.maxWidth - this.car!.imgTag.width - CAR_RIGHT_MARGIN;
  }

  private initPosition(): void {
    this.carXAxis = 0;
    this.carYAxis = INITIAL_CAR_Y;
    this.fallingObjects.forEach(obj => (obj.y = 0));
  }
}
