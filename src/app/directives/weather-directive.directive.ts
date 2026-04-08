import { Directive, EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { Weather } from '../models';
import { BlackboardService } from '../services/blackboard.service';
import { interval } from 'rxjs';

@Directive({
  selector: '[appWeatherDirective]'
})
export class WeatherDirectiveDirective implements OnInit{
  @Input()skyCtx:CanvasRenderingContext2D;
  @Input()maxWidth:number;
  @Output() actualWeather = new EventEmitter<string>();

  constructor(private blackboardService: BlackboardService) { }

  ngOnInit(): void {
    this.saveWeather();

    interval(1000).subscribe(()=>{
      this.actualWeather.emit(this.blackboardService.actualWeather())
    })
  }

  saveWeather() {
    let claud = new Weather("Claudy", "./../assets/claudy.png");
    let sunny = new Weather("Sunny", "./../assets/sunny.png");
    let snowy = new Weather("Snowy", "./../assets/snowy.png");

    let weatherArray: Weather[] = [claud, snowy, sunny];

    let weatherdForecast = Math.floor(Math.random() * 3);
  
    setInterval(() => {
      let wheatherObject = new Image();
      wheatherObject.src = weatherArray[weatherdForecast].imagePath;
      this.blackboardService.postWeather(weatherArray[weatherdForecast].name);
      this.skyCtx.drawImage(wheatherObject, this.maxWidth - wheatherObject.width, 0);
    }, 0);
  } 
}
