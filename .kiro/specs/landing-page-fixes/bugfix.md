# Bugfix Requirements Document

## Introduction

This bugfix addresses two problems on the Antosan landing page (a React/Vite single-page app whose UI copy is in Indonesian):

1. **Queue simulation logic bug** in the `QueueDemo` component (`src/LandingPage.jsx`). The interactive demo is meant to illustrate a virtual queue: as the queue is released, waiting visitors should be *admitted into the open slots of the site*. Instead, pressing the "Loloskan antrean" (release the queue) button decreases the pool of `remaining` visitors, which drains people out of the simulation entirely. The visualization and metrics no longer read as "queued visitors moving into the site" - visitors appear to vanish, and the accompanying instruction text ("Coba kosongkan 4 slot di situs.") contradicts the button that releases the queue. This makes the core product demo misleading.

2. **Text / phrasing issues** in the Indonesian UI copy across `src/LandingPage.jsx` (and, where applicable, `index.html`). Several strings are inconsistent, redundant, or confusing and need to be corrected for clarity and consistency while preserving the meaning and tone of the marketing copy.

The impact is on the primary hero demo (the first interactive element visitors see) and on the overall polish and clarity of the page copy.

### Affected Code

- `src/LandingPage.jsx`
  - `QueueDemo` component - state `level` / `released`; derived values `visitors`, `remaining`, `active`, `queued`; the "Loloskan antrean" button handler `setReleased((value) => value + Math.min(4, queued))`; the demo action instruction text; the `lp-demo-metrics` block ("Dalam antrean" / "Di dalam situs").
  - `faqs` array - the "Bagaimana cara mendapatkan akses?" answer.
  - Hero, workflow steps, features, integrations, and footer copy (phrasing review).
- `index.html` - meta description / social copy (phrasing review, if inconsistent with page copy).

### Bug Condition (for the queue-demo logic bug)

**Key definitions:**
- **F**: the original `QueueDemo` behavior (before the fix).
- **F'**: the fixed `QueueDemo` behavior (after the fix).
- **State model:** `visitors = trafficLevels[level].visitors`, `capacity = 8`, `released` = number of queued visitors admitted so far.

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type DemoState  // { visitors, released, capacity }
  OUTPUT: boolean

  // The bug is exercised whenever a queue exists and the user
  // releases visitors, because releasing shrinks the pool of
  // present visitors instead of moving queued visitors into
  // the site's open slots.
  RETURN (X.visitors - X.released) > X.capacity
         AND userReleasesQueue(X)
END FUNCTION
```

```pascal
// Property: Fix Checking - releasing the queue admits waiting
// visitors into the site instead of removing them
FOR ALL X WHERE isBugCondition(X) DO
  before ← insideSite(F'(X))          // "Di dalam situs" count before release
  after  ← insideSite(release(F'(X))) // after pressing "Loloskan antrean"
  ASSERT insideSite stays at capacity while a queue remains
  ASSERT queued strictly decreases by the number released
  ASSERT no present visitor disappears from the simulation
END FOR
```

```pascal
// Property: Preservation Checking - non-buggy inputs unchanged
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT F(X) = F'(X)
END FOR
```

## Bug Analysis

### Current Behavior (Defect)

When the queue simulation has visitors waiting (traffic level "Ramai" or "Lonjakan", where visitors exceed the capacity of 8), the release control behaves incorrectly and the copy is inconsistent.

1.1 WHEN the user presses "Loloskan antrean" while visitors are queued THEN the system increases `released`, which reduces `remaining` (`visitors - released`) so the pool of present visitors shrinks instead of moving queued visitors into the site's open slots.

1.2 WHEN `released` grows such that `remaining` drops to or below `capacity` THEN the system lets `active` (`Math.min(remaining, capacity)`, shown as "Di dalam situs") fall below `capacity`, implying the site empties out even though visitors were being "released" from the queue.

1.3 WHEN a queue exists THEN the system displays the instruction "Coba kosongkan 4 slot di situs." which contradicts the "Loloskan antrean" (release the queue) button and misdescribes the action.

1.4 WHEN the page renders the FAQ answer for "Bagaimana cara mendapatkan akses?" THEN the system shows redundant phrasing ("administrator Anda ... administrator platform ... admin workspace") that reads awkwardly.

1.5 WHEN the page renders its Indonesian copy (hero, workflow steps, features, integrations, footer, and metric labels) THEN the system contains phrasing that is inconsistent or unclear in places, reducing overall readability.

### Expected Behavior (Correct)

2.1 WHEN the user presses "Loloskan antrean" while visitors are queued THEN the system SHALL move queued visitors into the site's available slots (draining the queue) rather than removing present visitors from the simulation.

2.2 WHEN a queue still exists after releasing THEN the system SHALL keep "Di dalam situs" (`active`) at full `capacity`, and SHALL only let it fall below `capacity` once the queue is empty and the number of present visitors is less than `capacity`.

2.3 WHEN a queue exists THEN the system SHALL display instruction text that is consistent with the "Loloskan antrean" button (describing admitting/releasing queued visitors into the site), not "Coba kosongkan 4 slot di situs."

2.4 WHEN the page renders the FAQ answer for "Bagaimana cara mendapatkan akses?" THEN the system SHALL present clear, non-redundant Indonesian phrasing.

2.5 WHEN the page renders its Indonesian copy THEN the system SHALL use natural, consistent phrasing across hero, workflow steps, features, integrations, footer, and metric labels while preserving the original meaning and tone.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the traffic level is set so that `visitors <= capacity` (e.g. "Normal") THEN the system SHALL CONTINUE TO show all visitors admitted with no queue and the release button disabled.

3.2 WHEN the queue is empty (`queued === 0`) THEN the system SHALL CONTINUE TO disable the "Loloskan antrean" button and show the "Ubah trafik untuk mencoba lagi." style prompt.

3.3 WHEN the user changes the traffic level THEN the system SHALL CONTINUE TO reset the released count and recompute the queue from the new visitor total.

3.4 WHEN the demo status line evaluates THEN the system SHALL CONTINUE TO reflect the correct state ("Kapasitas situs tetap terjaga" while queued, "Antrean selesai, semua sudah masuk" after releasing, "Slot tersedia, langsung masuk" when idle with open slots).

3.5 WHEN the page renders sections not targeted by the phrasing review THEN the system SHALL CONTINUE TO display their existing structure, layout, links, and accessibility attributes unchanged.

3.6 WHEN the Integrations tabs, mobile menu, skip link, and other interactive controls are used THEN the system SHALL CONTINUE TO behave exactly as before (no functional change outside the queue demo).
