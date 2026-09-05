---
title: Form
description: Build accessible forms with native controls, Sectile components, validation, submission state, and dirty tracking.
---

# Form

Sectile Form coordinates validation, submission, errors, reset, and dirty/touched state while your inputs continue to own their values. Use the Vue integration for component templates or the DOM integration to enhance existing HTML.

You do not need `@sectile/form` for ordinary Sectile components. Install it only when you use the Form integration.

## Choose your integration

For Vue applications:

```sh
pnpm add @sectile/core @sectile/form @sectile/dom @sectile/vue vue
```

```ts
import {
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  FormSubmit,
  FormSummary,
  defineFormSubmission,
} from '@sectile/vue/form'
```

For existing browser markup without Vue:

```sh
pnpm add @sectile/core @sectile/form @sectile/dom
```

```ts
import { createForm, defineFormSubmission } from '@sectile/dom/form'
```

The two integrations use the same Form behavior. Choose based on the host you already use rather than learning a separate form model first.

## Build a Vue form

`FormRoot` renders the native form. Wrap each participating control in `FormField`, add labels and messages, and define what a successful submission does.

```vue
<script setup lang="ts">
import {
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  FormSubmit,
  FormSummary,
  defineFormSubmission,
} from '@sectile/vue/form'
import { TextField } from '@sectile/vue/text'

const submission = defineFormSubmission({
  onSubmit: async ({ formData, reinitialize }) => {
    await fetch('/account', {
      method: 'POST',
      body: formData,
    })
    reinitialize()
  },
})
</script>

<template>
  <FormRoot v-bind="submission">
    <FormSummary />

    <FormField name="email" required>
      <FormLabel>Email address</FormLabel>
      <TextField type="email" autocomplete="email" />
      <FormDescription>We send account notices to this address.</FormDescription>
      <FormMessage />
    </FormField>

    <FormField name="timezone">
      <FormLabel>Timezone</FormLabel>
      <select name="timezone">
        <option value="Asia/Seoul">Seoul</option>
        <option value="Europe/London">London</option>
      </select>
      <FormMessage />
    </FormField>

    <FormSubmit>Save account</FormSubmit>
  </FormRoot>
</template>
```

Native controls and Sectile controls can participate in the same form. A successful `reinitialize()` keeps the current values on screen and adopts them as the new baseline, so `dirty` returns to `false`.

For the full Vue workflow, including field composition, custom summaries, reinitialization, and SSR, continue with [Vue forms](./form/vue/).

## Enhance an existing HTML form

The DOM integration starts from ordinary HTML, so the form remains usable before JavaScript loads.

```html
<form id="account-form" action="/account" method="post">
  <div id="account-summary"></div>

  <label for="account-email">Email address</label>
  <input id="account-email" name="email" type="email" required>

  <button type="reset">Reset</button>
  <button type="submit">Save account</button>
</form>
```

Connect only the controls that need Form field state, error targeting, or focus recovery:

```ts
import { createForm, defineFormSubmission } from '@sectile/dom/form'

const formElement = document.querySelector<HTMLFormElement>('#account-form')!
const summary = document.querySelector<HTMLElement>('#account-summary')!
const email = document.querySelector<HTMLInputElement>('#account-email')!

const submission = defineFormSubmission({
  onSubmit: async ({ formData, reinitialize }) => {
    await fetch('/account', {
      method: 'POST',
      body: formData,
    })
    reinitialize()
  },
})

const form = createForm({
  form: formElement,
  summary,
  participants: [{ id: 'email', element: email }],
  ...submission,
})

window.addEventListener('pagehide', () => form.destroy(), { once: true })
```

Other named controls still participate in native `FormData`; they only need registration when the application also wants Form-managed field state or recovery behavior.

Omit `onSubmit` entirely when the browser should perform the native submission using the form's `action`, `method`, `enctype`, and submitter overrides.

For dynamic controls, custom participants, and native-versus-managed submission details, continue with [DOM forms](./form/dom/).

## Show unsaved and submitting state

Form exposes dirty/touched state separately from submission lifecycle. In Vue, read it from the root slot:

```vue
<FormRoot v-bind="submission" v-slot="{ dirty, submission }">
  <!-- fields -->
  <p v-if="dirty">You have unsaved changes.</p>
  <FormSubmit :disabled="submission.status === 'submitting'">
    {{ submission.status === 'submitting' ? 'Saving…' : 'Save' }}
  </FormSubmit>
</FormRoot>
```

With the DOM integration, subscribe to the same state:

```ts
const unsubscribe = form.subscribe(({ state }) => {
  unsavedBadge.hidden = !state.dirty
  saveButton.disabled = state.submission.status === 'submitting'
})

window.addEventListener('pagehide', unsubscribe, { once: true })
```

`dirty` compares participating values with the current baseline. Returning a value to its baseline can make `dirty` false again, while `touched` may remain true because interaction already occurred.

The application decides how to use that state—for example, a router leave guard, a `beforeunload` warning, or draft persistence.

## Keep validation errors separate from save failures

Invalid field values and a failed save are different states. Validation issues make fields invalid and can appear in `FormMessage` or `FormSummary`. A submission failure reports that the save itself failed without pretending the field values became invalid.

In Vue, a custom summary can display both channels explicitly:

```vue
<FormSummary v-slot="{ submission, issues, firstIssue }">
  <p v-if="submission.failure">{{ submission.failure.message }}</p>
  <p v-else-if="firstIssue">{{ firstIssue.message }}</p>
  <small v-if="issues.length">{{ issues.length }} issue(s)</small>
</FormSummary>
```

Server validation can also attach an issue to one primary field and related fields, so a cross-field error appears once in the summary while every affected field is marked invalid.

Continue with [Validation and errors](./form/validation) for browser, schema, application, and server issue lifecycles.

## Reset values or accept the current values

Use reset when controls should return to their defaults. Use reinitialization when the current values should stay visible and count as the newly saved state.

In Vue:

```ts
const submission = defineFormSubmission({
  onSubmit: async ({ formData, reinitialize }) => {
    await saveProfile(formData)
    reinitialize()
  },
})
```

In the DOM integration:

```ts
form.reinitialize()
```

Reinitialization changes the baseline; it does not rewrite the controls. See [Submission and reinitialization](./form/submission) for preservation options and file/async submission behavior.

## Go deeper by task

- [Fields and controls](./form/fields) — native inputs, Sectile controls, groups, and field identity.
- [Validation and errors](./form/validation) — native, schema, application, and server validation.
- [Submission and reinitialization](./form/submission) — async saves, files, reset, and new dirty baselines.
- [Custom controls](./form/custom-controls) — connect an application-owned control.
- [SSR and hydration](./form/ssr) — render Vue forms on the server without hydration surprises.

For exact exports and types, use the centralized [Form API reference](/api/form), [Vue Form API](/api/form/vue), or [DOM Form API](/api/form/dom).
