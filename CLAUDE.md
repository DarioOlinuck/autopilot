# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:4200
npm run build      # Production build → dist/autopilot/
npm test           # Karma/Jasmine unit tests (use --watch=false --browsers=ChromeHeadless in CI)
npm run lint       # ESLint via @angular-eslint
```

To run a single test file: `npx ng test --include='**/foo.spec.ts'`

## Project Purpose

An interactive **car autopilot simulator** that serves as a design patterns showcase. The user picks a car, drives on a canvas while avoiding falling obstacles, and the simulation demonstrates multiple GoF patterns in action. There is no backend — all state is local.

## Architecture

**Standalone-component app.** `src/main.ts` calls `bootstrapApplication(AppComponent, { providers: [provideRouter([])] })`. There is **no `AppModule`** — `AppComponent` is `standalone: true` and imports its dependencies directly.

`AppComponent` is the monolithic orchestrator: it handles canvas drawing, car physics, keyboard input (arrow keys to steer, `a` to toggle autopilot), collision detection, and the game loop (multiple `setInterval`s — one for the car, one per falling object).

Two canvas elements are managed: a sky canvas (weather) and a main canvas (car + falling objects).

**Data flow:** User clicks button → `AppComponent` method → Factory creates `Car` → `CarState` transitions drive behavior → `WeatherDirectiveDirective` emits weather updates via `EventEmitter` → component reflects state in template.

**State management:** No NgRx/Redux. Component-local properties + `BlackboardService` (localStorage-backed) for weather sharing across the directive ↔ component boundary.

## Design Patterns Implemented

| Pattern | Location | Notes |
|---|---|---|
| **Factory Method** | `models/factory/` | `SedanFactory` / `CupeFactory` extend abstract `CarFactory` |
| **State** | `models/state/` | `CarPickedState`, `CarStartedState`, `CarOnAutopilot` implement `CarState` |
| **Composite** | `models/composite/` | `CompositeEngine` aggregates `AirFilter`, `EngineBlock`, `OilPan`, `Turbo` for price calculation |
| **Flyweight** | `models/flyweight/` | `FallingObjectType` (intrinsic: image, terminal velocity, dimensions) shared via `FallingObjectFactory`; `FallingObject` carries extrinsic x/y. Variants: stone, log, chicken |
| **Blackboard** | `services/blackboard.service.ts` + `WeatherDirectiveDirective` | Weather posted to localStorage; directive publishes, component subscribes |

The README lists additional patterns ("going to be used" — Prototype, Decorator, Chain of Responsibility, Strategy, Iterator) that are **not yet implemented**. Don't assume they exist.

Models are barrel-exported from `models/index.ts` and `services/index.ts`. **Always export new models from the barrel** — `app.component.ts` imports through it.

## Key Files

- `src/app/app.component.ts` — game loop, canvas rendering, input handling, state orchestration
- `src/app/directives/weather-directive.directive.ts` — weather system + Blackboard pattern integration
- `src/app/models/` — all pattern implementations (barrel-exported)
- `src/app/models/flyweight/` — `FallingObjectType` (abstract + `StaticFallingObjectType`), `FallingObject`, `FallingObjectFactory`
- `src/app/services/blackboard.service.ts` — localStorage-backed shared data store
- `src/app/helpers/canvas.helper.ts` — `removeGreenBackground()` runtime green-screen removal for car sprites

## Image Assets

All assets in `src/assets/` are **WebP**. Car sprites (`cupeGreen.webp`, `carsyGreen.webp`) have a green background that is keyed out at runtime by `removeGreenBackground()`. The chicken (`chicken.webp`) is a placeholder grayscale-emoji image — replace the file with a nicer 80×80 WebP and no code changes are needed.

## Angular Version & Tooling

Angular **17.3** with **standalone components**, TypeScript 5.3, ESLint via `@angular-eslint`, RxJS 7.8, Zone.js 0.14. Builder is `@angular-devkit/build-angular:browser` (the legacy webpack-based builder — not yet migrated to the v17 esbuild `:application` builder). Bootstrap 5 + jQuery are loaded as global scripts in `angular.json`. Production build has AOT enabled and replaces `environment.ts` with `environment.prod.ts`. CI runs on Node 18 (`.github/workflows/ci.yml`); Angular 17 requires Node 18.13+ or 20.9+ locally.
