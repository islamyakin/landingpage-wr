# Landing Page Fixes Bugfix Design

## Overview

This bugfix targets two problems on the Antosan landing page (a React/Vite SPA with Indonesian UI copy), scoped to `src/LandingPage.jsx` and `index.html`.

1. **Queue simulation logic bug** in the `QueueDemo` component. The interactive hero demo is meant to illustrate a virtual queue: releasing the queue ("Loloskan antrean") should *admit waiting visitors into the site's open slots*. The current code instead treats `released` as a subtraction from the present visitor pool (`remaining = visitors - released`), which drains people out of the simulation entirely and lets "Di dalam situs" fall below capacity while a queue still exists. The fix reworks the derived state so that the present population (`visitors`) stays constant, `released` counts *queued visitors admitted into the site*, "Di dalam situs" (`active`) stays pinned at `capacity` while a queue remains, and the waiting pool (`queued`) drains toward zero. The contradictory instruction text ("Coba kosongkan 4 slot di situs.") is replaced with copy consistent with the release action.

2. **Text / phrasing corrections** in the Indonesian copy. A redundant FAQ answer ("Bagaimana cara mendapatkan akses?") is rewritten, and a light consistency pass is applied across hero, workflow, features, integrations, footer, metric labels, and the demo instruction text, plus `index.html` meta/social copy — preserving meaning and tone.

The strategy is minimal and targeted: change only the `QueueDemo` derived-value computation, its button handler, and its instruction text for the logic bug; and edit only the specific copy strings for the phrasing pass. All layout, structure, links, accessibility attributes, and other interactive controls remain untouched.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the queue-demo bug — a queue exists (`visitors - capacity > released` in the fixed model, i.e. present visitors exceed capacity and are not yet fully admitted) and the user releases the queue, causing present visitors to be removed from the simulation instead of admitted into the site.
- **Property (P)**: The desired behavior on release — queued visitors move into the site's open slots; "Di dalam situs" stays at `capacity` while a queue remains and only falls below `capacity` once the queue is empty and present visitors are fewer than `capacity`; no present visitor disappears from the simulation.
- **Preservation**: Existing behavior that must remain unchanged — the Normal traffic level (no queue, disabled button), the empty-queue disabled state, level-change resets, the status-line logic, and all copy/structure outside the targeted strings.
- **`QueueDemo`**: The React component in `src/LandingPage.jsx` that renders the interactive hero queue simulation.
- **`level`**: State (`useState(1)`) — index into `trafficLevels` selecting the traffic scenario (`Normal` = 6, `Ramai` = 18, `Lonjakan` = 30 visitors).
- **`released`**: State (`useState(0)`) — in the fixed model, the number of queued visitors that have been admitted into the site so far.
- **`visitors`**: Derived — `trafficLevels[level].visitors`, the constant present population for the current level.
- **`capacity`**: Module constant `8` — the number of in-site slots.
- **`active`**: Derived — visitors currently "Di dalam situs" (in the site), rendered by the `lp-site-slots` dots.
- **`queued`**: Derived — visitors currently waiting in the queue ("Dalam antrean").
- **`remaining`**: Derived value used for the arrivals ("Pengunjung") visualization; in the fixed model it represents the count still shown in the arrivals column (the waiting queue).

## Bug Details

### Bug Condition

The bug manifests when a queue exists (traffic level `Ramai` or `Lonjakan`, where `visitors > capacity`) and the user presses "Loloskan antrean". The handler increases `released`, and because `remaining` is defined as `visitors - released`, the present visitor pool shrinks. This drains visitors out of the simulation rather than moving queued visitors into the site's open slots, and eventually lets `active` (`Math.min(remaining, capacity)`, shown as "Di dalam situs") drop below `capacity` even though visitors were meant to be admitted, not removed.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type DemoState  // { visitors, released, capacity }
  OUTPUT: boolean

  // A queue exists and has not been fully admitted, and the user
  // presses "Loloskan antrean". In the buggy model this shrinks the
  // present pool (visitors - released) instead of admitting queued
  // visitors into the site's open slots.
  RETURN (input.visitors - input.capacity - input.released) > 0
         AND userReleasesQueue(input)
END FUNCTION
```

### Examples

- **Ramai, first release (bug):** `visitors = 18`, `released = 0` → buggy `remaining = 18`, `active = 8`, `queued = 10`. Press release (+4): buggy `released = 4` → `remaining = 14`, `active = 8`, `queued = 6`. Present pool dropped from 18 to 14 — four visitors vanished from the simulation instead of moving into the site. Expected: `active` stays `8`, `queued` drops `10 → 6`, present population stays `18`.
- **Ramai, near queue end (bug):** `visitors = 18`, `released = 8` → buggy `remaining = 10`, `active = 8`, `queued = 2`. Press release (+2): buggy `released = 10` → `remaining = 8`, `active = 8`, `queued = 0`. Present pool now `8` — ten visitors vanished. Expected: `active` = `8`, `queued` = `0`, present population still `18` (10 admitted + 8 in-site = but only 8 slots, so the excess remain represented as admitted-then-flowed-through in the illustration; key invariant: `active` never drops below `capacity` while any queue existed).
- **Lonjakan, full drain (bug):** `visitors = 30`. Releasing repeatedly drives `remaining` down toward `capacity`, so "Di dalam situs" appears to empty rather than stay full. Expected: `active` stays `8` throughout, `queued` drains `22 → 0`.
- **Normal (edge, no bug):** `visitors = 6 <= capacity` → `queued = 0`, button disabled, `active = 6`. No release possible; behavior must stay identical after the fix.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Normal traffic level (`visitors = 6 <= capacity`): all present visitors admitted, no queue, "Loloskan antrean" button disabled.
- Empty-queue state (`queued === 0`): the release button stays disabled and the instruction shows the "Ubah trafik untuk mencoba lagi." style prompt.
- Changing the traffic level resets `released` to `0` and recomputes the queue from the new visitor total.
- The status line reflects the correct state: "Kapasitas situs tetap terjaga" while queued, "Antrean selesai, semua sudah masuk" after releasing, "Slot tersedia, langsung masuk" when idle with open slots.
- All page sections not targeted by the phrasing review keep their existing structure, layout, links, and accessibility attributes.
- The Integrations tabs, mobile menu, skip link, and every other interactive control behave exactly as before (no functional change outside the queue demo).

**Scope:**
All inputs that do NOT involve pressing "Loloskan antrean" while a queue exists should be completely unaffected by the logic fix. This includes:
- Rendering at the Normal level (no queue).
- Rendering at any level before any release (initial derived values must match, given the corrected but visually-equivalent initial state).
- Every non-`QueueDemo` component and every string not explicitly listed for the phrasing pass.

**Note:** The expected correct behavior on release is defined in the Correctness Properties section (Property 1).

## Hypothesized Root Cause

Based on the bug analysis, the root cause is a modeling error in how `released` participates in the derived values:

1. **`released` subtracts from the present pool.** `remaining = visitors - released` treats a release as removing visitors from the simulation entirely, rather than reclassifying a queued visitor as admitted. This is the core defect.
   - `active = Math.min(remaining, capacity)` therefore falls below `capacity` once `remaining < capacity`, making the site look like it empties.
   - `queued = Math.max(0, remaining - capacity)` still decreases, which coincidentally looks right for the queue count, masking the fact that the present pool is shrinking.

2. **Visualization is bound to the shrinking pool.** The arrivals dots use `i < remaining`, so present visitors visibly disappear on release instead of flowing into the site.

3. **Instruction text mismatch.** "Coba kosongkan 4 slot di situs." describes emptying site slots, which contradicts the "Loloskan antrean" (release the queue) button — a copy/logic inconsistency reinforcing the wrong mental model.

The fix keeps `visitors` constant and redefines the split between `active` and `queued` in terms of `released` as *admitted-from-queue*, so `active` is pinned at `capacity` while a queue remains.

## Correctness Properties

Property 1: Bug Condition - Releasing the queue admits waiting visitors into the site

_For any_ demo state where the bug condition holds (a queue exists and the user presses "Loloskan antrean"), the fixed `QueueDemo` SHALL move queued visitors into the site's open slots: "Di dalam situs" (`active`) SHALL remain at full `capacity` while any queue remains, `queued` SHALL strictly decrease by the number released (up to 4), the present population (`visitors`) SHALL NOT decrease, and `active` SHALL only fall below `capacity` once the queue is empty and present visitors are fewer than `capacity`.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Non-release and out-of-queue behavior unchanged

_For any_ demo state where the bug condition does NOT hold (Normal level with no queue, an empty queue, or a level change reset), the fixed `QueueDemo` SHALL produce the same observable result as the original — the release button stays disabled when `queued === 0`, level changes reset `released` to `0`, the status line reports the same three states, and all copy/structure outside the targeted strings is preserved unchanged.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming the root-cause analysis is correct:

**File**: `src/LandingPage.jsx`

**Function**: `QueueDemo`

**Specific Changes**:

1. **Redefine the derived values so the present pool stays constant.** Keep `visitors` and `released` state as-is, but compute the queue split with `released` meaning "admitted from the queue":
   ```jsx
   const visitors = trafficLevels[level].visitors;
   const queued = Math.max(0, visitors - capacity - released);
   const active = Math.min(capacity, visitors - queued);
   const remaining = queued; // arrivals ("Pengunjung") column now shows the waiting queue
   ```
   - `queued` drains as `released` grows; it can never go negative.
   - `active` equals `capacity` whenever a queue exists (`visitors - queued === capacity + released`, clamped to `capacity`), and equals `min(capacity, visitors)` once `queued === 0` — so it only drops below `capacity` when the queue is empty and `visitors < capacity` (Normal level).
   - `remaining` is retained as a named value (bound to the arrivals visualization) so the JSX `i < remaining` mapping keeps working, now showing the waiting queue draining into the site.

2. **Fix the release handler to clamp against the fixed-model queue.** The existing expression already advances by up to 4 and stops at the queue size; keep it but ensure it reads the new `queued`:
   ```jsx
   onClick={() => setReleased((value) => value + Math.min(4, queued))}
   ```
   With the new `queued = max(0, visitors - capacity - released)`, `released` is bounded by `visitors - capacity`, so `queued` and `active` never overshoot.

3. **Replace the contradictory instruction text** in `lp-demo-action` so it matches the release action:
   - When `queued > 0`: use copy describing admitting queued visitors into the site (e.g. "Loloskan 4 pengunjung ke dalam situs.") instead of "Coba kosongkan 4 slot di situs."
   - When `queued === 0`: keep the existing "Ubah trafik untuk mencoba lagi." prompt (preservation).

4. **Leave the metrics and status line intact.** "Dalam antrean" binds to `queued`, "Di dalam situs" binds to `active` / `capacity`, and the status paragraph keeps its three-way conditional (`queued > 0` → "Kapasitas situs tetap terjaga"; else `released > 0` → "Antrean selesai, semua sudah masuk"; else "Slot tersedia, langsung masuk"). These now read correctly under the fixed model.

5. **Leave `changeLevel` unchanged** — it already sets `level` and resets `released` to `0`, satisfying the level-change reset requirement.

**File**: `src/LandingPage.jsx` (phrasing pass)

6. **Rewrite the redundant FAQ answer** for "Bagaimana cara mendapatkan akses?" to remove the "administrator Anda … administrator platform … admin workspace" repetition, keeping the same meaning (accounts are provisioned by an administrator; workspace admins can add team members).

7. **Consistency pass** across hero, workflow steps, features, integrations, footer, and metric labels — adjust only wording where phrasing is inconsistent or unclear, preserving meaning, tone, structure, and all attributes.

**File**: `index.html` (phrasing pass)

8. **Align meta/social copy** (`description`, `og:description`, `twitter:description`, JSON-LD `description`, `noscript`) with the on-page copy only where inconsistent, preserving meaning and all tags/attributes.

## Testing Strategy

### Validation Approach

Two phases: first surface counterexamples that demonstrate the bug on the unfixed code, then verify the fix admits queued visitors correctly and preserves all non-buggy behavior. Testing focuses on the `QueueDemo` derived values and handler; the phrasing changes are verified by static string assertions.

Note on running tests: this is a Vite/React project with no test runner configured yet. If tests are added, run them once (e.g. `vitest --run`) rather than in watch mode; do not start a long-running dev server as part of automated verification.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix, and confirm the root cause (that `released` shrinks the present pool). If refuted, re-hypothesize.

**Test Plan**: Reproduce the `QueueDemo` derived-value math for `Ramai`/`Lonjakan`, simulate pressing "Loloskan antrean", and assert on `active`, `queued`, and the present population. Run against the UNFIXED formulas to observe the failures.

**Test Cases**:
1. **Ramai first release**: `visitors = 18`, release +4 → assert `active` stays `8` (will fail on unfixed code: `active` stays 8 here but present pool drops 18→14).
2. **Ramai drain to end**: release repeatedly → assert present population stays `18` and `active` stays `8` until `queued === 0` (will fail on unfixed code: present pool and eventually `active` fall).
3. **Lonjakan drain**: `visitors = 30`, release fully → assert "Di dalam situs" never drops below `capacity` while `queued > 0` (will fail on unfixed code).
4. **Out-of-range / empty-queue edge**: at `queued === 0`, assert release is a no-op and button disabled (may already hold on unfixed code — used to confirm scope).

**Expected Counterexamples**:
- After release, the present visitor count decreases (visitors vanish) and "Di dalam situs" eventually falls below `capacity` while a queue was supposed to be draining.
- Possible causes: `remaining = visitors - released` subtracting from the pool; `active` bound to the shrinking `remaining`; arrivals dots bound to the shrinking `remaining`.

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  before ← insideSite(fixedDemo(input))
  after  ← insideSite(release(fixedDemo(input)))
  ASSERT after == capacity            // stays full while a queue remains
  ASSERT queued(after) == max(0, queued(before) - 4)
  ASSERT presentPopulation unchanged  // no visitor disappears
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalDemo(input) == fixedDemo(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many `(level, released)` combinations automatically across the input domain.
- It catches edge cases (queue boundaries, Normal level, empty queue) that manual unit tests might miss.
- It gives strong assurance that behavior is unchanged for all non-buggy inputs.

**Test Plan**: Observe behavior on the UNFIXED code first for Normal level, empty-queue, and level-change resets, then write property-based tests capturing that behavior and re-run against the fixed code.

**Test Cases**:
1. **Normal-level preservation**: Observe `visitors = 6` yields no queue, `active = 6`, disabled button on unfixed code; assert this holds after the fix.
2. **Empty-queue preservation**: Observe that when `queued === 0` the button is disabled and the "Ubah trafik untuk mencoba lagi." prompt shows; assert unchanged after the fix.
3. **Level-change reset preservation**: Observe that changing level resets `released` to `0` and recomputes the queue; assert unchanged after the fix.
4. **Status-line preservation**: Observe the three status states on unfixed code (idle, queued, after-release) and assert the same mapping after the fix.

### Unit Tests

- Derived-value computation for each traffic level (`Normal`, `Ramai`, `Lonjakan`) at `released = 0`.
- Release handler advances `released` by `min(4, queued)` and never overshoots the queue.
- Edge cases: `queued === 0` (disabled button, no-op release), and `active` never exceeding `capacity`.
- Status-line conditional resolves to the correct one of the three strings.

### Property-Based Tests

- For random `(level, sequenceOfReleases)`: `active === capacity` whenever `queued > 0`, and `queued` is monotonically non-increasing across releases.
- For random `(level, released)` with the bug condition false: fixed output equals original output (preservation).
- Present population (`visitors`) is invariant across any number of releases.

### Integration Tests

- Full demo flow: select `Ramai`, press "Loloskan antrean" until the queue empties, and verify "Di dalam situs" stays at `8` throughout and the status line transitions correctly.
- Context switching: change traffic levels back and forth and verify `released` resets and metrics recompute.
- Visual feedback: verify the arrivals dots drain and the in-site slots stay filled as the queue is released, and that the instruction text matches the release action.
