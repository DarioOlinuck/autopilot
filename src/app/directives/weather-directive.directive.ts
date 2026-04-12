import { Directive, EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { Weather } from '../models';
import { BlackboardService } from '../services/blackboard.service';
import { interval } from 'rxjs';

@Directive({
  selector: '[appWeatherDirective]',
  standalone: true
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
    let cloudy = new Weather("Cloudy", "./../assets/claudy.png");
    let sunny = new Weather("Sunny", "./../assets/sunny.png");
    let snowy = new Weather("Snowy", "./../assets/snowy.png");

    let weatherArray: Weather[] = [cloudy, snowy, sunny];

    let weatherForecast = Math.floor(Math.random() * 3);
  
    setInterval(() => {
      let weatherObject = new Image();
      weatherObject.src = weatherArray[weatherForecast].imagePath;
      this.blackboardService.postWeather(weatherArray[weatherForecast].name);
      this.skyCtx.drawImage(weatherObject, this.maxWidth - weatherObject.width, 0);
    }, 0);
  } 
}
