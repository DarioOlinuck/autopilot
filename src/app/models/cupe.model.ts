import { Car } from './car.model';
import { CompositeEngine } from './composite/classes/composite-engine';
import { OilPan, EngineBlock, AirFilter, Turbo } from './composite';
import { CarPickedState } from '.';

export class Cupe extends Car {

  constructor() {
    super();
    this.speed = 35;
    this.imgTag = new Image();
    this.imgTag.src = "../assets/cupeGreen.webp";
    this.state = new CarPickedState();
    this.compositeEngine = new CompositeEngine();
    this.compositeEngine.addAutoPart(new OilPan());
    this.compositeEngine.addAutoPart(new EngineBlock());
    this.compositeEngine.addAutoPart(new AirFilter());
    this.compositeEngine.addAutoPart(new Turbo());
  }

  public getCarSpeed(): string {
    return '{Soy Cupé voy hasta 220km/h}';
  }
}
