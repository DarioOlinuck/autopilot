# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:4200
npm run build      # Production build → dist/autopilot/
npm test           # Karma/Jasmine unit tests
npm run lint       # TSLint
npm run e2e        # Protractor end-to-end tests
```

To run a single test file: `npx ng test --include='**/foo.spec.ts'`

## Project Purpose

An interactive **car autopilot simulator** that serves as a design patterns showcase. Users select a car type, drive on a canvas while avoiding falling stone obstacles, and the simulation demonstrates multiple GoF patterns in action. There is no backend — all state is local.

## Architecture

**Single-module app.** `AppModule` bootstraps `AppComponent`, which is the monolithic orchestrator handling canvas drawing, car physics, keyboard input (arrow keys to steer, `a` to toggle autopilot), collision detection, and game loop (`setInterval`).

Two canvas elements are managed: a sky canvas (weather) and a main canvas (car + stones).

**Data flow:** User clicks button → `AppComponent` method → Factory creates `Car` → `CarState` transitions drive behavior → `WeatherDirectiveDirective` emits weather updates via `EventEmitter` → Component reflects state in template.

**State management:** No NgRx/Redux. Uses component-local properties + `BlackboardService` (localStorage-backed) for weather sharing.

## Design Patterns Implemented

| Pattern | Location | Notes |
|---|---|---|
| **Factory Method** | `models/factory/` | `SedanFactory` / `CupeFactory` extend abstract `CarFactory` |
| **State** | `models/state/` | `CarPickedState`, `CarStartedState`, `CarOnAutopilot` implement `CarState` |
| **Composite** | `models/composite/` | `CompositeEngine` aggregates `AirFilter`, `EngineBlock`, `OilPan`, `Turbo` for price calculation |
| **Flyweight** | `models/flyweight/` | `FlyweightStone` shares the rock image (intrinsic); x/y/speed are extrinsic |
| **Blackboard** | `services/blackboard.service.ts` + `WeatherDirectiveDirective` | Weather posted to localStorage; directive publishes, component subscribes |

Models are barrel-exported from `models/index.ts` and `services/index.ts`.

## Key Files

- `src/app/app.component.ts` — game loop, canvas rendering, input handling, state orchestration
- `src/app/directives/weather-directive.directive.ts` — weather system + Blackboard pattern integration
- `src/app/models/` — all pattern implementations
- `src/app/services/blackboard.service.ts` — localStorage-backed shared data store

## Angular Version & Tooling

Angular **10** (legacy), TypeScript 3.9, TSLint (not ESLint). Bootstrap 5 + jQuery are loaded as global scripts in `angular.json`. Production build has AOT enabled and replaces `environment.ts` with `environment.prod.ts`.
