import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  Car,
  CommandInvoker,
  CupeFactory,
  DodgeNearestStrategy,
  LaneHoldStrategy,
  PickCarCommand,
  SedanFactory,
  StartRaceCommand,
  SteeringStrategy,
  ToggleAutopilotCommand,
  TurnLeftCommand,
  TurnRightCommand,
  WeavingStrategy,
} from './models';
import { GameLoopService, RendererService } from './services';
import { WeatherDirectiveDirective } from './directives/weather-directive.directive';
import { removeGreenBackground } from './helpers/canvas.helper';

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
          <div class="row">
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

                <div class="car-picks">
                  <button
                    type="button"
                    class="car-pick"
                    [style.background-image]="sedanThumbnail ? 'url(' + sedanThumbnail + ')' : null"
                    [class.selected]="car && car._state.stateName === 'Picked' && car.speed === 25"
                    (click)="pickCar('sedan')"
                    aria-label="Pick sedan"
                  ></button>
                  <button
                    type="button"
                    class="car-pick"
                    [style.background-image]="cupeThumbnail ? 'url(' + cupeThumbnail + ')' : null"
                    [class.selected]="car && car._state.stateName === 'Picked' && car.speed === 35"
                    (click)="pickCar('cupe')"
                    aria-label="Pick cupe"
                  ></button>
                </div>

                <div style="height: 150px;">
                  <ng-container *ngIf="car">
                    <h5>{{ car.getCarPrice() }}</h5>

                    <h5>Car State: {{ car._state.stateName }}</h5>
                  </ng-container>
                </div>

                <div class="row">
                  <h5>Weather condition: {{ actualWeather }}</h5>
                </div>

                <div class="row">
                  <h5>Time left: {{ gameLoop.timeRemainingSec }}s</h5>
                </div>

                <div class="row">
                  <label class="autopilot-label">Autopilot:
                    <select (change)="onAutopilotChoice($any($event.target).value)">
                      <option value="dodge">Dodge nearest</option>
                      <option value="weave">Weave</option>
                      <option value="hold">Hold lane</option>
                    </select>
                  </label>
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
  protected gameLoop = inject(GameLoopService);
  protected renderer = inject(RendererService);

  @ViewChild('skyCanvas', { static: true })
  private skyCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;

  actualWeather!: string;
  skyCtx!: CanvasRenderingContext2D;
  sedanThumbnail = '';
  cupeThumbnail = '';

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
    this.renderer.drawBackground(0);
    this.skyCtx = this.skyCanvas.nativeElement.getContext('2d')!;

    this.loadThumbnail(new SedanFactory().createCar().imgTag, url => this.sedanThumbnail = url);
    this.loadThumbnail(new CupeFactory().createCar().imgTag, url => this.cupeThumbnail = url);

    this.invoker
      .bind('a', new ToggleAutopilotCommand(this.gameLoop))
      .bind('ArrowLeft', this.turnLeftCmd)
      .bind('ArrowRight', this.turnRightCmd);
  }

  private loadThumbnail(img: HTMLImageElement, assign: (url: string) => void): void {
    const done = () => assign(removeGreenBackground(img).toDataURL());
    if (img.complete && img.naturalWidth > 0) {
      done();
    } else {
      img.addEventListener('load', done, { once: true });
    }
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

  onAutopilotChoice(value: string): void {
    const strategy = this.strategyByName(value);
    this.gameLoop.setAutopilotChoice(strategy);
  }

  private strategyByName(value: string): SteeringStrategy {
    switch (value) {
      case 'weave': return new WeavingStrategy();
      case 'hold': return new LaneHoldStrategy();
      default: return new DodgeNearestStrategy();
    }
  }
}
