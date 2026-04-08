import { SedanFactory } from './factory/sedan-factory.model';
import { CupeFactory } from './factory/cupe-factory.model'
import { Car } from './car.model';
import { Weather } from './weather.model';
import { CarState } from './state/car-state.model';
import { CarOnAutopilot } from './state/car-on-autopilot-state.model';
import { CarPickedState } from './state/car-picked-state.model';
import { CarStartedState } from './state/car-started-state.model';
import { FlyweightStone } from './flyweight/flyweight-stone.model';

export {
    SedanFactory,
    CupeFactory,
    Car,
    Weather,
    CarState,
    CarPickedState,
    CarOnAutopilot,
    CarStartedState,
    FlyweightStone
}

export const ALL: any[] = [
    SedanFactory,
    CupeFactory,
    Weather,
    CarPickedState,
    CarOnAutopilot,
    CarStartedState, 
    FlyweightStone]
