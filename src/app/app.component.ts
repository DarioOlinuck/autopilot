import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SedanFactory, CupeFactory, Car, CarStartedState, CarOnAutopilot, CarPickedState, FlyweightStone } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {



  @ViewChild('skyCanvas', { static: true })
  private skyCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvas', { static: true })
  private canvas: ElementRef<HTMLCanvasElement>;

  actualWeather: string;

  weatherInterval = 0;

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

  car: Car;
  public skyCtx: CanvasRenderingContext2D;
  public maxWidth: number;

  private ctx: CanvasRenderingContext2D;
  private carXAxis: number;
  private carYAxis: number = 0;

  private stone1: FlyweightStone;
  private stone2: FlyweightStone;

  public get IsFirstStart() {
    return this.carXAxis === undefined;
  }

  ngOnInit(): void {
    this.stone1 = new FlyweightStone(600, 10);
    this.stone2 = new FlyweightStone(900, 30);

    this.maxWidth = this.canvas.nativeElement.width;
    this.skyCtx = this.skyCanvas.nativeElement.getContext('2d');
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngAfterViewInit(): void {
    //fix clear interval and then use prototype to multiply mountains
    //this.createNature();
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


    const i = setInterval(() => {

      // clear canvas
      //create functions and divide canvas in renctacles to keep mountain
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

      this.ctx.drawImage(this.car.imgTag, this.carXAxis, this.carYAxis);
      this.carXAxis += this.car.speed;

      if (this.timeOut()) {
        clearInterval(i);
        this.car.state = new CarPickedState();
      }
    }, 100);

    //stone 1
    const y = setInterval(() => {

      this.ctx.drawImage(this.stone1.rockImage, this.stone1.x, this.stone1.y);

      this.stone1.y += this.stone1.speed;

      //evaluo que el auto no choque contra ninguno de los dos bordes verticales de la piedra
      if (this.carXAxis == this.stone1.x && (this.carYAxis == this.stone1.y ||
        (this.stone1.y + this.stone1.rockImage.width == this.carYAxis)
      )) {
        alert("crash!!")
      }

      //le doy 20 más para que la roca pase de largo y desaparezca de la imagen
      if (this.timeOut()) {
        clearInterval(y);
      }
    }, 50);

    //stone2
    const z = setInterval(() => {

      this.ctx.drawImage(this.stone2.rockImage, this.stone2.x, this.stone2.y);
      this.stone2.y += this.stone2.speed;

      //evaluo que el auto no choque contra ninguno de los dos bordes verticales de la piedra
      if (this.carXAxis == this.stone2.x && (this.carYAxis == this.stone2.y ||
        (this.stone2.y + this.stone2.rockImage.width == this.carYAxis)
      )) {
        alert("crash!!")
      }

      //le doy 20 más para que la roca pase de largo y desaparezca de la imagen
      if (this.timeOut()) {
        clearInterval(z);
      }
    }, 50);

    //draw mountain

  }

  timeOut(): boolean {
    return this.carXAxis >= (this.maxWidth - this.car.imgTag.width - 100);
  }

  initPosition() {
    this.carXAxis = 0;
    this.carYAxis = 300;
    this.stone1.y = 0;
    this.stone2.y = 0;
  }

  createNature() {
    setInterval(() => {
      let mountain = new Image();
      mountain.src = "../assets/mountain-removebg.png";
      this.ctx.drawImage(mountain, 0, 0);
    }, 100);

  }


  updateWeather($event: string) {
    this.actualWeather = $event;
  }
}





