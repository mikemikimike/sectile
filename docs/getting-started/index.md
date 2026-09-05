# Getting Started

Sectile gives you accessible interaction behavior without deciding how your product should look. Start with the host you already use, get one component working, then add your own styles and motion.

## 1. Choose and install a host

For a Vue application, choose **Vue**. Choose **DOM** when you already create browser elements yourself. Terminal and Core are lower-level starting points for terminal interfaces and custom rendering.

<HostInstall />

Vue applications already need `vue`; Sectile's Vue package provides the component subpaths. Development, SSR, and Node terminal integration require Node.js 24 or newer.

## 2. Import only the component you need

Every component has a focused public subpath. The selector below follows the host choice above.

<PackageImport component="checkbox" />

## 3. Run one example end to end

The installation command, import, and example on this page all follow the **Integration** selector in the top navigation. Each source shows the context needed to understand the selected host: Vue includes state, markup, and styling; DOM includes markup, styling, connection, and cleanup; Core shows the state transition and its result; Terminal shows input handling and rendering.

<GettingStartedCheckboxExample />

The note below the source explains how state moves through that host. Every example uses the installed package's public API and is independent of the Sectile repository layout.

## 4. Add product styles

Components expose stable `data-scope`, `data-part`, and state attributes. You can style them with ordinary CSS without wrapping the component in a Sectile theme.

```css
[data-scope='checkbox'][data-part='root'] {
  display: inline-flex;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid currentColor;
  border-radius: 0.3rem;
}

[data-scope='checkbox'][data-part='root'][data-state='checked'] {
  background: CanvasText;
  color: Canvas;
}
```

Read [Styling](/guide/styling) for reusable selectors and [Motion](/guides/motion) for enter, exit, indicator, and swipe animation patterns.

## 5. Control state only when you need to

Most components can own their initial state. When application state must be authoritative, use the controlled prop/event pair shown in each component's **Controlled** example. [Controlled state](/guide/state-ownership) explains the shared pattern.

## Where to go next

- [Components](/components/) — compare several runnable variants of each UI pattern.
- [Guides](/guides/) — solve styling, positioning, form, date, virtual-list, table, and chart tasks.
- [API](/api/) — look up exact props, events, slots, types, parts, keyboard behavior, and package exports.

You do not need to learn Sectile's internal architecture before using a component.
