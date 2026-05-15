import { Injectable } from '@angular/core';
import { FallingObject } from '../models/flyweight/falling-object.model';

const CAR_HITBOX_WIDTH = 80;
const CAR_HITBOX_HEIGHT = 40;

@Injectable({ providedIn: 'root' })
export class CollisionService {
  collides(carX: number, carY: number, obj: FallingObject): boolean {
    return (
      carX < obj.x + obj.width &&
      carX + CAR_HITBOX_WIDTH > obj.x &&
      carY < obj.y + obj.height &&
      carY + CAR_HITBOX_HEIGHT > obj.y
    );
  }
}
