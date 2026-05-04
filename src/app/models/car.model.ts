import { CompositeEngine } from "./composite/classes/composite-engine";
import { CarState } from "./state/car-state.model";
import { CarPickedState } from "./state/car-picked-state.model";

export abstract class Car {
  speed!: number;
  imgTag!: any;
  compositeEngine!: CompositeEngine;
  _state!: CarState;

  set state(state: CarState) {
    this._state = state;
  }

  get state(): CarState {
    return this._state;
  }

  abstract getCarSpeed(): string;

  getCarPrice(): string {
    return `The actual cost of the car is $: ${this.compositeEngine.getAutoPartPrice()}`;
  }

  clone(): Car {
    const copy = Object.create(Object.getPrototypeOf(this));
    Object.assign(copy, this);
    copy.state = new CarPickedState();
    return copy;
  }
}
