import { Command } from './command.model';

export class CommandInvoker {
  private bindings = new Map<string, Command>();

  bind(key: string, command: Command): this {
    this.bindings.set(key, command);
    return this;
  }

  dispatch(key: string): void {
    this.bindings.get(key)?.execute();
  }
}
