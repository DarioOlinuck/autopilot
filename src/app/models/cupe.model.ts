import {Car} from './car.model';
import { CompositeEngine } from './composite/classes/composite-engine';
import {
OilPan,
EngineBlock,
AirFilter, 
Turbo} from './composite';
import { CarState } from './state/car-state.model';
import { CarPickedState } from '.';

export class Cupe implements Car {

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
    this.speed = 35;
    this.imgTag = new Image();
    this.imgTag.src = "../assets/cupeGreen.webp";
    this.state = new CarPickedState();
    this.compositeEngine = new CompositeEngine();
    this.compositeEngine.addAutoPart(new OilPan())
    this.compositeEngine.addAutoPart(new EngineBlock())
    this.compositeEngine.addAutoPart(new AirFilter())
    this.compositeEngine.addAutoPart(new Turbo());  
  }

  public getCarSpeed(): string {
    return '{Soy Cupé voy hasta 220km/h}';
  }

  public getCarPrice(): string {
    return `The actual cost of the car is $: ${this.compositeEngine.getAutoPartPrice()}`;
  }
}
