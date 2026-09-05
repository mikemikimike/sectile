---
title: Temporal
description: Model civil dates, wall-clock times, ranges, calendars, and picker transitions without tying them to a renderer or timezone.
---

# Temporal

`@sectile/temporal` is for application logic that needs calendar dates, times of day, ranges, calendars, or picker state without depending on Vue, the DOM, or a timezone database. A date such as `2026-09-18` remains a calendar day, and a time such as `09:30` remains a wall-clock time until your application explicitly combines it with a timezone or instant.

Use a host package such as [`@sectile/vue`](/packages/vue) or [`@sectile/dom`](/packages/dom) when you want ready-made UI integration. Install Temporal directly when validation, scheduling rules, server logic, tests, or a custom host need the date and time semantics themselves.

## Install

```sh
pnpm add @sectile/temporal
```

Import the focused subpath for the domain you use:

```ts
import { createDateValue } from '@sectile/temporal/date-field'
import { createTimeValue } from '@sectile/temporal/time-field'
import { createDatePickerState } from '@sectile/temporal/date-picker'
```

See the [Temporal API reference](/api/temporal) for every public import path.

## Keep calendar values separate from timezones

Use Temporal values when the application means a calendar date or a time of day rather than a JavaScript instant. Formatting to the portable ISO-style representation is explicit and does not consult the machine timezone.

```ts
import {
  createDateValue,
  formatDateValue,
} from '@sectile/temporal/date-field'
import {
  createTimeValue,
  formatTimeValue,
} from '@sectile/temporal/time-field'

const releaseDate = createDateValue(2026, 9, 18)
const cutoffTime = createTimeValue(17, 30)

const payload = {
  releaseDate: formatDateValue(releaseDate),
  cutoffTime: formatTimeValue(cutoffTime),
}

console.log(payload)
// { releaseDate: "2026-09-18", cutoffTime: "17:30" }
```

This is useful for birthdays, booking dates, business hours, deadlines expressed in a local schedule, and similar values whose meaning would change if they were silently converted to UTC. When the destination requires an instant, perform that conversion at an application boundary with an explicit timezone.

## Reject invalid input instead of normalizing it

Parsing and `try*` constructors return typed results for data that can be invalid at a user, network, or persistence boundary.

```ts
import { parseDateValue } from '@sectile/temporal/date-field'

const result = parseDateValue('2026-02-30')

if (!result.ok) {
  console.error(result.error.code) // "invalid-date-day"
} else {
  console.log(result.value)
}
```

`parseDateValue()` accepts the portable `YYYY-MM-DD` form. Localized labels, digit shapes, and display formatting belong to the rendering host rather than the canonical Temporal value.

## Perform calendar arithmetic

Date arithmetic follows calendar units rather than elapsed milliseconds. Moving January 31 forward one month, for example, resolves to the last valid day in February.

```ts
import {
  addDateMonths,
  createDateValue,
  formatDateValue,
} from '@sectile/temporal/date-field'

const billingDate = createDateValue(2026, 1, 31)
const next = addDateMonths(billingDate, 1)

if (!next.ok) throw new Error(next.error.message)

console.log(formatDateValue(next.value)) // "2026-02-28"
```

The same date module provides day and year movement, comparison, ranges, weekday lookup, and containment checks. Time arithmetic is available from `@sectile/temporal/time-field` when the domain is a wall-clock time instead.

## Drive a picker with application availability rules

Picker state separates the committed value from the currently highlighted date. Policies can constrain the range and mark dates unavailable while navigation remains deterministic.

```ts
import {
  applyDatePickerEvent,
  createDatePickerState,
  type DatePickerPolicies,
} from '@sectile/temporal/date-picker'
import {
  createDateValue,
  dateDayOfWeek,
  formatDateValue,
} from '@sectile/temporal/date-field'

const policies: DatePickerPolicies = {
  weekStartsOn: 1,
  unavailable: value => dateDayOfWeek(value) >= 6,
}

let state = createDatePickerState({
  value: createDateValue(2026, 9, 18), // Friday
  open: true,
})

const moved = applyDatePickerEvent(state, 'next-day', policies)
if (!moved.ok) throw new Error(moved.error.message)
state = moved.value.state

console.log(formatDateValue(state.highlighted)) // "2026-09-21"
console.log(state.value === null ? null : formatDateValue(state.value))
// "2026-09-18"

const selected = applyDatePickerEvent(state, 'select-highlighted', policies)
if (!selected.ok) throw new Error(selected.error.message)
state = selected.value.state

if (state.value !== null) {
  console.log(formatDateValue(state.value)) // "2026-09-21"
}
console.log(state.open) // false
```

The first transition moves the highlight past the unavailable weekend without changing the committed Friday value. `select-highlighted` then commits Monday and closes the picker. The returned `commands` are available when a host needs to project state changes into its own effects.

Use the range, month, year, and date-time picker subpaths when those are the values your application actually selects; the exact list stays in the [API reference](/api/temporal).

## Keep empty calendars deterministic

An empty calendar needs a date from which to choose its initial visible month. Temporal does not read the current date by itself, so server rendering, snapshots, workers, and reproducible tests can provide the reference explicitly.

```ts
import { createDateValue } from '@sectile/temporal/date-field'
import { createDatePickerState } from '@sectile/temporal/date-picker'

const referenceDate = createDateValue(2026, 9, 1)
const state = createDatePickerState({ referenceDate })

console.log(state.value) // null
console.log(state.view) // { year: 2026, month: 9 }
```

Use the same `referenceDate` for server and client initialization when hydration must produce the same initial calendar. Browser and terminal integrations may supply the host's current civil date as a client-side convenience; an explicit reference date takes control when reproducibility matters. Vue applications can share one through `@sectile/vue/temporal/temporal-provider`.

## Continue by task

- [Values and fields](temporal/values.md) covers canonical values, parsing, date/time fields, and ranges.
- [Calendars and pickers](temporal/calendars.md) covers calendar projection, navigation, availability, and picker composition.
- [Deterministic rendering](temporal/determinism.md) covers `referenceDate`, SSR, hydration, and host defaults.
- [`@sectile/vue`](/packages/vue), [`@sectile/dom`](/packages/dom), and [`@sectile/terminal`](/packages/terminal) cover rendering and platform integration.
- The [Temporal API reference](/api/temporal) is the canonical list of supported package subpaths.
