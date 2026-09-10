# Implementation Plan

## Overview

This plan fixes the `QueueDemo` queue-simulation bug in `src/LandingPage.jsx` (where releasing the queue shrinks the present visitor pool instead of admitting waiting visitors) and corrects redundant/inconsistent page copy. It follows the exploratory bugfix workflow: first stand up a test runner, then write a bug-condition exploration test (fails on unfixed code) and preservation tests (pass on unfixed code), then apply the logic and phrasing fixes, and finally validate that the bug is resolved with no regressions.

## Tasks

- [x] 1. Set up the test runner (Vitest)
  - This is a Vite/React project with no test runner configured yet (see `package.json`: only `dev`, `build`, `preview` scripts)
  - Add dev dependencies: `vitest`, `@vitest/coverage` optional, and `fast-check` for property-based testing (Testing Strategy → Property-Based Tests, Preservation Checking)
  - Add a `"test": "vitest --run"` script to `package.json` (single execution, NOT watch mode; do not start a long-running dev server for verification)
  - Configure Vitest in `vite.config.js` (or a `vitest.config.js`) with `environment: "node"` - the tests target the pure `QueueDemo` derived-value math, so no DOM environment is required
  - Create a small extracted/mirrored pure helper module for the derived-value model so tests can import it without rendering React. Options: (a) export a `computeDemoState({ visitors, released, capacity })` helper from `src/LandingPage.jsx`, or (b) reproduce the exact formulas in the test file. Prefer (a) so tests bind to real code
  - Verify the runner works with a trivial passing test before proceeding
  - _Requirements: (tooling prerequisite for 2.1, 2.2, 3.1–3.4)_

- [x] 2. Write bug condition exploration test
  - **Property 1: Bug Condition** - Releasing the queue admits waiting visitors into the site
  - **CRITICAL**: This test MUST FAIL on the unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails at this step**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug in `QueueDemo` (`src/LandingPage.jsx`), confirming the root cause that `released` shrinks the present pool (`remaining = visitors - released`)
  - **Scoped PBT Approach**: The bug is deterministic; scope the property to the concrete failing traffic levels (`Ramai` = 18, `Lonjakan` = 30, both with `capacity = 8`) and a sequence of release presses (+`min(4, queued)` each). Reproduce the derived-value math against the UNFIXED formulas
  - Encode `isBugCondition(input)` from design: `(input.visitors - input.capacity - input.released) > 0 AND userReleasesQueue(input)`
  - Assert the Expected Behavior Properties (Property 1 / bugfix 2.1, 2.2):
    - After a release while a queue remains, `active` (`Di dalam situs`) stays at `capacity` (8)
    - `queued` strictly decreases by the number released (up to 4)
    - The present population (`visitors`) does NOT decrease - no visitor disappears from the simulation
    - `active` only falls below `capacity` once `queued === 0` and `visitors < capacity`
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found, e.g. "Ramai: release +4 drops present pool 18→14 (visitors vanish)"; "Lonjakan: repeated release drives `active` below 8 while a queue was supposed to be draining"
  - Mark task complete when the test is written, run, and the failure is documented
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 3. Write preservation property tests (BEFORE implementing the fix)
  - **Property 2: Preservation** - Non-release and out-of-queue behavior unchanged
  - **IMPORTANT**: Follow the observation-first methodology - observe behavior on the UNFIXED code first, then encode it
  - Encode `NOT isBugCondition(input)`: Normal level (`visitors = 6 <= capacity`, no queue), empty-queue states (`queued === 0`), and level-change resets
  - Observe on UNFIXED code and record the outputs:
    - Normal level: `visitors = 6` → no queue (`queued = 0`), `active = 6`, release button disabled
    - Empty-queue: when `queued === 0` the release button is disabled and the `"Ubah trafik untuk mencoba lagi."` prompt shows
    - Level-change reset: changing `level` resets `released` to `0` and recomputes the queue from the new visitor total (`changeLevel`)
    - Status line: three states - `queued > 0` → "Kapasitas situs tetap terjaga"; else `released > 0` → "Antrean selesai, semua sudah masuk"; else "Slot tersedia, langsung masuk"
  - Write property-based tests (using `fast-check`) over random `(level, released)` combinations where the bug condition is false, asserting fixed output equals the observed original output (Preservation Checking pseudocode: `FOR ALL input WHERE NOT isBugCondition(input): originalDemo(input) == fixedDemo(input)`)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms the baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on the unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Fix the QueueDemo queue-simulation logic

  - [x] 4.1 Redefine the derived values and instruction text in `QueueDemo`
    - In `src/LandingPage.jsx` → `QueueDemo`, keep `level` and `released` state and `changeLevel` unchanged
    - Replace the derived-value computation so the present pool stays constant and `released` means "admitted from the queue":
      - `const visitors = trafficLevels[level].visitors;`
      - `const queued = Math.max(0, visitors - capacity - released);`
      - `const active = Math.min(capacity, visitors - queued);`
      - `const remaining = queued;` // arrivals ("Pengunjung") column now shows the waiting queue
    - Keep the release handler bound to the new `queued`: `onClick={() => setReleased((value) => value + Math.min(4, queued))}` (this stays correct since `released` is now bounded by `visitors - capacity`)
    - Replace the contradictory instruction text in `lp-demo-action`: when `queued > 0` use copy consistent with the release action (e.g. "Loloskan 4 pengunjung ke dalam situs.") instead of "Coba kosongkan 4 slot di situs."; keep "Ubah trafik untuk mencoba lagi." when `queued === 0`
    - Leave the metrics ("Dalam antrean" → `queued`, "Di dalam situs" → `active` / `capacity`), the arrivals dots (`i < remaining`), the in-site slots (`i < active`), and the three-way status line intact - they read correctly under the fixed model
    - If task 1 extracted a `computeDemoState` helper, update it to match these formulas so the tests bind to real code
    - _Bug_Condition: isBugCondition(input) = (input.visitors - input.capacity - input.released) > 0 AND userReleasesQueue(input) (from design)_
    - _Expected_Behavior: on release, `active` stays at `capacity` while a queue remains, `queued` strictly decreases by the number released, `visitors` unchanged, `active` falls below `capacity` only once `queued === 0` and `visitors < capacity` (Property 1)_
    - _Preservation: Preservation Requirements from design (Normal level, empty-queue disabled state, level-change reset, status-line states, untargeted copy/structure)_
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

  - [x] 4.2 Verify the bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Releasing the queue admits waiting visitors into the site
    - **IMPORTANT**: Re-run the SAME test from task 2 - do NOT write a new test
    - The test from task 2 encodes the expected behavior; when it passes it confirms the fix admits queued visitors into the site correctly
    - Run the bug condition exploration test from task 2
    - **EXPECTED OUTCOME**: Test PASSES (confirms the bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [x] 4.3 Verify the preservation tests still pass
    - **Property 2: Preservation** - Non-release and out-of-queue behavior unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 3 - do NOT write new tests
    - Run the preservation property tests from task 3
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in Normal level, empty-queue, level-change reset, and status-line behavior)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5. Apply the text / phrasing corrections

  - [x] 5.1 Rewrite the redundant FAQ answer in `src/LandingPage.jsx`
    - In the `faqs` array, rewrite the answer for "Bagaimana cara mendapatkan akses?" to remove the "administrator Anda … administrator platform … admin workspace" repetition
    - Preserve the meaning: accounts are provisioned by an administrator; workspace admins can add team members to manage or monitor rooms
    - Keep tone, structure, and the question text unchanged
    - _Requirements: 1.4, 2.4_

  - [x] 5.2 Consistency pass across page copy in `src/LandingPage.jsx`
    - Review hero (`lp-hero-copy`), workflow steps (`lp-steps`), features (`lp-feature-list`), integrations (`integrations` object + `Integrations` copy), footer (`lp-footer`), and metric labels ("Dalam antrean" / "Di dalam situs")
    - Adjust only wording where phrasing is inconsistent or unclear; preserve meaning, tone, structure, links, and all accessibility attributes (ids, aria-*, roles)
    - Do NOT change layout, component structure, or any non-copy attributes (regression prevention 3.5, 3.6)
    - _Requirements: 1.5, 2.5, 3.5, 3.6_

  - [x] 5.3 Align meta / social copy in `index.html`
    - Update `description`, `og:description`, `twitter:description`, the JSON-LD `description`, and the `noscript` copy only where inconsistent with the on-page copy
    - Preserve meaning and all tags, attributes, and structured-data fields
    - _Requirements: 1.5, 2.5, 3.5_

  - [x] 5.4 Add static string assertions for the phrasing changes
    - Add unit tests asserting the corrected FAQ answer no longer contains the redundant repetition and the demo instruction text matches the release action (`queued > 0` copy is not "Coba kosongkan 4 slot di situs.")
    - These verify the phrasing changes without rendering (Testing Strategy → "phrasing changes are verified by static string assertions")
    - _Requirements: 2.3, 2.4, 2.5_

- [x] 6. Add the remaining unit and property-based tests from the Testing Strategy
  - **Unit tests**: derived-value computation for each traffic level (`Normal` = 6, `Ramai` = 18, `Lonjakan` = 30) at `released = 0`; release handler advances `released` by `min(4, queued)` and never overshoots; `queued === 0` disables the button and release is a no-op; `active` never exceeds `capacity`; the status-line conditional resolves to the correct one of the three strings
  - **Fix-checking property** (design → Fix Checking pseudocode): `FOR ALL input WHERE isBugCondition(input)`: after release `active == capacity` while a queue remains, `queued(after) == max(0, queued(before) - 4)`, and present population unchanged
  - **Property-based tests**: for random `(level, sequenceOfReleases)`, `active === capacity` whenever `queued > 0` and `queued` is monotonically non-increasing across releases; present population (`visitors`) is invariant across any number of releases
  - Run all tests with `vitest --run`
  - **EXPECTED OUTCOME**: all tests pass
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

- [x] 7. Checkpoint - Ensure all tests and the build pass
  - Run the full test suite once (`vitest --run` / `npm test`) and confirm every test passes (Property 1 fix test, Property 2 preservation tests, unit, fix-checking, and property-based tests)
  - Run the production build (`npm run build`) and confirm it completes without errors
  - Do NOT start a long-running dev server or watch process for verification
  - Ensure all tests pass; ask the user if questions arise
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

## Notes

- **Test-runner setup**: This is a Vite/React project with no test runner configured (`package.json` only has `dev`, `build`, `preview`). Task 1 adds Vitest + `fast-check` and a `"test": "vitest --run"` script before any tests are written.
- **Single-run only**: Always run tests with `vitest --run` (single execution). Do NOT use watch mode, and do NOT start a long-running dev server for verification - use `npm run build` at the checkpoint instead.
- **Observation-first ordering**: The bug-condition exploration test (task 2) is expected to FAIL on unfixed code, and the preservation tests (task 3) are expected to PASS on unfixed code. Do not attempt to fix code while writing these tests.
- **Bind tests to real code**: Prefer extracting a pure `computeDemoState` helper so tests import the actual formulas rather than duplicating them.
- **Task ordering**: Exploration and preservation tests must be written and run before the fix (tasks 4–5).
