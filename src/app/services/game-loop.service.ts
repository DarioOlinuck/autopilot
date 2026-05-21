import { Injectable, inject } from '@angular/core';
import {
  Car,
  CarOnAutopilot,
  CarPickedState,
  CarStartedState,
  CupeFactory,
  DodgeNearestStrategy,
  FallingObject,
  FallingObjectFactory,
  FallingObjectType,
  ManualSteering,
  SedanFactory,
  SteeringStrategy,
} from '../models';
import { RendererService } from './renderer.service';
import { CollisionService } from './collision.service';

const TICK_MS = 50;
const TURN_STEP = 30;
const INITIAL_CAR_Y = 300;
const CAR_FIXED_X = 100;
const ROUND_DURATION_MS = 60_000;
const SPAWN_MIN_MS = 600;
const SPAWN_MAX_MS = 1400;
const OBSTACLE_TOP_MIN = 0;
const OBSTACLE_TOP_MAX = 120;
const MIN_Y = 60;
const MAX_Y = 540;

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

@Injectable({ providedIn: 'root' })
export class GameLoopService {
  private renderer = inject(RendererService);
  private collision = inject(CollisionService);

  car?: Car;
  fallingObjects: FallingObject[] = [];

  private cachedSedan?: Car;
  private cachedCupe?: Car;
  private carYAxis = 0;
  private bgOffset = 0;
  private roundStartAt = 0;
  private roundEndedAt: number | null = null;
  private tickInterval: any;
  private spawnTimeout: any;
  private activeStrategy: SteeringStrategy = new ManualSteering();
  private autopilotChoice: SteeringStrategy = new DodgeNearestStrategy();

  get timeRemainingSec(): number {
    if (!this.roundStartAt) return 0;
    const referenceTime = this.roundEndedAt ?? Date.now();
    const remaining = ROUND_DURATION_MS - (referenceTime - this.roundStartAt);
    return Math.max(0, Math.ceil(remaining / 1000));
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

  setAutopilotChoice(strategy: SteeringStrategy): void {
    this.autopilotChoice = strategy;
    if (!(this.activeStrategy instanceof ManualSteering)) {
      this.activeStrategy = strategy;
    }
  }

  toggleAutopilot(): void {
    this.activeStrategy = this.activeStrategy instanceof ManualSteering
      ? this.autopilotChoice
      : new ManualSteering();
  }

  start(): void {
    if (this.car == null) {
      alert('please select a car!!!');
      return;
    }

    this.car.state = new CarStartedState();
    this.carYAxis = INITIAL_CAR_Y;
    this.bgOffset = 0;
    this.fallingObjects = [];
    this.roundStartAt = Date.now();
    this.roundEndedAt = null;
    this.renderer.prepareCar(this.car);

    this.tickInterval = setInterval(() => this.tick(), TICK_MS);
    this.scheduleNextSpawn();
  }

  private tick(): void {
    const speed = this.car!.speed;

    this.renderer.clear();
    this.renderer.drawBackground(this.bgOffset);

    this.fallingObjects = this.fallingObjects.filter(obj => {
      obj.x -= speed;
      obj.y += obj.speed;
      return obj.x + obj.width > 0;
    });

    for (const obj of this.fallingObjects) {
      this.renderer.drawFallingObject(obj);
      if (this.collision.collides(CAR_FIXED_X, this.carYAxis, obj)) {
        alert('Craaashh');
        this.resetRace();
        return;
      }
    }

    const delta = this.activeStrategy.decideSteer({
      carYAxis: this.carYAxis,
      carFixedX: CAR_FIXED_X,
      obstacles: this.fallingObjects,
      canvasHeight: this.renderer.maxHeight,
    });
    this.carYAxis = clamp(this.carYAxis + delta, MIN_Y, MAX_Y);

    this.renderer.drawCar(CAR_FIXED_X, this.carYAxis);
    this.bgOffset += speed;

    if (Date.now() - this.roundStartAt >= ROUND_DURATION_MS) {
      this.endRound();
    }
  }

  private scheduleNextSpawn(): void {
    const delay = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
    this.spawnTimeout = setTimeout(() => {
      this.spawnObstacle();
      this.scheduleNextSpawn();
    }, delay);
  }

  private spawnObstacle(): void {
    const types: FallingObjectType[] = [
      FallingObjectFactory.getStone(),
      FallingObjectFactory.getLog(),
      FallingObjectFactory.getChicken(),
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const startY = OBSTACLE_TOP_MIN + Math.random() * (OBSTACLE_TOP_MAX - OBSTACLE_TOP_MIN);
    const obj = new FallingObject(this.renderer.maxWidth, type);
    obj.y = startY;
    this.fallingObjects.push(obj);
  }

  private endRound(): void {
    this.roundEndedAt = Date.now();
    this.stopTimers();
    this.fallingObjects = [];
    this.renderer.clear();
    this.renderer.drawBackground(0);
    if (this.car) {
      this.car.state = new CarPickedState();
    }
  }

  private resetRace(): void {
    this.roundEndedAt = Date.now();
    this.stopTimers();
    this.fallingObjects = [];
    this.renderer.clear();
    this.renderer.drawBackground(0);
  }

  private stopTimers(): void {
    clearInterval(this.tickInterval);
    clearTimeout(this.spawnTimeout);
  }
}
