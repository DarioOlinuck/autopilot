import { Sedan } from '../sedan.model';
import {Car} from '../car.model';
import { CarFactory } from './car-factory.model';
import { CarPickedState } from '../state/car-picked-state.model';


export class SedanFactory extends CarFactory {
  public  createCar(): Car {
    let car =  new Sedan();
    car.state = new CarPickedState()
    return car;
  }
}