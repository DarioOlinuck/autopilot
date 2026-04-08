import { Cupe } from '../cupe.model';
import {Car} from '../car.model';
import { CarFactory } from './car-factory.model';
import { CarPickedState } from '../state/car-picked-state.model';

export class CupeFactory extends CarFactory {
  public createCar(): Car {
    let car =  new Cupe();
    car.state = new CarPickedState()
    return car;
  }
}