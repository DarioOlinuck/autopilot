import {Car} from './car.model';
import { OilPan, EngineBlock, AirFilter } from './composite';
import { CompositeEngine } from './composite/classes/composite-engine';
import { CarPickedState } from '.';
import { CarState } from './state/car-state.model';

export class Sedan implements Car {
  speed;
  imgTag;
  compositeEngine: CompositeEngine;
  _state:CarState;

  set state(state: CarState) {
    this._state = state
  }

  get state() {
    return this._state;
  }
  
  constructor() {
    this.speed = 25;
    this.imgTag = new Image();
    this.imgTag.src = "../assets/carsyGreen.jpg";
    this.state = new CarPickedState();
    this.compositeEngine = new CompositeEngine();
    this.compositeEngine.addAutoPart(new OilPan())
    this.compositeEngine.addAutoPart(new EngineBlock())
    this.compositeEngine.addAutoPart(new AirFilter())
  }
  public getCarPrice(): string {
    return `The actual cost of the car is $: ${this.compositeEngine.getAutoPartPrice()}`;
  }

  public getCarSpeed(): string {
    return '{Soy Sedan voy hasta 180km/h}';
  }
}
