import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlackboardService {

  public postWeather(weather:string){
    localStorage.setItem("actualWeather", weather);
  }

  public actualWeather():string{
    return localStorage.getItem("actualWeather");
  }
}
