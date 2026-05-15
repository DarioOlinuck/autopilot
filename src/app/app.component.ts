import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  Car,
  CommandInvoker,
  FallingObject,
  FallingObjectFactory,
  PickCarCommand,
  StartRaceCommand,
  ToggleAutopilotCommand,
  TurnLeftCommand,
  TurnRightCommand,
} from './models';
import { GameLoopService, RendererService } from './services';
import { WeatherDirectiveDirective } from './directives/weather-directive.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, WeatherDirectiveDirective],
  template: `
          <div
          class="container-fluid"
          appWeatherDirective
          [skyCtx]="skyCtx"
          [maxWidth]="renderer.maxWidth"
          (actualWeather)="updateWeather($event)"
        >
          <div class="row" style="max-height: 164px;">
            <div class="col-sm-9 header-col-height">
              <canvas #skyCanvas width="1367"></canvas>
            </div>
            <div class="col-sm-3 header-col-height"> <h1 style="text-align: center; ">Autopilot</h1></div>
          </div>

          <div class="row" >
            <div class="col-sm-9 main-col-height canvas-col">
              <canvas class="main-canvas" #canvas width="1367" height="640"></canvas>
            </div>

            <div class="col-sm-3 main-col-height">

              <div class="justify-content-center control-padding">

                <div *ngIf="car" style="height: 150;">
                  <h5>{{ car.getCarPrice() }}</h5>

                  <h5>Car State: {{ car._state.stateName }}</h5>
                </div>

                <div class="row">
                  <h5>Weather condition: {{ actualWeather }}</h5>
                </div>

                <div class="row">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-lg"
                    (click)="pickCar('sedan')"
                  >
                    Sedan
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-lg"
                    (click)="pickCar('cupe')"
                  >
                    Cupe
                  </button>
                </div>

                <div class="row">
                  <button type="button" class="btn btn-start" (click)="start()">
                    Start
                  </button>
                </div>

                <div class="row">

                  <button type="button" class="btn btn-outline-dark btn-lg btn-block" (click)="turnLeft()">
                    <i class="bi bi-arrow-up"></i>
                  </button>

                  <button
                    type="button"
                    class="btn btn-outline-dark btn-lg btn-block"
                    (click)="turnRight()"
                  >
                    <i class="bi bi-arrow-down-short"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private gameLoop = inject(GameLoopService);
  protected renderer = inject(RendererService);

  @ViewChild('skyCanvas', { static: true })
  private skyCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;

  actualWeather!: string;
  skyCtx!: CanvasRenderingContext2D;

  private invoker = new CommandInvoker();
  private pickSedan = new PickCarCommand(this.gameLoop, 'sedan');
  private pickCupe = new PickCarCommand(this.gameLoop, 'cupe');
  private startRace = new StartRaceCommand(this.gameLoop);
  private turnLeftCmd = new TurnLeftCommand(this.gameLoop);
  private turnRightCmd = new TurnRightCommand(this.gameLoop);

  get car(): Car | undefined {
    return this.gameLoop.car;
  }

  ngOnInit(): void {
    this.renderer.bindMainCanvas(this.canvas.nativeElement);
    this.skyCtx = this.skyCanvas.nativeElement.getContext('2d')!;

    this.gameLoop.setFallingObjects([
      new FallingObject(400, FallingObjectFactory.getStone()),
      new FallingObject(600, FallingObjectFactory.getLog()),
      new FallingObject(900, FallingObjectFactory.getChicken()),
    ]);

    this.invoker
      .bind('a', new ToggleAutopilotCommand(this.gameLoop))
      .bind('ArrowLeft', this.turnLeftCmd)
      .bind('ArrowRight', this.turnRightCmd);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.invoker.dispatch(event.key);
  }

  pickCar(carType: 'sedan' | 'cupe'): void {
    (carType === 'sedan' ? this.pickSedan : this.pickCupe).execute();
  }

  start(): void {
    this.startRace.execute();
  }

  turnLeft(): void {
    this.turnLeftCmd.execute();
  }

  turnRight(): void {
    this.turnRightCmd.execute();
  }

  updateWeather($event: string): void {
    this.actualWeather = $event;
  }
}
