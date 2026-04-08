import { CarState } from "./car-state.model";

export class CarOnAutopilot implements CarState{

    stateName = "On Autopilot";
    react(): void {
       alert("should turn by itself, or break")
    }

}