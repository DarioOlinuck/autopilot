import {Car} from '../car.model';

export abstract class CarFactory {

  public abstract createCar(): Car;

  public getCarSpeedMessage(): string {
    const aCar = this.createCar();
    return `Same car factory, this car with speed: ${aCar.getCarSpeed()}`;
  }
}