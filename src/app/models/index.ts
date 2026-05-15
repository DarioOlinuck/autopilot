import { SedanFactory } from './factory/sedan-factory.model';
import { CupeFactory } from './factory/cupe-factory.model'
import { Car } from './car.model';
import { Weather } from './weather.model';
import { CarState } from './state/car-state.model';
import { CarOnAutopilot } from './state/car-on-autopilot-state.model';
import { CarPickedState } from './state/car-picked-state.model';
import { CarStartedState } from './state/car-started-state.model';
import { FallingObject } from './flyweight/falling-object.model';
import { FallingObjectType } from './flyweight/falling-object-type.model';
import { FallingObjectFactory } from './flyweight/falling-object-factory.model';
import { Command } from './command/command.model';
import { CommandInvoker } from './command/command-invoker.model';
import { PickCarCommand } from './command/pick-car.command';
import { StartRaceCommand } from './command/start-race.command';
import { ToggleAutopilotCommand } from './command/toggle-autopilot.command';
import { TurnLeftCommand } from './command/turn-left.command';
import { TurnRightCommand } from './command/turn-right.command';

export {
    SedanFactory,
    CupeFactory,
    Car,
    Weather,
    CarState,
    CarPickedState,
    CarOnAutopilot,
    CarStartedState,
    FallingObject,
    FallingObjectType,
    FallingObjectFactory,
    Command,
    CommandInvoker,
    PickCarCommand,
    StartRaceCommand,
    ToggleAutopilotCommand,
    TurnLeftCommand,
    TurnRightCommand
}

export const ALL: any[] = [
    SedanFactory,
    CupeFactory,
    Weather,
    CarPickedState,
    CarOnAutopilot,
    CarStartedState,
    FallingObject]
