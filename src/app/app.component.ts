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

const WEATHER_IMG: Record<string, string> = {
  Sunny: 'assets/sunny.webp',
  Cloudy: 'assets/claudy.webp',
  Snowy: 'assets/snowy.webp',
};

const CAR_THUMB_GRADIENT = 'radial-gradient(circle at 50% 60%, var(--slate-700), var(--slate-900))';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, WeatherDirectiveDirective],
  template: `
    <div class="app"
         appWeatherDirective
         [skyCtx]="skyCtx"
         [maxWidth]="renderer.maxWidth"
         (actualWeather)="updateWeather($event)">

      <header class="topbar panel">
        <div class="brand">
          <div class="brand-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 17l3-3 3 2 4-6 3 4 5-5"/>
              <circle cx="20" cy="6" r="1.4" fill="white" stroke="none"/>
            </svg>
          </div>
          <div>
            <div class="brand-name">Autopilot</div>
            <div class="brand-sub">Design Patterns Demo</div>
          </div>
        </div>

        <div class="telemetry">
          <div class="tele">
            <div class="tele-label">Speed</div>
            <div class="tele-value up">{{ car?.speed ?? '—' }}<span class="unit">km/h</span></div>
          </div>
          <div class="tele">
            <div class="tele-label">Time</div>
            <div class="tele-value">{{ formattedTime }}</div>
          </div>
        </div>

        <div class="weather-chip" *ngIf="actualWeather; else weatherPlaceholder">
          <img [src]="weatherImage" [alt]="actualWeather" />
          <div class="weather-chip-text">
            <div class="l">Weather</div>
            <div class="v">{{ actualWeather }}</div>
          </div>
        </div>
        <ng-template #weatherPlaceholder>
          <div class="weather-chip">
            <img src="assets/sunny.webp" alt="" />
            <div class="weather-chip-text">
              <div class="l">Weather</div>
              <div class="v">—</div>
            </div>
          </div>
        </ng-template>
      </header>

      <main class="stage">
        <div class="stage-sky">
          <canvas #skyCanvas width="1367" height="150"></canvas>
        </div>
        <div class="stage-road">
          <div class="lane-marks upper"></div>
          <div class="lane-marks mid"></div>
          <div class="lane-marks lower"></div>
          <canvas #canvas width="1367" height="640"></canvas>
        </div>

        <div class="stage-overlay" *ngIf="gameLoop.isAutopilotOn">
          <span class="pill"><span class="dot"></span>Autopilot engaged</span>
        </div>

        <div class="minimap">
          <div class="minimap-row">
            <span class="l">Race progress</span>
            <span class="v">{{ gameLoop.progressPercent.toFixed(0) }}%</span>
          </div>
          <div class="mini-progress">
            <div [style.width.%]="gameLoop.progressPercent"></div>
          </div>
          <div class="minimap-row" style="margin-top: 10px;">
            <span class="l">Time left</span>
            <span class="v">{{ formattedTime }}</span>
          </div>
        </div>
      </main>

      <aside class="hud panel">
        <section>
          <h2>Vehicle</h2>
          <div class="car-grid">
            <button type="button"
                    class="car-card"
                    [class.selected]="isPicked('sedan')"
                    (click)="pickCar('sedan')"
                    aria-label="Pick sedan">
              <span class="check" *ngIf="isPicked('sedan')">✓</span>
              <div class="thumb" [style.background-image]="thumbStyle('sedan')"></div>
              <div class="label">Sedan <span class="price">\${{ sedanPrice }}</span></div>
              <div class="specs">
                <span class="spec">Speed 25</span>
                <span class="spec">V6</span>
              </div>
            </button>
            <button type="button"
                    class="car-card"
                    [class.selected]="isPicked('cupe')"
                    (click)="pickCar('cupe')"
                    aria-label="Pick cupe">
              <span class="check" *ngIf="isPicked('cupe')">✓</span>
              <div class="thumb" [style.background-image]="thumbStyle('cupe')"></div>
              <div class="label">Cupe <span class="price">\${{ cupePrice }}</span></div>
              <div class="specs">
                <span class="spec">Speed 35</span>
                <span class="spec">Turbo</span>
              </div>
            </button>
          </div>
        </section>

        <section>
          <h2>Status</h2>
          <div class="status">
            <div class="status-tile state">
              <div class="l">State</div>
              <div class="v">
                <span class="state-dot" *ngIf="isRacing"></span>
                {{ car?._state?.stateName ?? '—' }}
              </div>
            </div>
            <div class="status-tile">
              <div class="l">Engine</div>
              <div class="v">{{ engineLabel }}</div>
            </div>
          </div>

          <button type="button" class="start-btn" (click)="start()" [disabled]="gameLoop.isRunning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Start race
            <span class="kbd">Enter</span>
          </button>
        </section>

        <section>
          <h2>Driving</h2>

          <div class="row-toggle">
            <div class="meta">
              <div class="t">Autopilot <span class="badge-kbd">A</span></div>
              <div class="s">Auto-dodge falling obstacles</div>
            </div>
            <button type="button"
                    class="toggle"
                    [class.off]="!gameLoop.isAutopilotOn"
                    (click)="toggleAutopilot()"
                    [attr.aria-pressed]="gameLoop.isAutopilotOn"
                    aria-label="Toggle autopilot"></button>
          </div>

          <div class="row-toggle" style="padding: 8px 14px;">
            <div class="meta">
              <div class="t" style="font-size: 12px;">Strategy</div>
            </div>
            <select (change)="onAutopilotChoice($any($event.target).value)"
                    style="background: var(--slate-700); color: var(--white); border: 1px solid rgba(255,255,255,.08); border-radius: 6px; padding: 4px 8px; font-family: var(--font-sans); font-size: 12px;">
              <option value="dodge">Dodge nearest</option>
              <option value="weave">Weave</option>
              <option value="hold">Hold lane</option>
            </select>
          </div>

          <div class="controls">
            <button type="button" title="Steer left" aria-label="Steer left" (click)="turnLeft()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg>
            </button>
            <button type="button" title="Steer right" aria-label="Steer right" (click)="turnRight()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
            </button>
          </div>

          <div class="muted">← → keys to steer · <b>A</b> toggles autopilot</div>
        </section>
      </aside>

      <ng-container *ngIf="activeModal as modal">
        <div class="modal-backdrop" (click)="dismissModal()"></div>
        <div class="app-modal" [class.success]="modal === 'win'" [class.danger]="modal === 'crash'" [class.warning]="modal === 'noCar'" role="dialog" aria-modal="true" aria-labelledby="appModalTitle">
          <div class="content">
            <h3 id="appModalTitle"><span class="badge">{{ modalBadge }}</span> {{ modalTitle }}</h3>
            <p>{{ modalMessage }}</p>
            <div class="actions">
              <button type="button" class="ok" (click)="dismissModal()" autofocus>OK</button>
            </div>
          </div>
        </div>
      </ng-container>
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
  sedanPrice = '';
  cupePrice = '';

  private invoker = new CommandInvoker();
  private pickSedan = new PickCarCommand(this.gameLoop, 'sedan');
  private pickCupe = new PickCarCommand(this.gameLoop, 'cupe');
  private startRace = new StartRaceCommand(this.gameLoop);
  private turnLeftCmd = new TurnLeftCommand(this.gameLoop);
  private turnRightCmd = new TurnRightCommand(this.gameLoop);
  private toggleAutopilotCmd = new ToggleAutopilotCommand(this.gameLoop);

  get car(): Car | undefined {
    return this.gameLoop.car;
  }

  get isRacing(): boolean {
    const name = this.car?._state?.stateName;
    return name === 'Started' || name === 'On Autopilot';
  }

  get formattedTime(): string {
    const total = this.gameLoop.timeRemainingSec;
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get weatherImage(): string {
    return WEATHER_IMG[this.actualWeather] ?? 'assets/sunny.webp';
  }

  get engineLabel(): string {
    if (!this.car) return '—';
    return this.car.speed >= 35 ? 'Turbo' : 'V6';
  }

  get activeModal(): 'win' | 'crash' | 'noCar' | null {
    if (this.gameLoop.roundWon) return 'win';
    if (this.gameLoop.roundCrashed) return 'crash';
    if (this.gameLoop.noCarSelected) return 'noCar';
    return null;
  }

  get modalBadge(): string {
    switch (this.activeModal) {
      case 'win': return '✓';
      case 'crash': return '✕';
      case 'noCar': return '!';
      default: return '';
    }
  }

  get modalTitle(): string {
    switch (this.activeModal) {
      case 'win': return 'You won!';
      case 'crash': return 'Craaashh!';
      case 'noCar': return 'No car selected';
      default: return '';
    }
  }

  get modalMessage(): string {
    switch (this.activeModal) {
      case 'win': return 'You survived the full 60 seconds.';
      case 'crash': return 'You hit a falling obstacle. Pick a car and try again.';
      case 'noCar': return 'Please pick a car before starting the race.';
      default: return '';
    }
  }

  ngOnInit(): void {
    this.renderer.bindMainCanvas(this.canvas.nativeElement);
    this.renderer.drawBackground(0);
    this.skyCtx = this.skyCanvas.nativeElement.getContext('2d')!;

    const sedan = new SedanFactory().createCar();
    const cupe = new CupeFactory().createCar();
    this.sedanPrice = String(sedan.compositeEngine.getAutoPartPrice());
    this.cupePrice = String(cupe.compositeEngine.getAutoPartPrice());
    this.loadThumbnail(sedan.imgTag, url => this.sedanThumbnail = url);
    this.loadThumbnail(cupe.imgTag, url => this.cupeThumbnail = url);

    this.invoker
      .bind('a', this.toggleAutopilotCmd)
      .bind('ArrowLeft', this.turnLeftCmd)
      .bind('ArrowRight', this.turnRightCmd)
      .bind('Enter', this.startRace);
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

  isPicked(carType: 'sedan' | 'cupe'): boolean {
    if (!this.car || this.car._state.stateName !== 'Picked') return false;
    return carType === 'sedan' ? this.car.speed === 25 : this.car.speed === 35;
  }

  thumbStyle(carType: 'sedan' | 'cupe'): string {
    const url = carType === 'sedan' ? this.sedanThumbnail : this.cupeThumbnail;
    return url ? `url(${url}), ${CAR_THUMB_GRADIENT}` : CAR_THUMB_GRADIENT;
  }

  start(): void {
    this.startRace.execute();
  }

  toggleAutopilot(): void {
    this.toggleAutopilotCmd.execute();
  }

  dismissModal(): void {
    this.gameLoop.roundWon = false;
    this.gameLoop.roundCrashed = false;
    this.gameLoop.noCarSelected = false;
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
