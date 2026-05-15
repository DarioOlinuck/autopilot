import { GameLoopService } from '../../services/game-loop.service';
import { Command } from './command.model';

export class PickCarCommand implements Command {
  constructor(
    private gameLoop: GameLoopService,
    private carType: 'sedan' | 'cupe',
  ) {}

  execute(): void {
    this.gameLoop.pickCar(this.carType);
  }
}
