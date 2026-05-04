import { Car } from './car.model';
import { CompositeEngine } from './composite/classes/composite-engine';
import { OilPan, EngineBlock, AirFilter } from './composite';
import { CarPickedState } from '.';

export class Sedan extends Car {

  constructor() {
    super();
    this.speed = 25;
    this.imgTag = new Image();
    this.imgTag.src = "../assets/carsyGreen.webp";
    this.state = new CarPickedState();
    this.compositeEngine = new CompositeEngine();
    this.compositeEngine.addAutoPart(new OilPan());
    this.compositeEngine.addAutoPart(new EngineBlock());
    this.compositeEngine.addAutoPart(new AirFilter());
  }

  public getCarSpeed(): string {
    return '{Soy Sedan voy hasta 180km/h}';
  }
}
