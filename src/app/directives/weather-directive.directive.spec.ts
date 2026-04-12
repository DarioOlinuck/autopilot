import { WeatherDirectiveDirective } from './weather-directive.directive';
import { BlackboardService } from '../services/blackboard.service';

describe('WeatherDirectiveDirective', () => {
  it('should create an instance', () => {
    const directive = new WeatherDirectiveDirective(new BlackboardService());
    expect(directive).toBeTruthy();
  });
});
