import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { SedanFactory, CupeFactory, Car, CarStartedState, CarOnAutopilot, CarPickedState, FlyweightStone } from './models';
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
  public skyCtx!: CanvasRenderingContext2D;
  public maxWidth!: number;

  private ctx!: CanvasRenderingContext2D;
  private carXAxis!: number;
  private carYAxis = 0;
  private stone0!: FlyweightStone;
  private stone1!: FlyweightStone;
  private stone2!: FlyweightStone;
  private carInterval: any;
  private stone0Interval: any;
  private stone1Interval: any;
  private stone2Interval: any;
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
    //If the user press 'a' for the first time it will enter here
    if (this.car?.state instanceof CarPickedState) {
      this.car.state = new CarOnAutopilot();
    }
    else if (this.car.state instanceof CarStartedState) {
      //if the car is started it can not change its state
      alert("Can not change state on a running car")
    }
    else {
      //it will create the state as picked
      this.car.state = new CarPickedState();
    }
  }

  ngOnInit(): void {
    this.stone0 = new FlyweightStone(400, 15);
    this.stone1 = new FlyweightStone(600, 10);
    this.stone2 = new FlyweightStone(900, 30);

    this.maxWidth = this.canvas.nativeElement.width;
    this.skyCtx = this.skyCanvas.nativeElement.getContext('2d')!;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
  }

  pickCar(carType: string) {
    switch (carType) {
      case 'sedan':
        this.car = new SedanFactory().createCar();
        break;
      case 'cupe':
        this.car = new CupeFactory().createCar();
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

      // clear canvas
      //create functions and divide canvas in renctacles to keep mountain
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

      this.ctx.drawImage(this.carOffscreen, this.carXAxis, this.carYAxis);
      this.carXAxis += this.car.speed;

      if (this.timeOut()) {
        clearInterval(this.carInterval);
        this.car.state = new CarPickedState();
      }
    }, 50);

    //stone0
    this.stone0Interval = setInterval(() => {
      this.ctx.drawImage(this.stone0.rockImage, this.stone0.x, this.stone0.y);
      this.stone0.y += this.stone0.speed;
      if (this.collidesWithCar(this.stone0)) { alert("Craaashh"); this.resetRace(); }
      if (this.timeOut()) { clearInterval(this.stone0Interval); }
    }, 50);

    //stone1
    this.stone1Interval = setInterval(() => {
      this.ctx.drawImage(this.stone1.rockImage, this.stone1.x, this.stone1.y);
      this.stone1.y += this.stone1.speed;
      if (this.collidesWithCar(this.stone1)) { alert("Craaashh"); this.resetRace(); }
      if (this.timeOut()) { clearInterval(this.stone1Interval); }
    }, 50);

    //stone2
    this.stone2Interval = setInterval(() => {
      this.ctx.drawImage(this.stone2.rockImage, this.stone2.x, this.stone2.y);
      this.stone2.y += this.stone2.speed;
      if (this.collidesWithCar(this.stone2)) { alert("Craaashh"); this.resetRace(); }
      if (this.timeOut()) { clearInterval(this.stone2Interval); }
    }, 50);

    //draw mountain

  }

  timeOut(): boolean {
    return this.carXAxis >= (this.maxWidth - this.car.imgTag.width - 100);
  }

  initPosition() {
    this.carXAxis = 0;
    this.carYAxis = 300;
    this.stone0.y = 0;
    this.stone1.y = 0;
    this.stone2.y = 0;
  }

  createNature() {
    setInterval(() => {
      const mountain = new Image();
      mountain.src = "../assets/mountain-removebg.png";
      this.ctx.drawImage(mountain, 0, 0);
    }, 100);

  }


  collidesWithCar(stone: FlyweightStone): boolean {
    return (
      this.carXAxis < stone.x + 60 &&
      this.carXAxis + 80 > stone.x &&
      this.carYAxis < stone.y + 60 &&
      this.carYAxis + 40 > stone.y
    );
  }

  resetRace() {
    clearInterval(this.carInterval);
    clearInterval(this.stone0Interval);
    clearInterval(this.stone1Interval);
    clearInterval(this.stone2Interval);
  }

  updateWeather($event: string) {
    this.actualWeather = $event;
  }
}
