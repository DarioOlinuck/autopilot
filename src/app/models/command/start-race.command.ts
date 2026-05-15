import { GameLoopService } from '../../services/game-loop.service';
import { Command } from './command.model';

export class StartRaceCommand implements Command {
  constructor(private gameLoop: GameLoopService) {}

  execute(): void {
    this.gameLoop.start();
  }
}
