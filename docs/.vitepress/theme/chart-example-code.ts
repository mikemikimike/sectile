export type ChartExampleKind = 'line' | 'scatter' | 'bar' | 'heatmap' | 'pie' | 'donut';
export type ChartExampleHost = 'vue' | 'dom';

function dataSource(kind: ChartExampleKind, korean: boolean): string {
  if (kind === 'line') return `const revenue = [
  { id: 'week-01', period: '6/1', revenue: 120 },
  { id: 'week-02', period: '6/8', revenue: 128 },
  { id: 'week-03', period: '6/15', revenue: 136 },
  { id: 'week-04', period: '6/22', revenue: 132 },
  { id: 'week-05', period: '6/29', revenue: 148 },
  { id: 'week-06', period: '7/6', revenue: 154 },
  { id: 'week-07', period: '7/13', revenue: 160 },
  { id: 'week-08', period: '7/20', revenue: 168 },
  { id: 'week-09', period: '7/27', revenue: 172 },
  { id: 'week-10', period: '8/3', revenue: 180 },
  { id: 'week-11', period: '8/10', revenue: 188 },
  { id: 'week-12', period: '8/17', revenue: 200 },
]`;
  if (kind === 'scatter') return `const services = [
  { id: 'api', service: 'API', deploys: 10, stability: 100 },
  { id: 'worker', service: 'Worker', deploys: 18, stability: 98 },
  { id: 'web', service: 'Web', deploys: 26, stability: 97 },
  { id: 'billing', service: 'Billing', deploys: 34, stability: 96 },
  { id: 'search', service: 'Search', deploys: 42, stability: 94 },
  { id: 'identity', service: 'Identity', deploys: 50, stability: 99 },
]`;
  if (kind === 'bar') return `const orders = [
  { id: 'seoul', region: '${korean ? '서울' : 'Seoul'}', orders: 800 },
  { id: 'busan', region: '${korean ? '부산' : 'Busan'}', orders: 650 },
  { id: 'incheon', region: '${korean ? '인천' : 'Incheon'}', orders: 700 },
  { id: 'daegu', region: '${korean ? '대구' : 'Daegu'}', orders: 500 },
  { id: 'daejeon', region: '${korean ? '대전' : 'Daejeon'}', orders: 400 },
]`;
  if (kind === 'heatmap') {
    const days = korean ? ['월', '화', '수', '목', '금', '토', '일'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return `const activity = [
${['09', '12', '15', '18'].flatMap((hour, row) => days.map((day, column) => `  { id: '${row}-${column}', day: '${day}', hour: '${hour}', value: ${((row * 7 + column) * 5 + row * 3) % 9 + 1} },`)).join('\n')}
]`;
  }
  if (kind === 'pie') return `const budget = [
  { id: 'product', label: '${korean ? '제품' : 'Product'}', value: 40 },
  { id: 'sales', label: '${korean ? '영업' : 'Sales'}', value: 30 },
  { id: 'operations', label: '${korean ? '운영' : 'Operations'}', value: 20 },
  { id: 'research', label: '${korean ? '연구' : 'Research'}', value: 10 },
]`;
  return `const channels = [
  { id: 'direct', label: '${korean ? '직접 유입' : 'Direct'}', value: 45 },
  { id: 'search', label: '${korean ? '검색' : 'Search'}', value: 30 },
  { id: 'referral', label: '${korean ? '추천' : 'Referral'}', value: 15 },
  { id: 'campaign', label: '${korean ? '캠페인' : 'Campaign'}', value: 10 },
]`;
}

function datumLabelSource(kind: ChartExampleKind, korean: boolean): string {
  if (kind === 'line') return `const datumLabels = new Map(revenue.map(point => [point.id, \`${'${point.period}'} · $${'${point.revenue}'}k\`]))`;
  if (kind === 'scatter') return `const datumLabels = new Map(services.map(service => [service.id, \`${'${service.service}'} · ${'${service.deploys}'} ${korean ? '회 배포 · 안정성' : 'deployments ·'} ${'${service.stability}'}%\`]))`;
  if (kind === 'bar') return `const datumLabels = new Map(orders.map(order => [order.id, \`${'${order.region}'} · ${'${order.orders}'} ${korean ? '건' : 'orders'}\`]))`;
  if (kind === 'heatmap') return `const datumLabels = new Map(activity.map(cell => [cell.id, \`${'${cell.day}'} ${'${cell.hour}'}:00 · ${'${cell.value}'}\`]))`;
  if (kind === 'pie') return `const datumLabels = new Map(budget.map(item => [item.id, \`${'${item.label}'} · ${'${item.value}'}%\`]))`;
  return `const datumLabels = new Map(channels.map(item => [item.id, \`${'${item.label}'} · ${'${item.value}'}%\`]))`;
}

const titles = Object.freeze({
  en: {
    line: 'Revenue over 12 weeks', scatter: 'Deployment frequency and stability',
    bar: 'Orders by region', heatmap: 'Activity by day and hour',
    pie: 'Quarterly budget allocation', donut: 'Acquisition channel mix',
  },
  ko: {
    line: '12주 매출 추이', scatter: '배포 빈도와 안정성',
    bar: '지역별 주문량', heatmap: '요일·시간대별 활동',
    pie: '분기 예산 배분', donut: '유입 채널 비중',
  },
});

const chartTitle = (kind: ChartExampleKind, korean: boolean): string => (
  korean ? titles.ko[kind] : titles.en[kind]
);

const vueStyle = `<style scoped>
.chart {
  display: grid;
  gap: 0.5rem;
}

.chart :deep([data-part='plot']) {
  height: 22rem;
}

.chart :deep(canvas) {
  width: 100%;
  height: 100%;
}

.chart :deep([data-part='view-controls']) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>`;

type Localized = Readonly<{ en: string; ko: string }>;

const cartesian = Object.freeze({
  line: {
    data: 'revenue', xScale: 'categorical', xField: 'period', xTicks: 6,
    yScale: 'linear', yField: 'revenue', yTicks: 5,
    component: 'ChartLine', layerID: 'weekly-revenue',
    label: { en: 'Revenue', ko: '매출' }, xLabel: { en: 'Week', ko: '주' },
    yLabel: { en: 'Revenue', ko: '매출' }, yUnit: { en: '$k', ko: '$k' }, view: true,
  },
  scatter: {
    data: 'services', xScale: 'linear', xField: 'deploys', xTicks: 5,
    yScale: 'linear', yField: 'stability', yTicks: 4,
    component: 'ChartScatter', layerID: 'service-health',
    label: { en: 'Services', ko: '서비스' }, xLabel: { en: 'Monthly deployments', ko: '월간 배포 횟수' },
    yLabel: { en: 'Stability', ko: '안정성' }, yUnit: { en: '%', ko: '%' }, view: false,
  },
  bar: {
    data: 'orders', xScale: 'categorical', xField: 'region', xTicks: 5,
    yScale: 'linear', yField: 'orders', yTicks: 5,
    component: 'ChartBar', layerID: 'regional-orders',
    label: { en: 'Orders', ko: '주문' }, xLabel: { en: 'Region', ko: '지역' },
    yLabel: { en: 'Order volume', ko: '주문량' }, yUnit: { en: 'orders', ko: '건' }, view: false,
  },
  heatmap: {
    data: 'activity', xScale: 'categorical', xField: 'day', xTicks: 7,
    yScale: 'categorical', yField: 'hour', yTicks: 4,
    component: 'ChartHeatmap', layerID: 'activity-grid',
    label: { en: 'Sessions', ko: '세션' }, xLabel: { en: 'Day', ko: '요일' },
    yLabel: { en: 'Hour', ko: '시간' }, yUnit: undefined, view: false,
  },
});

const localize = (value: Localized, korean: boolean): string => korean ? value.ko : value.en;

function vueSource(kind: ChartExampleKind, korean: boolean): string {
  const title = chartTitle(kind, korean);
  if (kind === 'pie' || kind === 'donut') {
    const component = kind === 'pie' ? 'ChartPie' : 'ChartDonut';
    const data = kind === 'pie' ? 'budget' : 'channels';
    const label = kind === 'pie'
      ? korean ? '예산' : 'Budget'
      : korean ? '유입' : 'Acquisition';
    const layerID = kind === 'pie' ? 'budget-allocation' : 'acquisition-channels';
    return `<script setup lang="ts">
import { ${component}, ChartPlot, ChartRadial, ChartRenderer, ChartRoot } from '@sectile/vue/chart'

${dataSource(kind, korean)}
${datumLabelSource(kind, korean)}

const dom = {
  renderer: 'auto',
  accessibilityLabel: '${title}',
  getAccessibleDatumLabel: (id: string | number) => datumLabels.get(String(id)) ?? String(id),
} as const
</script>

<template>
  <ChartRoot :dom="dom" class="chart">
    <ChartRadial>
      <${component} id="${layerID}" :data="${data}" label="${label}" />
    </ChartRadial>
    <ChartPlot><ChartRenderer /></ChartPlot>
  </ChartRoot>
</template>

${vueStyle}`;
  }

  const chart = cartesian[kind];
  const xLabel = localize(chart.xLabel, korean);
  const yLabel = localize(chart.yLabel, korean);
  const label = localize(chart.label, korean);
  const unit = chart.yUnit === undefined ? undefined : localize(chart.yUnit, korean);
  const viewImports = chart.view
    ? ', ChartAxisView, ChartPanControl, ChartResetView, ChartViewControls, ChartZoomControl'
    : '';
  const xAxis = chart.view
    ? `<ChartXAxis id="x" scale="${chart.xScale}" field="${chart.xField}" label="${xLabel}" :ticks="${chart.xTicks}">
        <ChartAxisView :minimum-span="4" update="preserve" />
      </ChartXAxis>`
    : `<ChartXAxis id="x" scale="${chart.xScale}" field="${chart.xField}" label="${xLabel}" :ticks="${chart.xTicks}" />`;
  const controls = chart.view
    ? `<ChartViewControls axis="x">
      <ChartPanControl direction="backward">${korean ? '이전' : 'Previous'}</ChartPanControl>
      <ChartPanControl direction="forward">${korean ? '다음' : 'Next'}</ChartPanControl>
      <ChartZoomControl direction="in">${korean ? '확대' : 'Zoom in'}</ChartZoomControl>
      <ChartZoomControl direction="out">${korean ? '축소' : 'Zoom out'}</ChartZoomControl>
      <ChartResetView>${korean ? '전체 보기' : 'Show all'}</ChartResetView>
    </ChartViewControls>`
    : '';

  return `<script setup lang="ts">
import {
  ${chart.component}, ChartAxisTicks, ChartCartesian, ChartGrid, ChartNavigation,
  ChartPlot, ChartRenderer, ChartRoot, ChartXAxis, ChartYAxis${viewImports},
} from '@sectile/vue/chart'

${dataSource(kind, korean)}
${datumLabelSource(kind, korean)}

const dom = {
  renderer: 'auto',
  accessibilityLabel: '${title}',
  getAccessibleDatumLabel: (id: string | number) => datumLabels.get(String(id)) ?? String(id),
} as const
</script>

<template>
  <ChartRoot :dom="dom" class="chart">
    <ChartCartesian>
      ${xAxis}
      <ChartYAxis id="y" scale="${chart.yScale}" field="${chart.yField}" label="${yLabel}" :ticks="${chart.yTicks}"${unit === undefined ? '' : ` unit="${unit}"`} />
      <${chart.component} id="${chart.layerID}" :data="${chart.data}" x-axis="x" y-axis="y" label="${label}" />
      <ChartNavigation keyboard />
    </ChartCartesian>
    <ChartGrid />
    <ChartAxisTicks />
    <ChartPlot><ChartRenderer /></ChartPlot>${controls === '' ? '' : `\n    ${controls}`}
  </ChartRoot>
</template>

${vueStyle}`;
}

function definitionSource(kind: ChartExampleKind, korean: boolean): string {
  if (kind === 'pie' || kind === 'donut') {
    const data = kind === 'pie' ? 'budget' : 'channels';
    const layerID = kind === 'pie' ? 'budget-allocation' : 'acquisition-channels';
    const label = kind === 'pie'
      ? korean ? '예산' : 'Budget'
      : korean ? '유입' : 'Acquisition';
    return `const definition = {
  coordinate: { kind: 'radial' },
  layers: [{ kind: '${kind}', id: '${layerID}', data: ${data}, label: '${label}' }],
} as const`;
  }

  const chart = cartesian[kind];
  const xLabel = localize(chart.xLabel, korean);
  const yLabel = localize(chart.yLabel, korean);
  const label = localize(chart.label, korean);
  const unit = chart.yUnit === undefined ? undefined : localize(chart.yUnit, korean);
  return `const definition = {
  coordinate: { kind: 'cartesian', axes: [
    { id: 'x', orientation: 'x', scale: '${chart.xScale}', field: '${chart.xField}', label: '${xLabel}', ticks: ${chart.xTicks} },
    { id: 'y', orientation: 'y', scale: '${chart.yScale}', field: '${chart.yField}', label: '${yLabel}', ticks: ${chart.yTicks}${unit === undefined ? '' : `, unit: '${unit}'`} },
  ] },
  layers: [{
    kind: '${kind}', id: '${chart.layerID}', data: ${chart.data},
    xAxis: 'x', yAxis: 'y', label: '${label}',
  }],
} as const`;
}

function domSource(kind: ChartExampleKind, korean: boolean): string {
  const radial = kind === 'pie' || kind === 'donut';
  const line = kind === 'line';
  const title = chartTitle(kind, korean);
  return `// HTML: <div data-chart><canvas></canvas></div>
// Give the container a height and make the canvas fill it with CSS.
import { createChartController } from '@sectile/chart/controller'
import { createDOMChart } from '@sectile/dom/chart'

${dataSource(kind, korean)}
${datumLabelSource(kind, korean)}
${definitionSource(kind, korean)}

const root = document.querySelector('[data-chart]')
const canvas = root?.querySelector('canvas')

if (!(root instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('${korean ? '차트 영역을 찾을 수 없습니다' : 'Chart container is missing'}')
}

const controller = createChartController({
  definition,${line ? "\n  viewCapabilities: [{ axisID: 'x', minimumSpan: 4, update: 'preserve' }]," : ''}
})
const chart = createDOMChart({
  root,
  canvas,
  controller,
  renderer: 'auto',
  accessibilityLabel: '${title}',
  getAccessibleDatumLabel: id => datumLabels.get(String(id)) ?? String(id),${radial ? '' : "\n  navigation: { wheel: 'native', keyboard: true },"}
})

window.addEventListener('pagehide', () => {
  chart.disconnect()
  controller.dispose()
}, { once: true })`;
}

export function chartExampleSources(
  kind: ChartExampleKind,
  korean = false,
): Readonly<Partial<Record<ChartExampleHost, string>>> {
  return Object.freeze({
    vue: vueSource(kind, korean),
    dom: domSource(kind, korean),
  });
}
