import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const docsRoot = new URL('../', import.meta.url);

test('component previews are visibility-gated during client-side navigation', async () => {
  const source = await readFile(
    new URL('.vitepress/theme/components/ComponentGalleryPreview.vue', docsRoot),
    'utf8',
  );

  assert.match(source, /new IntersectionObserver/u);
  assert.match(source, /shouldRender\.value = entry\?\.isIntersecting === true/u);
  assert.match(source, /<ComponentExamplePreview\s+v-if="shouldRender"/u);
  assert.doesNotMatch(source, /hydrateOnVisible/u);
});

test('component gallery previews keep every rendered overlay non-interactive', async () => {
  const preview = await readFile(
    new URL('.vitepress/theme/components/ComponentGalleryPreview.vue', docsRoot),
    'utf8',
  );
  const card = await readFile(
    new URL('.vitepress/theme/components/ComponentGalleryCard.vue', docsRoot),
    'utf8',
  );

  assert.match(preview, /aria-hidden="true"\s+inert/u);
  assert.match(preview, /<HostProvider v-if="portalTarget !== null" :portal-target="portalTarget">/u);
  assert.match(preview, /\.component-gallery-preview\s*\{[^}]*pointer-events:\s*none;/u);
  assert.match(card, /\.component-gallery-card\s*\{[^}]*isolation:\s*isolate;/u);
  assert.match(card, /\.component-gallery-card__link\s*\{[^}]*z-index:\s*2;/u);
});

test('select previews keep the trigger surface stable and use a restrained selection tint', async () => {
  const source = await readFile(
    new URL('.vitepress/theme/components/DemoSelect.vue', docsRoot),
    'utf8',
  );
  const triggerHover = source.match(/\.demo-select__trigger:hover:not\(:disabled\)\s*\{(?<rules>[^}]*)\}/u)?.groups?.rules ?? '';

  assert.match(triggerHover, /background:\s*var\(--sectile-surface\);/u);
  assert.doesNotMatch(triggerHover, /background:\s*var\(--sectile-surface-hover\);/u);
  assert.match(source, /\.demo-select__option:is\(\[data-selected\], \[data-state="checked"\]\)\s*\{\s*background:\s*var\(--sectile-surface-interactive\);/u);
  assert.match(source, /\[data-highlighted\][^{]*:not\(\[data-selected\]\):not\(\[data-state="checked"\]\)/u);
});

test('component example cards round their own surfaces without clipping floating content', async () => {
  const source = await readFile(
    new URL('.vitepress/theme/styles.css', docsRoot),
    'utf8',
  );
  const card = source.match(/\.sectile-example\s*\{(?<rules>[^}]*)\}/u)?.groups?.rules ?? '';

  assert.doesNotMatch(card, /overflow\s*:\s*hidden/u);
  assert.match(source, /\.sectile-example__toolbar\s*\{[^}]*border-radius:\s*13px 13px 0 0;/u);
  assert.match(source, /\.sectile-example__preview > \.component-example-stage,[\s\S]*?border-radius:\s*0 0 13px 13px;/u);
  assert.match(source, /\.sectile-example__code\s*\{[^}]*border-radius:\s*0 0 13px 13px;/u);
});

test('component examples distinguish behavior previews from scoped usage code', async () => {
  const frame = await readFile(
    new URL('.vitepress/theme/components/ExampleFrame.vue', docsRoot),
    'utf8',
  );
  const componentExample = await readFile(
    new URL('.vitepress/theme/components/ComponentExample.vue', docsRoot),
    'utf8',
  );
  const sourceFormat = await readFile(
    new URL('.vitepress/theme/example-source-format.ts', docsRoot),
    'utf8',
  );

  assert.match(frame, /sourceRelationship\?: 'exact' \| 'usage'/u);
  assert.match(frame, /'동작 미리보기' : 'Behavior preview'/u);
  assert.match(frame, /'사용 코드' : 'Usage code'/u);
  assert.match(componentExample, /source-relationship="usage"/u);
  assert.match(componentExample, /DOM에 Sectile 동작을 연결하는 부분만/u);
  assert.match(componentExample, /update\.state가 다음 상태/u);
  assert.match(sourceFormat, /vue: 'Vue composition snippet'/u);
  assert.match(sourceFormat, /dom: 'DOM connection snippet'/u);
  assert.match(sourceFormat, /core: 'Core state-transition snippet'/u);
  assert.match(sourceFormat, /terminal: 'Terminal integration snippet'/u);
});
