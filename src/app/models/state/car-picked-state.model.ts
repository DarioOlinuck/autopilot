import { CarState } from "./car-state.model";

export class CarPickedState implements CarState {

    stateName = "Picked";
    react(): void {
       alert("needs to do nothing")
    }

}