# Wildside mockup migration notes

Last updated: 29 October 2025

## Goals

- Replace the static `public/mockups/*.html` mockups with Radix UI driven React
  components styled via Tailwind CSS v4 and DaisyUI v5.
- Derive colour palettes and design tokens from the existing mockups and build
  them via the scripts under `tokens/`, ensuring tokens flow into Tailwind and
  DaisyUI.
- Maintain a living record of architectural decisions, open questions, and
  follow-up tasks discovered during the migration.

## Decisions (26 October 2025)

- Support both dark and light DaisyUI themes; ship dark as the default
  experience. Ensure generated tokens cover both variants.
- Retain Font Awesome during the migration. Evaluate Tabler Fill and Remix Fill
  icon sets as potential replacements in a follow-up spike before switching.
- Exclude generated token artefacts from version control. Produce them during
  CI/CD (GitHub Pages deploy pipeline) and allow developers to build locally as
  needed.

## Localization and units

- Store measurements in SI base units (metres, seconds, and Celsius) and
  convert to user-preferred systems at the presentation layer. A
  `UnitPreferencesProvider` persists the chosen unit system and defaults to
  locale-driven detection when no preference is stored.
- Translation bundles expose shared unit labels via keys such as
  `unit-distance-kilometre`, `unit-distance-mile`, `unit-duration-minute`, and
  temperature/count counterparts, so all screens interpolate consistent unit
  names per locale.
- Presentational helpers (`formatDistance`, `formatDuration`, `formatTemperature`)
  convert SI values and inject translated unit names, ensuring wizard, explore,
  customize, and map flows respect both locale and user preferences.

## Current assets

- `public/mockups/` contains 12 HTML screens preserved from the original
  prototype. They hand-roll Tailwind config through inline `<script>` blocks
  and rely on Font Awesome. Each file hints at the intended palette for its flow
  (for example, `discover.html` uses the dark teal gradient). Keeping them in a
  nested folder prevents GitHub Pages from serving them over the new SPA routes.
- `src/index.tsx` demonstrates Radix UI primitives already wired to DaisyUI,
  confirming the dependency set and basic theme switching functions.
- `tailwind.config.cjs` is minimal: it scans `./index.html` and `./src/**` and
  registers DaisyUI. No custom theme or token linkage is in place yet.
- `tokens/` is a Style Dictionary project. `tokens/src/tokens.json` exposes a
  neutral palette plus primary/secondary accents, fonts, radii, and spacing.
  No theme variants exist yet.
- `df12-www/` provides an example Tailwind v4 theme implementation that can
  serve as reference for advanced theming patterns (custom theme config, DaisyUI
  theme exports).
- `docs/` includes guidance on Tailwind v4 migration and DaisyUI v5 usage,
  which we must observe when shaping new configuration and documentation.

## Palette inventory

- Base surfaces referenced across the mockups:
  - `#0D1A26` (primary background), `#152433` (elevated background), `#203445`
    (card surface), and `#2A4157` (desaturated overlay in wizard/map screens).
- Accent colours:
  - `#4AF0D5` (teal highlight), `#3CCAB4` (hover/pressed), and `#8998A8`
    (muted text + iconography).
- A single warm accent appears as `#FEA` (`#FFEEAA` in RGB) within
  `explore.html`; treat this as a contextual badge/warning rather than a core
  brand tone.
- Typography defaults to white (`#FFFFFF`) for the dark theme and shades of the
  neutral stack for secondary labels.

Mapping guidance:

- Assign the four dark neutrals to `color.neutral.{900,850,800,700}` so we can
  drive DaisyUI `base-100` through `base-300` directly from tokens.
- Map `#4AF0D5` to `color.accent.500` and `#3CCAB4` to `color.accent.600` to
  preserve hover contrast. Keep `color.primary` reserved for future brand
  highlights (orange) but consider introducing a `brand` semantic token that
  points to accent teal for now.
- Capture `#8998A8` as `color.neutral.400` to inform muted text, icon strokes,
  and borders.
- Light mode will reuse the same teal accent values but invert the neutral stack
  (introduce lighter surface tones in the `color.neutral.0-200` range while
  mapping darker greys back onto text tokens).

## Design token strategy

- Extract colour samples from each mockup screen, grouping them into candidate
  theme roles (base, neutral, primary, accent, feedback). Prioritize the shared
  dark teal palette as the initial default theme; capture wizard-specific
  highlights as secondary accents or contextual layers. Mirror these decisions
  in a light variant to support theme switching.
- Encode the palette in `tokens/src/themes/<theme>.json`, referencing semantic
  token names from `tokens/src/tokens.json`. Ensure Style Dictionary outputs CSS
  custom properties targeting both DaisyUI v5 token names (for example,
  `--color-primary`) and legacy aliases (`--p`) to preserve compatibility.
- Enhance the token build to emit a Tailwind consumable file (likely under
  `tokens/dist/`), exporting a JS object with colour aliases and spacing scales.
  Plan to import that object inside `tailwind.config.cjs`.
- Keep the repository free of generated assets. Document the GitHub Action step
  responsible for building and publishing tokens alongside the site bundle.
- Define a deterministic light theme by inverting the neutral ladder:
  - Base backgrounds: new values around `#F6FBFF`, `#E9F1F7`, and `#D5DEE8`.
  - Foreground text: reuse `#0D1A26` and `#203445` as `fg.default`/`fg.muted`.
  - Maintain `accent` teal unchanged to avoid perceptual colour drift between
    themes.
- Extend semantic tokens to include utility hues (`success`, `warning`,
  `error`, `info`). Derive them from accessible palette pairs (target >=4.5:1
  contrast). Add placeholders now and refine once we build concrete UI states.
- Track the feedback palette directly in `tokens.json` (`color.info`,
  `color.success`, `color.warning`, `color.error`) so Style Dictionary can emit
  consistent values for both themes. Current picks mirror Tailwind Sky, Emerald,
  Amber, and Rose scales tuned for ≥4.5:1 contrast on the chosen foregrounds.

## Tailwind and DaisyUI integration

- Update `tailwind.config.cjs` to load generated token exports and feed them
  into `theme.extend`. Generated CSS handles DaisyUI theme registration, so the
  config only needs to expose Tailwind primitives. Ensure content paths include
  the forthcoming component directories.
- Validate whether PostCSS needs additional plugins (for example,
  `@tailwindcss/typography`). If so, record rationale and update `postcss.config.cjs`
  accordingly.
- Align DaisyUI theme names with token files (for example, `"wildside-night"`),
  ensuring Radix UI theme switching utilities (`applyTheme`) can target them.
- Confirm that Tailwind v4 JIT features (colour functions, arbitrary values)
  work with our generated CSS variables; document any quirks discovered during
  implementation.
- Have the Style Dictionary build emit `@plugin "daisyui"` metadata that
  excludes the `properties` base block and `radialprogress` component because
  Vite's Lightning CSS optimizer still warns on the Houdini `@property` rule it
  injects. Re-enable once the optimizer accepts `@property` or a project
  requirement introduces the component.
- Implementation checklist:
  1. Extend the Style Dictionary build to output:
     - `tokens/dist/tailwind.theme.cjs` exporting `theme.extend` fragments and
       DaisyUI theme objects.
     - `tokens/dist/tokens.css` containing CSS custom properties (for Radix and
       raw CSS consumers) plus an `@theme` block Tailwind can pick up.
  2. Import `tokens/dist/tokens.css` at the top of `src/index.css` before the
     Tailwind `@import`.
  3. Add `@config "./tailwind.config.cjs";` to `src/index.css` so Tailwind v4
     reads the JS config.
  4. Update `tailwind.config.cjs` to consume the generated JS exports:
     - Spread `theme.extend` with spacing, radius, and colour tokens.
     - Register DaisyUI themes so `wildsideNight` is the default and
       `wildsideDay` is marked with `--preferslight`.
  5. Include `@tailwindcss/vite` in `vite.config.ts` to ensure HMR picks up
     token rebuilds, and wire watch paths to `tokens/dist`.
  6. Ensure the GitHub Pages workflow runs `bun run tokens:build` before
     `bun run build` so compiled CSS/JS are fresh.
- Tokens CSS now contains both the DaisyUI `@plugin` configuration and the
  theme definitions, letting the app import a single file for runtime tokens,
  Tailwind `@theme`, and DaisyUI setup.

## Component architecture direction

- Define a shared layout shell component providing the mobile frame, status bar
  spacers, and background gradients. This prevents duplication across the 12
  screens.
- Identify Radix primitives needed per flow:
  - Dialog/Sheet for overlays and modals.
  - Tabs or Accordion for multi-step sections.
  - Slider and Checkbox controls for custom filters.
  - Progress for the walk wizard step indicator.
- Create composable components (`InterestChip`, `ProgressHeader`, `WalkCard`)
  that encapsulate repeated styling patterns observed in the HTML mockups.
- Keep each module under 400 lines by dividing large flows into route-level
  containers and child components. Place feature-specific hooks and fixtures
  alongside their components.

### Proposed module layout

- `src/app/providers`
  - `theme-provider.tsx`: wraps children, reads generated DaisyUI themes, and
    exposes helpers for toggling `data-theme` (reusing `applyTheme` + context).
  - `query-client.tsx`: initializes TanStack Query for future data wiring, even
    if mock data is static today.
- `src/app/layout`
  - `mobile-shell.tsx`: renders the 390 x 844 device frame, optional background
    gradients, safe-area padding, and a slot for page content.
  - `app-header.tsx`: shared top bar with configurable actions (back, share,
    help).
- `src/app/features`
  - `discover`: onboarding carousel, interest chips (`Radix ToggleGroup`),
    progress indicator.
  - `map`: map view shell with Radix `Tabs` for switching stops/map/notes and a
    sheet component for point-of-interest details.
  - `wizard`: multi-step flow leveraging `Stepper` built from Radix
    `Tabs`/`Progress`/`Slider`.
  - `safety`, `offline`, `auth`: standalone pages with shared layout tokens.
- `src/app/routes`
  - Static routes powered by TanStack Router (e.g., `/discover`, `/map/quick`,
    `/wizard/advanced`). Each route composes the relevant feature module.
- Router instances normalize `import.meta.env.BASE_URL` to honour GitHub Pages
  prefixes (for example, `/wildside-mockup`) so direct deep links resolve.
- `src/app/data`
  - JSON/TS modules representing the mock content (walk cards, interests,
    stats) to keep JSX clean and enable future API wiring.

### Radix primitive mapping

- `Dialog`/`Sheet`: saved walk share modal, offline download prompt, wizard
  confirmation.
- `Tabs`: map/stops/notes switches, onboarding stepper controls.
- `Accordion`: safety checklist sections.
- `Progress`: wizard step indicator and completion stats.
- `Slider`: duration control, pace selectors.
- `Checkbox`/`ToggleGroup`: interest chips and accessibility filters.
- `Toast`: feedback when saving walks or completing actions.
- `Popover`/`Tooltip`: inline help icons, map annotations.

## Localized descriptor registries

- Add a shared `LocalizedDescriptor` type in `src/app/i18n/descriptors.ts`
  capturing the minimal metadata needed to render any label via Fluent:
  `id`, `labelKey`, optional `descriptionKey`, and presentational fields such
  as `iconToken` or `emoji`. Keep the module text-free so it can be imported on
  both client and server without loading the translation runtime.
- Runtime localization now lives in
  `src/app/lib/localization-runtime.ts` with `resolveLocalization`,
  `fallbackLocalization`, and `coerceLocaleCode` utilities; feature screens
  should import these rather than reimplementing fallbacks or locale coercion.
- Use the shared `useLocaleCode` hook (`src/app/i18n/use-locale-code.ts`) to
  normalize `i18n.language` to a supported `LocaleCode`, defaulting to `en-GB`
  when an unsupported tag is supplied.
- Build three registries under `src/app/data/registries/` that reuse the
  descriptor type:
  - `interestsRegistry` powers `/discover`, `/map/quick`, and `/wizard/step-1`.
    Each entry includes the Fluent keys plus any behavioural metadata (for
    example, filter tags or slider weights).
  - `difficultyRegistry` models “Easy”, “Moderate”, and “Challenging” chips.
    Store gradient tokens, recommended pace ranges, or walking duration bands
    alongside the Fluent keys, so every flow derives consistent visuals and
    heuristics from the same source.
  - `collectionsRegistry` describes the interest-led walk groupings shown on
    `/discover` (for example, “Street Art”, “Historic”). Extend entries with
    hero image URLs, CTA routes, and route counts, so cards stay data-driven.
- Define the actual copy inside `public/locales/<locale>/common.ftl` using
  predictable IDs such as `interest-foodie-label` or `difficulty-easy-label`.
  Include `defaultValue` fallbacks when calling `t()`, so existing English-only
  tests keep passing whilst translations load.
- Consumers load the registry, map over each descriptor, and call
  `useTranslation()` to resolve `labelKey`/`descriptionKey`. This keeps React
  components free of hard-coded strings and ensures every surface shows the
  user’s language without duplicating logic.
- Add at least one localization test per registry (for example, render the
  `/customize` or `/discover` route in Spanish) to confirm Fluent keys map to
  the expected locale output. This mirrors the current `/customize` Spanish
  test and guarantees that regressions surface before release.

## High-velocity accessibility-first testing plan

- Roll out a dual-harness test stack that keeps Bun + Happy DOM for fast unit
  and integration checks whilst introducing a Node + JSDOM harness for
  `*.a11y.test.tsx` suites so `axe-core` can analyse rendered output without
  fighting Happy DOM limitations. Surface both entry points via
  `bun test:a11y`, `bun test:a11y --watch`, and document usage in the testing
  guide.
- Refactor component tests to rely on Testing Library helpers and accessible
  queries only. Create shared assertions for ARIA, focus management, and
  `data-theme` expectations to make accessibility verification cheap across
  the Bun suites.
- Enforce accessible-first habits with linting: extend Biome/Semgrep/GritQL to
  warn when tests reach for `data-testid`, manual `querySelector`, or low-level
  DOM events where an accessible query or `userEvent` style action applies.
  Block merges on these diagnostics and provide guided suppressions for the
  rare cases where semantics are genuinely absent.
- Augment Playwright’s outer loop with in-browser `axe-core` runs, scripted
  keyboard traversal, focus trap checks, and both visual and accessibility tree
  snapshots. Create custom matchers (for example, `toMatchAriaSnapshot`) and
  snapshot storage conventions so refactors cannot silently erode semantics or
  layouts.
- Wire a top-level `bun test:all` (or `bun verify`) orchestration that executes
  lint, Bun suites, Node accessibility suites, and Playwright flows. Integrate
  it into CI alongside per-commit quick checks, and schedule periodic snapshot
  reviews so baselines remain trustworthy.

## Map state persistence plan

- Preserve a single MapLibre instance per page view by letting
  `WildsideMap` cache the map handle in a ref, defaulting to shared
  constants for `center`/`zoom`. This prevents React re-renders from
  tearing the canvas down when chips, sliders, or dialogs toggle state.
- Create a lightweight `MapStateProvider` (React context backed by
  `useSyncExternalStore`) so overlays can read and mutate viewport data
  without causing the map canvas to re-render. The provider should expose
  imperative helpers (`setViewport`, `highlightPois`, `toggleLayer`) that
  translate to MapLibre API calls.
- Mount the provider at the route root for `/map/*` screens so the map’s
  camera, selected stops, and layer visibility persist when navigating
  between tabs or into `/saved` and back.
- Refactor `MapViewport` to consume the provider for derived UI state
  (e.g., active POI, hover state) while memoizing overlay components to
  avoid unnecessary React diffs.
- Defer expensive GeoJSON loading until the provider initializes the map,
  then stream updates through the shared instance rather than passing data
  via props on every render.
- Add regression tests that simulate interest toggles and favourite
  switches, asserting that the map ref remains stable and layers stay
  attached, ensuring future UI tweaks do not reintroduce canvas churn.

## Migration workflow

- Stage 0 – Foundations:
  1. Implement token build pipeline and DaisyUI theme plumbing.
  2. Ship shared layout components and global providers.
  3. Load mock data fixtures (walk metadata, interests, safety tips).
- Stage 1 – Onboarding and discovery:
  - `discover`, `explore`, `customize`.
  - Focus on Radix `Tabs`/`Carousel` patterns, interest chips, CTA buttons.
  - See the implementation notes below for component breakdown and routing.
- Stage 2 – Map experiences:
  - `map-quick-walk`, `map-itiniary`, `saved`.
  - Introduce map canvas placeholder, Radix `Tabs` for stops/map/notes, and
    sheet/dialog overlays for POI detail.
- Stage 3 – Wizard flow:
  - `walk-wizard-1/2/3`.
  - Build shared wizard stepper, slider, and Radix `Dialog` for confirmations.
- Stage 4 – Completion and offline support:
  - `walk-complete`, `offline`, `safety-accessibility`.
- Emphasize `Accordion` for safety lists and celebratory toasts/modals.
- Stage 5 – Account handling:
  - `sign-in`.
  - Wire Radix `Dialog`/`Popover` patterns for tooltips and integrate form
    validation scaffolding.
- For each page implementation:
  1. Catalogue UI states from the mockup and confirm data dependencies.
  2. Map UI elements to reusable components defined in the architecture plan.
  3. Implement route component and supporting feature pieces (hooks, fixtures).
  4. Cover interactive logic with Vitest + Testing Library (tabs, dialog open,
     slider updates, toasts).
  5. Manually validate in Vite preview, capture notes in this design log, and
     update documentation where behaviour diverges.
- Reassess the backlog after each stage to identify refinements or newly shared
  components worth extracting.

### Stage 1 implementation notes (26 October 2025)

- Adopt TanStack Router for the shell to unlock simple route-level code
  splitting and future data loaders. Each page module will live under
  `src/app/routes/<slug>/route.tsx` with colocated feature components inside
  `src/app/features/<slug>/`.
- `discover` will wrap Radix `ToggleGroup` (multi-select) for interest chips,
  reflecting the mockup’s chip states and counter. Shared chip styling moves
  into an `InterestChip` component so future flows can reuse the pattern.
- `explore` renders catalogue data (cards, collections, activity feed) sourced
  from structured fixtures. Horizontal scrollers use Radix `ScrollArea` for
  accessible overflow controls, while cards lean on DaisyUI `card` tokens to
  keep markup concise.
- `customize` replaces raw `<input type="range">` sliders with Radix `Slider`,
  adds segmented toggles for crowd/elevation preferences, and surfaces helper
  copy via the shared header. Slider values remain mock-driven but exposed
  through component state for testing.
- Continue loading Font Awesome via `@fortawesome/fontawesome-free` for icon
  parity with the mockups. Evaluate Tabler/Remix in a later spike once flows
  are ported.

#### `/customize` localization strategy (entity-first)

- Fixture objects for sliders, segmented options, surface chips, interest
  weights, advanced toggles, and route previews now ship localization
  maps. Components call `pickLocalization` with `i18n.language` once per
  render; no per-option Fluent messages remain.
- Fluent remains responsible for screen chrome and aria scaffolding only
  (header copy, section headings, regenerate/start CTAs, and the
  `customize-interest-thumb-aria` message). This keeps user-facing options
  aligned to the data model while allowing locale-specific chrome to change
  independently.
- Route previews point at real `Route` entities by ID; distance and duration
  come from the shared route fixtures rather than duplicated literals.
- Advanced toggles, surface options, and interest slices follow the same
  fallback behaviour used on Explore, so sparse locale coverage yields stable
  copy instead of missing labels.
- Bottom navigation still resolves `nav-{id}-label` through Fluent to keep
  tab naming consistent whilst falling back to the fixture text in default
  locales.
- Safety & accessibility mirrors this approach: accordion sections and
  toggles resolve labels from `safetyToggles` localization maps, presets map
  to toggle IDs, and Fluent keeps only the header, CTA, and dialog chrome.

#### `/wizard` localization strategy (step scaffolding + Fluent)

- `WizardLayout` now maps wizard IDs (`step-1`, `step-2`, `step-3`) to
  Fluent keys of the form `wizard-step-{id}-title` and
  `wizard-step-{id}-description` before rendering the stepper. This keeps the
  TanStack Router and tests focused on IDs, while Fluent controls visible copy.
- Shared chrome strings (`wizard-header-*`, `wizard-help-placeholder`) live in
  Fluent, so the back/help controls and placeholder alerts stay consistent
  across all wizard steps.
- Step-specific controls follow the same prefix strategy as `/customize`. For
  example, `/wizard/step-1` exposes slider copy through
  `wizard-step-one-duration-*` keys and reuses
  `wizard-step-one-interests-*` for chip headings, aria labels, and plural
  counters. The React components pass English `defaultValue` strings to
  `t(...)`, keeping Vitest snapshots deterministic until translators provide
  locale-specific copy.
- Future wizard steps should continue deriving Fluent keys from control IDs to
  ensure accessibility labels, headings, and summary strings remain localizable
  without reshaping fixtures.
- `/wizard/step-2` now follows the same Fluent prefix strategy: discovery slider
  headings, summary chips, and CTA strings resolve via `wizard-step-two-*`
  keys, while `accessibilityOptions` IDs map to
  `wizard-step-two-accessibility-{id}-{label|description}`, so copy stays
  localizable without reshaping fixtures.
- Slider summary states have dedicated keys (`hidden`, `hotspots`, `balanced`)
  which keeps translator tone independent of the numeric thresholds and gives
  future locales freedom to adjust phrasing without changing TypeScript.
- Footer CTAs reuse `wizard-header-back-label` for the back action and add a
  single `wizard-step-two-review` key for “Review walk”, keeping repeated copy
  deduplicated for translators.
- A Spanish Vitest now renders `/wizard/step-2` to guard the new keys and prove
  the route survives when `i18n` switches language, mirroring the
  `/customize` precedent for regression coverage.
- `/wizard/step-3` lifts route stats, highlight fixtures, generated stops, and
  weather copy into data structures with Fluent key metadata. Components
  resolve `wizard-step-three-*` keys at render time, so panel headings, aria
  labels, dialog copy, stats units, and stop notes all follow the same fallback
  pattern as earlier steps.
- Highlight descriptors reuse existing keys where possible (for example,
  `wizard-step-two-accessibility-well-lit-label`) and introduce `*-detail`
  keys for supporting text, so translators can keep tone consistent without
  touching TypeScript.
- The review CTA dialog translates via shared keys and mirrors the reusable
  pattern from Step 2, ensuring wizard footer actions stay consistent across
  languages.
- Stage 3 route tests now include a Spanish locale run to guarantee the
  translated panels, dialog copy, and footer CTAs render as expected.
- `/safety-accessibility` promotes the same localization contract: accordion
  sections, toggles, presets, CTA copy, and the confirmation dialog all pull
  from Fluent IDs (`safety-section-*`, `safety-toggle-*`, `safety-preset-*`).
  Toggle labels reuse existing wizard keys when wording matches (for example,
  the well-lit preference), keeping translations deduplicated. The dialog chips
  now resolve from the same toggle descriptors to avoid ad hoc string
  formatting.

#### RTL direction + logical layout decisions

- The i18n runtime calls `applyDocumentLocale` whenever a language change
  resolves. This helper looks up metadata in `SUPPORTED_LOCALES`, updates
  `lang`, `dir`, and `data-direction` on both `html` and `body`, and becomes the
  single source of truth for layout direction.
- UI components switched from `text-left`/`text-right` to logical utilities:
  `.text-start`, `.text-end`, and logical inset properties (for example,
  `.discover-screen__skip` uses `inset-inline-end`). These rules deliver LTR and
  RTL parity without duplicating markup.
- `WildsideMap` now registers the MapLibre RTL text plugin via
  `ensureRtlTextPlugin`, so glyphs render correctly for Arabic/Hebrew locales
  and fallback symbol layers always expose `text-field` definitions.

#### Progress (26 October 2025)

- `discover`, `explore`, and `customize` screens now render via Radix feature
  modules and TanStack Router routes. Components consume generated tokens and
  DaisyUI primitives instead of inline Tailwind scripts.
- Introduced a shared `FontAwesomeIcon` wrapper to centralize icon rendering
  and accessibility handling. This keeps Font Awesome in play while we plan
  future icon set evaluations.
- Added smoke tests for the three routes to exercise Radix interactions
  (toggle chips, navigation buttons, switch toggles). Tests mount the router
  with a memory history to mirror the SPA shell.
- Outstanding follow-ups: hook up real TanStack query data sources once mock
  fixtures stabilize, and extend coverage to the remaining mockup flows per the
  migration workflow.

### Stage 2 implementation notes (27 October 2025)

- Replace static map placeholders with a reusable `WildsideMap` component that
  lazily initializes MapLibre against the OpenMapTiles Bright demo style. The
  loader guards against non-WebGL environments, so unit tests continue to run.
- Update `MapViewport` to accept either a live map or fallback imagery while
  keeping overlay positioning consistent across flows.
- Wrap the quick generator, itinerary, and saved screens in Radix `Tabs`
  (`Map`, `Stops`, `Notes`), so content is discoverable without scrolling.
  Persist tab content with `forceMount` for accessibility and easier test
  targeting.
- Surface point-of-interest (POI) details via a shared
  `PointOfInterestList` component backed by Radix `Dialog`, giving us mobile
  sheet behaviour for both the itinerary and saved flows.
- Keep quick adjustments (sliders, interest chips) on the map tab, while
  exposing the POI list and planning notes in adjacent tabs to mirror the
  mockup’s emphasis on lightweight switching between contexts.
- Extend router coverage to verify map-tab interactions (chip toggles and
  navigation), share dialogs, and favourite toggles, so future changes to the
  MapLibre integration remain tested.

#### Progress (27 October 2025)

- `/map/quick`, `/map/itinerary`, and `/saved` now render MapLibre canvases
  with gradient overlays, Radix tabs, and sheet-style POI dialogs. The quick
  generator retains the duration/interest controls within the `Map` tab, while
  the other tabs surface stops and planning notes.
- Introduced shared components (`WildsideMap`, `PointOfInterestList`,
  `AppBottomNavigation`) to eliminate duplicated markup between map flows and
  the explore/customize screens.
- Tests exercise the new tabbed experiences and share modals; the Happy DOM
  harness now polyfills `NodeFilter`/`HTMLInputElement`, so Radix focus scopes
  operate without runtime errors even when MapLibre short-circuits.
- The quick map "magic wand" routes directly into the walk wizard to keep the
  exploratory and guided flows connected; coverage ensures the navigation
  remains intact.
- Tab bar layout now uses a non-shrinking tab list, so the Map/Stops/Notes
  triggers remain pinned; Playwright regression coverage protects the layout
  across tab switches.
- Quick map Stops/Notes panels now render on their own blurred surfaces, so the
  generator card no longer overlaps when switching tabs.
- Bottom navigation styling is now shared between explore and map flows,
  with end-to-end coverage confirming the handset baseline stays consistent.
- Updated the Explore screen bottom navigation ordering to emphasize the map-first
  journey while retaining parity with the map screens.
- Added Playwright + axe accessibility smoke tests for `/explore`, `/map/quick`,
  and `/wizard/step-1`, applying targeted slider labelling and landmark fixes to
  keep results clean.
- Added a `MapStateProvider` so `/map/*` routes and `/saved` share a single
  MapLibre instance. `WildsideMap` now registers with the provider to reuse
  the active viewport and avoid canvas churn when overlays update.
- Provider-backed highlight helpers keep POI interactions reactive: hovering
  a stop toggles feature-state on the shared source without re-rendering the
  map, and new unit tests guard the store’s behaviour with mocked MapLibre
  calls.
- Map tabs synchronize with URL fragments (`#map`, `#stops`, `#notes`) while
  keeping the MapLibre canvas mounted, so deep links preserve context without
  blanking the background.

### Stage 4 implementation notes (27 October 2025)

- Ported the walk completion summary, offline manager, and safety & accessibility
  routes using the shared shell. The completion view introduces a Radix toast
  and share dialog to deliver the celebratory experience from the mockups.
- Built offline storage fixtures and travel hints so the screen can surface
  download progress, dismissible suggestions, and future map actions.
- Implemented the safety screen with Radix Accordion + Switch components, making
  the toggles stateful and surfacing a confirmation dialog when preferences are
  saved.
- Added happy-dom unit coverage for fragment-driven tabs and new Stage 4 routes
  alongside Playwright smoke tests to ensure rating toasts, offline cards, and
  accordion interactions remain functional.

### Stage 3 implementation notes (27 October 2025)

- Introduce a `WizardLayout` that centralizes header actions (back/help), the
  three-step progress indicator, and sticky action bar. Each step screen plugs
  in content via slots to keep transitions lightweight.
- Build a `WizardStepper` component that can render active, completed, and
  pending states for the three steps; reuse it to drive in-screen progress and
  help with automated testing.
- Extract wizard-specific data (`wizardSteps`, chip/toggle options, summary
  highlights) so steps share semantics and the confirmation summary can reflect
  configured preferences.
- Use Radix `Dialog` for confirmation prompts (e.g., generating the custom
  route) and re-use existing slider/toggle primitives (Radix `Slider`,
  `ToggleGroup`, `Switch`) to drive interactive controls.
- Expand router coverage to include the wizard flow, ensuring the stepper
  highlights the correct stage and that dialog-driven confirmations render.
- Wizard layout renders inside `MobileShell` so wizard screens inherit the
  device frame and tonal styling used by other routes.

## Verification plan

- Local automation:
  - `bun run fmt` (Biome write mode) before staging to keep Markdown and TS in
    sync with formatting rules.
  - `bun run lint` (Biome CI). Address existing rule violations incrementally;
    track outstanding suppressions in this log.
  - `bun run check:types` to ensure TS stays strict as components are migrated.
  - `bun run test` to execute Vitest suites. Add coverage thresholds once the
    component set stabilizes.
  - `bun run test:e2e` for Playwright smoke coverage over high-risk flows.
  - `bun run tokens:build` (to be added) ahead of `bun run dev`/`bun run build`
    so generated CSS/JS reflect current token definitions.
- Visual QA:
  - Capture Storybook-style reference states using Vite preview + Playwright
    screenshots once key flows exist.
  - Run `bunx playwright test --project=chromium --grep @a11y` for targeted Axe
    scans (tests to be authored) and document deltas here.
- Documentation checks:
  - `bunx markdownlint 'docs/**/*.md'` until a dedicated `make markdownlint`
    target exists.
  - Update this file and relevant docs after every significant decision or
    deviation from mockups.
- CI alignment:
  - Ensure the GitHub Pages workflow runs the same commands (`fmt`, `lint`,
    `check:types`, `test`, `tokens:build`, `build`) and fails fast on token or
    lint regressions.

## Open questions

- Determine timeline and success criteria for evaluating alternative icon sets.
- Define local developer ergonomics for token rebuilds (for example, `bun run
tokens:build`) and ensure documentation reflects the expected workflow.

## Display mode toggle roadmap (29 October 2025)

- Objective: introduce a persistent display-mode toggle so the mockup can
  switch between the framed handset shell and a responsive full-browser view.
  Full-browser mode must hide the controls within a tabbed drawer and be the
  default for mobile visitors, while desktop browsers land in the hosted shell.
- Assumptions: the existing theme toggle remains in the UI; layout logic lives
  client-side (no SSR). We can rely on `window.matchMedia` and viewport width
  to infer device class, and degrade gracefully when the APIs are unavailable.

### Plan

- Create `DisplayModeProvider` under `src/app/providers` mirroring the theme
  context. Persist the selected mode to `localStorage`, honour device defaults
  on first load, and expose helpers to query and set the active mode.
- Extend the root route (`src/app/routes/root-route.tsx`) with a combined
  floating control stack. Embed the theme toggle and a new display toggle, then
  surface the same controls inside a retractable tab drawer when in
  full-browser mode. Ensure keyboard focus and ARIA labelling work in both
  presentations.
- Refactor `MobileShell` to render either the existing 390 × 844 frame or a
  responsive wrapper. Preserve the `background` slot and add sensible paddings
  for wide layouts. Screens should opt-in implicitly via the provider rather
  than updating imports.
- Audit feature screens for responsive gaps. Add max-width containers and
  flex/grid fallbacks so expanding beyond the handset width does not create
  sparse or broken layouts. Prioritize the Discover screen, map, wizard, and offline
  flows, which carry the densest UI.
- Implement a tabbed drawer component that tucks controls away in
  full-browser mode. The drawer should collapse to a discreet edge tab,
  re-expand on focus/hover, and respect reduced-motion preferences.

### Roadmap

1. Provider and defaults (0.5 day)
   - Ship `DisplayModeProvider`, hook it into `AppRoutes`, and cover detection
     logic with unit tests.
   - Add localStorage contract tests and document fallbacks when storage is
     unavailable.
2. Layout integration (0.75 day)
   - Update `MobileShell` and affected feature screens; run responsive sweeps
     at key breakpoints (360 px, 768 px, 1024 px).
   - Replace the existing floating button with the combined control stack and
     drawer, validating accessibility (focus traps, labelling) via tests and
     Playwright axe scans.
3. Stabilization (0.75 day)
   - Expand unit/interaction tests (Happy DOM) to cover mode toggling and
     persistence.
   - Extend documentation (this file, plus any user-facing guides) and rerun
     `bun fmt`, `bun lint`, `bun check:types`, and `bun test` to close the
     loop.

### Risks and mitigations

- Responsive regressions: multiple screens assume a fixed width. Mitigate by
  introducing shared `content` wrappers with max widths and by snapshotting key
  layouts before and after adjustments.
- Drawer discoverability: users might miss the controls when hidden. Provide a
  subtle label and maintain keyboard focus outlines so the tab remains obvious,
  and document any follow-up usability findings.
- Default detection flash: initial hydration might briefly show the wrong
  mode. Handle by initializing state in an effect based on device heuristics,
  and gate rendering until the mode resolves.

#### Progress (29 October 2025)

- Shipped the `DisplayModeProvider` with localStorage persistence and viewport
  heuristics. Unit tests cover default inference, persistence, and resets.
- Refactored `MobileShell` to render hosted and full-browser layouts, adding a
  max-width surface for wide screens. Route and fragment tests wrap the router
  in the new provider to mirror production.
- Introduced `GlobalControls`, combining theme and display toggles. Hosted mode
  renders a floating button stack; full-browser mode exposes a right-edge
  drawer with accessible labelling. New unit coverage exercises toggle flows
  and reset behaviour.
- Updated Playwright suites to expect the drawer, simplifying tab alignment
  checks to accommodate both layouts while ensuring all axe scans remain
  passing.
