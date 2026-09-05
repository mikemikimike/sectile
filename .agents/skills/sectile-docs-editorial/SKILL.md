---
name: sectile-docs-editorial
description: Write and review Sectile public documentation with a consistent product
  voice. Use for Sectile home copy, guides, package docs, localization, and editorial
  review together with dev-docs; keeps product identity separate from documentation
  instructions and enforces native Korean/English prose.
---

# Sectile Docs Editorial

Use this skill together with `dev-docs` for all public Sectile documentation. `dev-docs` governs information architecture, reader tasks, public-contract accuracy, and examples. This skill governs Sectile product voice and editorial quality.

## Product identity

Use the repository's canonical product model as the source of positioning:

- Sectile defines renderer-neutral interaction semantics so interfaces behave consistently across supported hosts.
- Interaction rules are separated from presentation.
- Renderer-neutral packages own deterministic state and domain behavior; host packages connect native input and project effects.
- Vue exposes headless compound components backed by the corresponding host/domain behavior.
- Styling, application data, and product-specific presentation remain application concerns unless a public API explicitly says otherwise.

Do not replace this identity with a documentation strategy. "Example-first", "copy an example", navigation structure, or how to read the docs may describe the documentation, but must not be presented as what Sectile is.

## Separate product copy from documentation guidance

The hero and first product description answer only these questions: what is Sectile, what problem does it solve, and what public capability distinguishes it?

Do not put reader instructions in product positioning. Avoid imperative or procedural copy such as "pick", "copy", "start with", "choose", "adapt", "learn", or "use this page" in the hero description unless the section is explicitly a navigation or getting-started section.

Documentation guidance belongs in navigation, getting-started, examples, and task-oriented sections below the product description.

## Write concrete product prose

Prefer direct statements about observable product behavior. Avoid generic marketing language, vague benefits, and AI-style copy.

Avoid phrases whose subject could be replaced by another library without changing the meaning. Avoid unsupported claims such as "seamless", "powerful", "flexible", "modern", "production-ready", "best", or "easy".

Do not turn implementation structure into marketing copy. Internal architecture may be consulted as evidence, but public prose should name only stable concepts a developer needs to understand or use Sectile.

Do not over-explain. A product description should normally be one short heading plus one or two sentences. Deeper semantics belong in guides or package documentation.

## Language discipline

Write English pages as natural English and Korean pages as natural Korean. Do not translate sentence structure mechanically between languages.

In Korean prose, keep only proper nouns, package names, code/API identifiers, and established technical terms in English when their original form improves precision. Do not mix ordinary English prose into Korean sentences. Prefer natural Korean explanations around code identifiers, for example "저장되지 않은 변경 여부(`dirty`)" rather than "dirty 상태" when the identifier itself is not the subject.

In English prose, do not inject Korean terminology or mirror Korean word order.

When editing Korean public prose, run the `humanize-korean` review after factual and structural editing. Treat that pass as editorial review, not as a substitute for correct product positioning.

## Headings and labels

Use headings to name the subject or task, not to advertise the documentation method. Avoid slogans derived from navigation strategy.

Labels may be concise nouns or task phrases. Do not force every heading into the same grammatical pattern.

## Host-selection consistency

The top navigation `HostSelector` is the single host/integration selection control for public docs. Host-aware installation commands, imports, examples, and package snippets read the shared host preference and update from that selection.

Do not add local Core/DOM/Terminal/Vue tabs, segmented controls, radio groups, or selectors to host-aware content. Tabs may still represent an orthogonal mode such as View versus Code. When a route supports only a subset of hosts, scope the top selector options for that route instead of adding another selector in the page body.

## Examples and instructions

Task guides may be instructional. Keep instructions next to the task they help complete. Explain the intended result before the API details, and keep complete examples small enough to understand.

Call an example **complete** only when the code shown to the reader is sufficient to reproduce the visible result in the stated host with the documented dependencies. A complete example includes the required imports, state/setup, rendered markup, lifecycle/cleanup when the host requires it, and every example-specific style needed to reproduce the preview. Do not rely on docs-only CSS, hidden preview components, fixtures, or markup that is absent from the shown source.

For DOM examples, include the HTML elements that connection code queries or mutates. A JavaScript or TypeScript fragment containing `querySelector()` calls without the corresponding markup is a snippet, not a complete example.

For Vue examples, a complete single-file component includes the script and template plus any example-specific styles represented in the preview. If shared application styling is intentionally omitted, the preview must not imply that the omitted styling comes from the shown code.

Use explicit labels such as "snippet", "pattern", or "fragment" for intentionally partial source. Never describe a partial source as copyable or complete.

The View and Code modes of an example must describe the same artifact. If the preview uses additional hidden implementation or presentation that materially changes what the reader sees, either expose that source or simplify the preview until the shown code reproduces it.

Product overview sections are descriptive, not instructional. Do not tell the reader to copy code, choose components, or customize styling there.

## API and package guides

Package overview pages explain when the package is useful and show practical public workflows. Exact exhaustive surfaces belong in `/api/`.

Do not expose repository paths, private helpers, internal state machinery, or implementation rationale merely because it is available during research.

## Editorial review before completion

For every changed public page, check:

1. Does the opening describe Sectile or the documented feature, rather than how to read the docs?
2. Are product claims supported by the public contract or canonical repository description?
3. Could any sentence be generic marketing copy for an unrelated UI library? If yes, rewrite or remove it.
4. Are instructions confined to sections where the reader is actually performing a task?
5. Is each language natural on its own, with unnecessary language mixing removed?
6. Are API identifiers preserved exactly while explanatory prose remains readable?
7. Are examples and API reference links subordinate to the explanation rather than standing in for it?
8. If an example is called complete or copyable, does the visible source reproduce the visible preview without hidden docs-only markup or styling?

If these checks fail, revise before validation or commit.
