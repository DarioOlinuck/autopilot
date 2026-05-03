import {
  FallingObjectType,
  StaticFallingObjectType,
} from './falling-object-type.model';

export class FallingObjectFactory {
  private static stone?: FallingObjectType;
  private static log?: FallingObjectType;
  private static chicken?: FallingObjectType;

  static getStone(): FallingObjectType {
    return this.stone ??= new StaticFallingObjectType(
      '../assets/rocky-removebg-preview.webp', 18, 60, 60,
    );
  }

  static getLog(): FallingObjectType {
    return this.log ??= new StaticFallingObjectType(
      '../assets/log.webp', 12, 80, 40,
    );
  }

  static getChicken(): FallingObjectType {
    return this.chicken ??= new StaticFallingObjectType(
      '../assets/chicken.webp', 6, 80, 80,
    );
  }
}
