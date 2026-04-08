import { CompositeEngine } from "./composite/classes/composite-engine";
import { CarState } from "./state/car-state.model";

export interface Car {
  speed: number;
  imgTag: any;
  compositeEngine:CompositeEngine;
  state :CarState;
  getCarSpeed(): string;
  getCarPrice(): string;
}
