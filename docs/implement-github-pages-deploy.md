# Deploying to GitHub Pages

Deployment is automated via GitHub Actions: every push to `main` builds the
production bundle and publishes it to GitHub Pages. The workflow lives at
[.github/workflows/deploy.yml](../.github/workflows/deploy.yml).

The published site is served at https://dariooLinuck.github.io/autopilot/.

## How it works

1. On push to `main` (or a manual run via **Actions → Deploy to GitHub Pages →
   Run workflow**), the `build` job runs `npm ci` and builds with
   `--base-href=/autopilot/` so asset URLs resolve under the project subpath.
2. The compiled output in `dist/autopilot/browser/` is uploaded as a Pages
   artifact. `index.html` is also copied to `404.html` as an SPA fallback.
3. The `deploy` job publishes the artifact with `actions/deploy-pages`.

No `gh-pages` branch and no local `ng deploy` are involved.

## One-time setup (required)

In GitHub → repository **Settings → Pages → Build and deployment → Source**,
select **GitHub Actions**. This must be done once in the GitHub UI; after that,
pushes to `main` deploy automatically.

## Notes

- The app uses `provideRouter([])` with no routes, so no hash routing /
  `app.config.ts` change is needed; the `404.html` copy covers deep-link
  refreshes if routes are added later.
- To verify a build locally before pushing:
  ```bash
  npm ci
  npm run build -- --configuration=production --base-href=/autopilot/
  ```
  Confirm `dist/autopilot/browser/index.html` contains `<base href="/autopilot/">`.
