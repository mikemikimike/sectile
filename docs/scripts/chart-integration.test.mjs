import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const docsRoot = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, docsRoot), 'utf8');
const guideNames = [
  'chart.md',
  'chart/model.md',
  'chart/projection.md',
  'chart/interaction.md',
  'chart/dom.md',
  'chart/vue.md',
  'chart/performance.md',
];

test('Chart documentation is task-oriented and visual in both locales', async () => {
  const [english, korean, config] = await Promise.all([
    Promise.all(guideNames.map((name) => read(`packages/${name}`))),
    Promise.all(guideNames.map((name) => read(`ko/packages/${name}`))),
    read('.vitepress/config.ts'),
  ]);

  for (const source of [english[0], korean[0]]) {
    assert.match(source, /<ChartPackageExample \/>/u);
    assert.match(source, /@sectile\/chart/u);
  }
  assert.match(english[0], /twelve weeks of revenue/iu);
  assert.match(korean[0], /12주 매출/u);
  assert.match(english[0], /optional peer of the host packages/iu);
  assert.match(english[0], /unrelated Sectile Vue or DOM components do not require it/iu);
  assert.match(korean[0], /호스트 패키지의 선택적 peer dependency/u);
  assert.match(korean[0], /다른 Sectile Vue나 DOM 기능만 사용할 때는 설치할 필요가 없/u);
  for (const kind of ['line', 'scatter', 'bar', 'heatmap', 'pie', 'donut']) {
    assert.match(english[0], new RegExp(`\\b${kind}\\b`, 'iu'));
  }
  for (const name of ['선', '산점도', '막대', '히트맵', '파이', '도넛']) {
    assert.match(korean[0], new RegExp(name, 'u'));
  }

  const focusedExamples = [
    [1, 'pie'], [1, 'donut'], [2, 'heatmap'], [3, 'scatter'], [4, 'bar'], [5, 'line'],
  ];
  for (const [index, kind] of focusedExamples) {
    assert.match(english[index], new RegExp(`<ChartPackageExample kind="${kind}"`, 'u'));
    assert.match(korean[index], new RegExp(`<ChartPackageExample kind="${kind}"`, 'u'));
  }

  for (const source of [...english, ...korean]) {
    assert.doesNotMatch(source, /Morton|bounding-volume hierarchy|packed typed arrays?|verification fixture|repository close|source maps?|consumer bundles?/iu);
    assert.doesNotMatch(source, /모턴|경계 볼륨 계층|패킹된 타입 배열|검증 fixture|저장소 close|소스 맵|소비자 번들/iu);
  }

  for (const route of guideNames.map((name) => name.replace(/\.md$/u, ''))) {
    assert.match(config, new RegExp(`/packages/${route}`, 'u'));
    assert.match(config, new RegExp(`/ko/packages/${route}`, 'u'));
  }
});

test('Chart examples use public APIs and cover every built-in profile', async () => {
  const [component, sources, theme, packageJSON, englishVue, koreanVue] = await Promise.all([
    read('.vitepress/theme/components/ChartPackageExample.vue'),
    read('.vitepress/theme/chart-example-code.ts'),
    read('.vitepress/theme/index.ts'),
    read('package.json').then(JSON.parse),
    read('packages/chart/vue.md'),
    read('ko/packages/chart/vue.md'),
  ]);

  assert.match(theme, /ChartPackageExample/u);
  assert.equal(packageJSON.dependencies['@sectile/chart'], 'workspace:*');
  assert.match(component, /@sectile\/vue\/chart/u);
  assert.match(component, /import \{[\s\S]*ChartRadial[\s\S]*\} from '@sectile\/vue\/chart'/u);
  assert.match(sources, /@sectile\/chart\/controller/u);
  assert.match(sources, /@sectile\/dom\/chart/u);
  for (const kind of ['Line', 'Scatter', 'Bar', 'Heatmap', 'Pie', 'Donut']) {
    assert.match(component, new RegExp(`Chart${kind}`, 'u'));
    assert.match(sources, new RegExp(`Chart${kind}|kind === '${kind.toLowerCase()}'`, 'u'));
  }
  for (const source of [component, sources]) {
    assert.doesNotMatch(source, /\/internal\/|\.verification-dist|verification\/chart/u);
  }
  assert.match(component, /const selectedKind = computed<ChartExampleKind>\(\(\) => props\.kind \?\? 'line'\)/u);
  assert.match(component, /<ChartViewControls v-if="selectedKind === 'line'"/u);
  assert.match(component, /class="chart-example__detail"/u);
  assert.match(component, /source-relationship="usage"/u);
  assert.doesNotMatch(component, /ChartLegend|chart-workbench__selector|const chartKinds/u);
  assert.match(component, /\.chart-example__surface :deep\(\[data-chart-overlay='legend'\]\)[^}]*display:\s*none/su);
  assert.match(component, /getAccessibleDatumLabel/u);
  assert.match(sources, /getAccessibleDatumLabel/u);
  assert.match(sources, /viewCapabilities: \[\{ axisID: 'x', minimumSpan: 4, update: 'preserve' \}\]/u);
  assert.match(sources, /ChartAxisTicks/u);
  assert.match(sources, /ChartGrid/u);
  assert.match(sources, /instanceof HTMLElement/u);
  assert.match(sources, /chart\.disconnect\(\)[\s\S]*controller\.dispose\(\)/u);
  assert.doesNotMatch(component, /host:\s*'vue'/u);
  assert.match(englishVue, /host="vue"/u);
  assert.match(koreanVue, /host="vue"/u);
  assert.match(component, /unmount-preview-when-hidden/u);
  assert.match(sources, /vue: vueSource/u);
  assert.match(sources, /dom: domSource/u);
});
