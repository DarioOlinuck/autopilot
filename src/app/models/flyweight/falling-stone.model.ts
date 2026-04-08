import {FlyweightStone} from './flyweight-stone.model';

export class FallingStone {

    x: number;
    speed: number;
    baseStone:FlyweightStone;

    constructor(stone:FlyweightStone, xPosition: number, speed: number) {

        this.x = xPosition;
        this.speed = speed;
        this.baseStone = stone;
    }
}