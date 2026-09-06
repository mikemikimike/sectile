<script setup lang="ts">
import {
  ChartAxisTicks,
  ChartAxisView,
  ChartBar,
  ChartCartesian,
  ChartDonut,
  ChartGrid,
  ChartHeatmap,
  ChartLine,
  ChartNavigation,
  ChartPanControl,
  ChartPie,
  ChartPlot,
  ChartRadial,
  ChartRenderer,
  ChartResetView,
  ChartRoot,
  ChartScatter,
  ChartViewControls,
  ChartXAxis,
  ChartYAxis,
  ChartZoomControl,
} from '@sectile/vue/chart';
import type { ChartState } from '@sectile/chart/interaction';
import { computed } from 'vue';
import {
  chartExampleSources,
  type ChartExampleHost,
  type ChartExampleKind,
} from '../chart-example-code.js';
import { useDocsLocale } from '../locale.js';
import ExampleFrame from './ExampleFrame.vue';

const props = defineProps<{
  kind?: ChartExampleKind;
  host?: ChartExampleHost;
}>();

const { isKorean } = useDocsLocale();
const selectedKind = computed<ChartExampleKind>(() => props.kind ?? 'line');

const copy = computed(() => isKorean.value ? {
  title: {
    line: '12주 매출 추이', scatter: '배포 빈도와 안정성', bar: '지역별 주문량', heatmap: '요일·시간대별 활동', pie: '분기 예산 배분', donut: '유입 채널 비중',
  },
  description: {
    line: '주별 매출 흐름을 보고 최근 변화와 특정 주의 값을 확인합니다.',
    scatter: '서비스별 배포 빈도와 안정성의 관계를 비교합니다.',
    bar: '지역별 주문량을 같은 기준선에서 비교합니다.',
    heatmap: '요일과 시간대가 겹치는 구간에서 활동이 몰리는 때를 찾습니다.',
    pie: '한 분기 예산이 부문별로 어떻게 배분됐는지 비교합니다.',
    donut: '유입 채널별 비중을 비교하면서 전체 구성을 확인합니다.',
  },
  summary: {
    line: '최근 주 $200k · 12주', scatter: '6개 서비스 · 안정성 94–100%', bar: '5개 지역 · 최고 800건', heatmap: '7일 · 4개 시간대', pie: '분기 예산 100%', donut: '4개 채널 · 유입 100%',
  },
  xLabel: { line: '주', scatter: '월간 배포 횟수', bar: '지역', heatmap: '요일', pie: '', donut: '' },
  yLabel: { line: '매출', scatter: '안정성', bar: '주문량', heatmap: '시간', pie: '', donut: '' },
  yUnit: { line: '$k', scatter: '%', bar: '건', heatmap: undefined, pie: undefined, donut: undefined },
  seriesLabel: { line: '매출', scatter: '서비스', bar: '주문', heatmap: '세션', pie: '예산', donut: '유입' },
  active: '현재 항목', selected: '선택한 항목', inspect: '세부 값',
  empty: '차트의 항목을 가리키거나 선택하면 값을 확인할 수 있습니다.',
  help: {
    line: '점을 가리키거나 선택해 값을 확인하세요. 범위를 좁힌 뒤 이전·다음 구간으로 이동하거나 전체 범위로 돌아갈 수 있습니다.',
    scatter: '점을 가리키거나 선택해 서비스별 배포 빈도와 안정성을 비교하세요.',
    bar: '막대를 가리키거나 선택해 지역별 주문량을 비교하세요.',
    heatmap: '셀을 가리키거나 선택해 활동이 몰리는 시간대를 확인하세요.',
    pie: '조각을 가리키거나 선택해 부문별 예산 비중을 확인하세요.',
    donut: '구간을 가리키거나 선택해 채널별 유입 비중을 확인하세요.',
  },
  previous: '이전', next: '다음', zoomIn: '확대', zoomOut: '축소', reset: '전체 보기',
  chart: '차트 예시',
} : {
  title: {
    line: 'Revenue over 12 weeks', scatter: 'Deployment frequency and stability', bar: 'Orders by region', heatmap: 'Activity by day and hour', pie: 'Quarterly budget allocation', donut: 'Acquisition channel mix',
  },
  description: {
    line: 'Read the weekly revenue trend, inspect a specific week, and narrow the visible range when needed.',
    scatter: 'Compare deployment frequency with stability across services.',
    bar: 'Compare regional order volume from a common baseline.',
    heatmap: 'Find the day and time combinations where activity is concentrated.',
    pie: 'Compare how one quarterly budget is divided across departments.',
    donut: 'Compare acquisition-channel shares while keeping the whole visible.',
  },
  summary: {
    line: 'Latest $200k · 12 weeks', scatter: '6 services · 94–100% stability', bar: '5 regions · top 800 orders', heatmap: '7 days · 4 time windows', pie: '100% quarterly budget', donut: '4 channels · 100% acquisition',
  },
  xLabel: { line: 'Week', scatter: 'Monthly deployments', bar: 'Region', heatmap: 'Day', pie: '', donut: '' },
  yLabel: { line: 'Revenue', scatter: 'Stability', bar: 'Order volume', heatmap: 'Hour', pie: '', donut: '' },
  yUnit: { line: '$k', scatter: '%', bar: 'orders', heatmap: undefined, pie: undefined, donut: undefined },
  seriesLabel: { line: 'Revenue', scatter: 'Services', bar: 'Orders', heatmap: 'Sessions', pie: 'Budget', donut: 'Acquisition' },
  active: 'Current', selected: 'Selected', inspect: 'Detail',
  empty: 'Hover or select a chart mark to inspect its value.',
  help: {
    line: 'Hover or select a point to inspect it. Narrow the range, move backward or forward, or return to the full view.',
    scatter: 'Hover or select a point to compare deployment frequency and stability by service.',
    bar: 'Hover or select a bar to compare regional order volume.',
    heatmap: 'Hover or select a cell to find the busiest day and time combinations.',
    pie: 'Hover or select a slice to inspect each department\'s budget share.',
    donut: 'Hover or select a segment to inspect each acquisition channel\'s share.',
  },
  previous: 'Previous', next: 'Next', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Show all',
  chart: 'Chart example',
});

const series = computed(() => {
  const regions = isKorean.value
    ? ['서울', '부산', '인천', '대구', '대전']
    : ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'];
  const days = isKorean.value
    ? ['월', '화', '수', '목', '금', '토', '일']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const budgetLabels = isKorean.value
    ? ['제품', '영업', '운영', '연구']
    : ['Product', 'Sales', 'Operations', 'Research'];
  const channelLabels = isKorean.value
    ? ['직접 유입', '검색', '추천', '캠페인']
    : ['Direct', 'Search', 'Referral', 'Campaign'];

  return {
    line: [
      { id: 'week-01', period: '6/1', revenue: 120 }, { id: 'week-02', period: '6/8', revenue: 128 },
      { id: 'week-03', period: '6/15', revenue: 136 }, { id: 'week-04', period: '6/22', revenue: 132 },
      { id: 'week-05', period: '6/29', revenue: 148 }, { id: 'week-06', period: '7/6', revenue: 154 },
      { id: 'week-07', period: '7/13', revenue: 160 }, { id: 'week-08', period: '7/20', revenue: 168 },
      { id: 'week-09', period: '7/27', revenue: 172 }, { id: 'week-10', period: '8/3', revenue: 180 },
      { id: 'week-11', period: '8/10', revenue: 188 }, { id: 'week-12', period: '8/17', revenue: 200 },
    ],
    scatter: [
      { id: 'api', service: 'API', deploys: 10, stability: 100 },
      { id: 'worker', service: 'Worker', deploys: 18, stability: 98 },
      { id: 'web', service: 'Web', deploys: 26, stability: 97 },
      { id: 'billing', service: 'Billing', deploys: 34, stability: 96 },
      { id: 'search', service: 'Search', deploys: 42, stability: 94 },
      { id: 'identity', service: 'Identity', deploys: 50, stability: 99 },
    ],
    bar: regions.map((region, index) => ({
      id: ['seoul', 'busan', 'incheon', 'daegu', 'daejeon'][index]!,
      region,
      orders: [800, 650, 700, 500, 400][index]!,
    })),
    heatmap: Array.from({ length: 28 }, (_, index) => ({
      id: `activity-${index}`,
      day: days[index % 7]!,
      hour: ['09', '12', '15', '18'][Math.floor(index / 7)]!,
      value: ((index * 5 + Math.floor(index / 7) * 3) % 9) + 1,
    })),
    pie: budgetLabels.map((label, index) => ({
      id: ['product', 'sales', 'operations', 'research'][index]!,
      label,
      value: [40, 30, 20, 10][index]!,
    })),
    donut: channelLabels.map((label, index) => ({
      id: ['direct', 'search', 'referral', 'campaign'][index]!,
      label,
      value: [45, 30, 15, 10][index]!,
    })),
  };
});

const isRadial = computed(() => selectedKind.value === 'pie' || selectedKind.value === 'donut');
const xScale = computed(() => selectedKind.value === 'scatter' ? 'linear' : 'categorical');
const xField = computed(() => selectedKind.value === 'line' ? 'period' : selectedKind.value === 'scatter' ? 'deploys' : selectedKind.value === 'bar' ? 'region' : 'day');
const yScale = computed(() => selectedKind.value === 'heatmap' ? 'categorical' : 'linear');
const yField = computed(() => selectedKind.value === 'line' ? 'revenue' : selectedKind.value === 'scatter' ? 'stability' : selectedKind.value === 'bar' ? 'orders' : 'hour');
const xTicks = computed(() => selectedKind.value === 'line' ? 6 : selectedKind.value === 'scatter' ? 5 : selectedKind.value === 'bar' ? 5 : 7);
const yTicks = computed(() => selectedKind.value === 'line' ? 5 : selectedKind.value === 'scatter' ? 4 : selectedKind.value === 'bar' ? 5 : 4);
const yUnitProps = computed(() => {
  const unit = copy.value.yUnit[selectedKind.value];
  return unit === undefined ? {} : { unit };
});
const sources = computed(() => chartExampleSources(selectedKind.value));
const koSources = computed(() => chartExampleSources(selectedKind.value, true));
const frameHostProps = computed(() => props.host === undefined ? {} : { fixedHost: props.host });

function detailFor(id: string | number): string {
  const key = String(id);
  switch (selectedKind.value) {
    case 'line': {
      const record = series.value.line.find(item => item.id === key);
      return record === undefined ? key : `${record.period} · $${record.revenue}k`;
    }
    case 'scatter': {
      const record = series.value.scatter.find(item => item.id === key);
      if (record === undefined) return key;
      return isKorean.value
        ? `${record.service} · 월 ${record.deploys}회 배포 · 안정성 ${record.stability}%`
        : `${record.service} · ${record.deploys} deployments/month · ${record.stability}% stability`;
    }
    case 'bar': {
      const record = series.value.bar.find(item => item.id === key);
      if (record === undefined) return key;
      return isKorean.value ? `${record.region} · ${record.orders}건` : `${record.region} · ${record.orders} orders`;
    }
    case 'heatmap': {
      const record = series.value.heatmap.find(item => item.id === key);
      if (record === undefined) return key;
      return isKorean.value ? `${record.day}요일 ${record.hour}시 · 활동 ${record.value}` : `${record.day} ${record.hour}:00 · activity ${record.value}`;
    }
    case 'pie': {
      const record = series.value.pie.find(item => item.id === key);
      return record === undefined ? key : `${record.label} · ${record.value}%`;
    }
    case 'donut': {
      const record = series.value.donut.find(item => item.id === key);
      return record === undefined ? key : `${record.label} · ${record.value}%`;
    }
  }
}

function selectedID(state: ChartState | null): string | number | null {
  if (state?.selection.type !== 'points') return null;
  return state.selection.ids[0] ?? null;
}

function detailID(state: ChartState | null): string | number | null {
  return selectedID(state) ?? state?.activeDatum ?? null;
}

function detailHeading(state: ChartState | null): string {
  if (selectedID(state) !== null) return copy.value.selected;
  if (state?.activeDatum != null) return copy.value.active;
  return copy.value.inspect;
}

function detailText(state: ChartState | null): string {
  const id = detailID(state);
  return id === null ? copy.value.empty : detailFor(id);
}

const datumLabel = (id: string | number): string => detailFor(id);
</script>

<template>
  <ExampleFrame
    v-bind="frameHostProps"
    :sources="sources"
    :ko-sources="koSources"
    source-relationship="usage"
    unmount-preview-when-hidden
    :source-note="isKorean
      ? '미리보기에는 제목, 요약, 세부 값 표시처럼 문서에서 읽기 쉬운 표현이 더해져 있습니다. 사용 코드는 같은 데이터를 공개 Chart API에 연결하는 Vue 또는 DOM 흐름에 집중합니다.'
      : 'The preview adds documentation presentation such as the title, summary, and detail row. The usage code focuses on connecting the same data through the public Vue or DOM Chart APIs.'"
  >
    <section class="chart-example" :aria-label="copy.chart">
      <header class="chart-example__header">
        <div>
          <p class="chart-example__eyebrow">{{ copy.seriesLabel[selectedKind] }}</p>
          <h3>{{ copy.title[selectedKind] }}</h3>
          <p>{{ copy.description[selectedKind] }}</p>
        </div>
        <strong class="chart-example__summary">{{ copy.summary[selectedKind] }}</strong>
      </header>

      <ChartRoot
        v-if="!isRadial"
        key="cartesian"
        v-slot="{ state }"
        :dom="{
          renderer: 'auto',
          accessibilityLabel: copy.title[selectedKind],
          getAccessibleDatumLabel: datumLabel,
        }"
        class="chart-example__surface"
      >
        <ChartCartesian>
          <ChartXAxis
            id="x"
            :scale="xScale"
            :field="xField"
            :label="copy.xLabel[selectedKind]"
            :ticks="xTicks"
          >
            <ChartAxisView v-if="selectedKind === 'line'" :minimum-span="4" update="preserve" />
          </ChartXAxis>
          <ChartYAxis
            v-bind="yUnitProps"
            id="y"
            :scale="yScale"
            :field="yField"
            :label="copy.yLabel[selectedKind]"
            :ticks="yTicks"
          />
          <ChartLine v-if="selectedKind === 'line'" id="weekly-revenue" :data="series.line" x-axis="x" y-axis="y" :label="copy.seriesLabel.line" />
          <ChartScatter v-else-if="selectedKind === 'scatter'" id="service-health" :data="series.scatter" x-axis="x" y-axis="y" :label="copy.seriesLabel.scatter" />
          <ChartBar v-else-if="selectedKind === 'bar'" id="regional-orders" :data="series.bar" x-axis="x" y-axis="y" :label="copy.seriesLabel.bar" />
          <ChartHeatmap v-else id="activity-grid" :data="series.heatmap" x-axis="x" y-axis="y" :label="copy.seriesLabel.heatmap" />
          <ChartNavigation keyboard />
        </ChartCartesian>
        <ChartGrid />
        <ChartAxisTicks />
        <ChartPlot class="chart-example__plot"><ChartRenderer /></ChartPlot>
        <ChartViewControls v-if="selectedKind === 'line'" axis="x" class="chart-example__controls">
          <ChartPanControl direction="backward" :label="copy.previous">{{ copy.previous }}</ChartPanControl>
          <ChartPanControl direction="forward" :label="copy.next">{{ copy.next }}</ChartPanControl>
          <ChartZoomControl direction="in" :label="copy.zoomIn">{{ copy.zoomIn }}</ChartZoomControl>
          <ChartZoomControl direction="out" :label="copy.zoomOut">{{ copy.zoomOut }}</ChartZoomControl>
          <ChartResetView :label="copy.reset">{{ copy.reset }}</ChartResetView>
        </ChartViewControls>
        <p class="chart-example__detail" aria-live="polite">
          <strong>{{ detailHeading(state) }}</strong>
          <span>{{ detailText(state) }}</span>
        </p>
      </ChartRoot>

      <ChartRoot
        v-else
        key="radial"
        v-slot="{ state }"
        :dom="{
          renderer: 'auto',
          accessibilityLabel: copy.title[selectedKind],
          getAccessibleDatumLabel: datumLabel,
        }"
        class="chart-example__surface chart-example__surface--radial"
      >
        <ChartRadial>
          <ChartPie v-if="selectedKind === 'pie'" id="budget-allocation" :data="series.pie" :label="copy.seriesLabel.pie" />
          <ChartDonut v-else id="acquisition-channels" :data="series.donut" :label="copy.seriesLabel.donut" />
        </ChartRadial>
        <ChartPlot class="chart-example__plot"><ChartRenderer /></ChartPlot>
        <p class="chart-example__detail" aria-live="polite">
          <strong>{{ detailHeading(state) }}</strong>
          <span>{{ detailText(state) }}</span>
        </p>
      </ChartRoot>

      <footer class="chart-example__help">{{ copy.help[selectedKind] }}</footer>
    </section>
  </ExampleFrame>
</template>

<style scoped>
.chart-example {
  overflow: hidden;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.chart-example__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.15rem 1.25rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.chart-example__header h3,
.chart-example__header p { margin: 0; }
.chart-example__header h3 { font-size: 1.08rem; line-height: 1.35; letter-spacing: -0.018em; }
.chart-example__header > div > p:last-child { max-width: 56ch; margin-top: 0.3rem; color: var(--vp-c-text-2); font-size: 0.78rem; line-height: 1.55; }

.chart-example__eyebrow {
  margin-bottom: 0.28rem !important;
  color: var(--vp-c-brand-1);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.chart-example__summary {
  flex: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 0.4rem 0.65rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font-size: 0.7rem;
  font-weight: 650;
  line-height: 1.2;
  white-space: nowrap;
}

.chart-example__surface {
  display: grid;
  min-width: 0;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 62%, var(--vp-c-bg));
}

.chart-example__plot {
  height: clamp(18rem, 40vw, 22rem);
  min-width: 0;
  overflow: hidden;
}

.chart-example__surface--radial .chart-example__plot {
  height: clamp(19rem, 42vw, 23rem);
}

.chart-example__plot :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.chart-example__plot :deep([data-chart-overlay='axis-value']) {
  font-size: 11px;
  opacity: 0.78;
}

.chart-example__plot :deep([data-chart-overlay='axis-label']) {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.78;
}

.chart-example__plot :deep([data-chart-overlay='grid-line']) {
  stroke-opacity: 0.08;
}

.chart-example__surface :deep([data-chart-overlay='legend']) {
  display: none;
}

.chart-example__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
}

.chart-example__controls button {
  min-height: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  padding: 0.32rem 0.58rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  font: inherit;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
}

.chart-example__controls button:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-text-1); }
.chart-example__controls button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }

.chart-example__detail {
  display: flex;
  min-height: 2.9rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0;
  padding: 0.68rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  font-size: 0.74rem;
  line-height: 1.45;
}

.chart-example__detail strong {
  flex: none;
  color: var(--vp-c-brand-1);
  font-size: 0.7rem;
}

.chart-example__detail span { text-align: right; }

.chart-example__help {
  padding: 0.72rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  line-height: 1.5;
}

@media (max-width: 720px) {
  .chart-example__header { display: grid; gap: 0.8rem; }
  .chart-example__summary { justify-self: start; white-space: normal; }
  .chart-example__plot,
  .chart-example__surface--radial .chart-example__plot { height: 18rem; }
  .chart-example__controls { justify-content: flex-start; }
  .chart-example__detail { align-items: flex-start; flex-direction: column; gap: 0.2rem; }
  .chart-example__detail span { text-align: left; }
}
</style>
