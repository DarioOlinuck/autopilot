import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { SedanFactory, CupeFactory, Car, CarStartedState, CarOnAutopilot, CarPickedState, FallingObject, FallingObjectFactory } from './models';
import { removeGreenBackground } from './helpers/canvas.helper';
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
          [maxWidth]="maxWidth"
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

  @ViewChild('skyCanvas', { static: true })
  private skyCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;

  actualWeather!: string;
  weatherInterval = 0;
  car!: Car;
  private cachedSedan?: Car;
  private cachedCupe?: Car;
  public skyCtx!: CanvasRenderingContext2D;
  public maxWidth!: number;

  private ctx!: CanvasRenderingContext2D;
  private carXAxis!: number;
  private carYAxis = 0;
  private fallingObjects: FallingObject[] = [];
  private carInterval: any;
  private fallingObjectIntervals: any[] = [];
  private carOffscreen!: HTMLCanvasElement;

  public get IsFirstStart() {
    return this.carXAxis === undefined;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "a":
        this.setCarState();
        break;
      case "ArrowLeft":
        this.turnLeft();
        break;
      case "ArrowRight":
        this.turnRight()
        break;
    }
  }

  setCarState() {
    if (this.car?.state instanceof CarPickedState) {
      this.car.state = new CarOnAutopilot();
    }
    else if (this.car.state instanceof CarStartedState) {
      alert("Can not change state on a running car")
    }
    else {
      this.car.state = new CarPickedState();
    }
  }

  ngOnInit(): void {
    this.fallingObjects = [
      new FallingObject(400, FallingObjectFactory.getStone()),
      new FallingObject(600, FallingObjectFactory.getLog()),
      new FallingObject(900, FallingObjectFactory.getChicken()),
    ];

    this.maxWidth = this.canvas.nativeElement.width;
    this.skyCtx = this.skyCanvas.nativeElement.getContext('2d')!;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
  }

  pickCar(carType: string) {
    switch (carType) {
      case 'sedan':
        this.cachedSedan ??= new SedanFactory().createCar();
        this.car = this.cachedSedan.clone();
        break;
      case 'cupe':
        this.cachedCupe ??= new CupeFactory().createCar();
        this.car = this.cachedCupe.clone();
        break;
    }
  }

  turnLeft() {
    this.carYAxis -= 30;
  }

  turnRight() {
    this.carYAxis += 30;
  }

  start() {

    if (this.car == null) {
      alert("please select a car!!!");
      return
    }

    this.car.state = new CarStartedState();
    this.initPosition();
    this.carOffscreen = removeGreenBackground(this.car.imgTag);

    this.carInterval = setInterval(() => {

      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

      this.ctx.drawImage(this.carOffscreen, this.carXAxis, this.carYAxis);
      this.carXAxis += this.car.speed;

      if (this.timeOut()) {
        clearInterval(this.carInterval);
        this.car.state = new CarPickedState();
      }
    }, 50);

    this.fallingObjects.forEach((obj, i) => {
      this.fallingObjectIntervals[i] = setInterval(() => {
        obj.draw(this.ctx);
        obj.y += obj.speed;
        if (this.collidesWithCar(obj)) { alert("Craaashh"); this.resetRace(); }
        if (this.timeOut()) { clearInterval(this.fallingObjectIntervals[i]); }
      }, 50);
    });

  }

  timeOut(): boolean {
    return this.carXAxis >= (this.maxWidth - this.car.imgTag.width - 100);
  }

  initPosition() {
    this.carXAxis = 0;
    this.carYAxis = 300;
    this.fallingObjects.forEach(obj => obj.y = 0);
  }

  createNature() {
    setInterval(() => {
      const mountain = new Image();
      mountain.src = "../assets/mountain-removebg.webp";
      this.ctx.drawImage(mountain, 0, 0);
    }, 100);

  }


  collidesWithCar(obj: FallingObject): boolean {
    return (
      this.carXAxis < obj.x + obj.width &&
      this.carXAxis + 80 > obj.x &&
      this.carYAxis < obj.y + obj.height &&
      this.carYAxis + 40 > obj.y
    );
  }

  resetRace() {
    clearInterval(this.carInterval);
    this.fallingObjectIntervals.forEach(id => clearInterval(id));
  }

  updateWeather($event: string) {
    this.actualWeather = $event;
  }
}
