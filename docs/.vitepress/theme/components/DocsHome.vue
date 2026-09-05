<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import { useDocsLocale } from '../locale.js';
import DocsButton from './DocsButton.vue';

const { isKorean } = useDocsLocale();

const copy = computed(() => isKorean.value ? {
  heroTitle: '예제로 시작하는 접근 가능한 UI',
  heroBody: 'Sectile은 스타일이 비어 있는 Vue 컴포넌트와 DOM·도메인 API를 제공합니다. 필요한 컴포넌트를 고르고, 동작하는 예제를 복사한 뒤, 상태와 스타일과 애니메이션을 제품에 맞게 바꾸면 됩니다.',
  learnAction: '바로 시작하기',
  browseAction: '컴포넌트 보기',
  visibleTitle: '필요한 만큼만 배우세요',
  visibleBody: '처음에는 예제로 시작하고, 특정 동작을 바꾸거나 정확한 타입이 필요할 때 가이드와 API 레퍼런스로 내려가면 됩니다.',
  visibleItems: [
    ['컴포넌트', 'Dialog, Select, Menu, Tabs, 달력, 입력, 데이터 UI를 실행 가능한 예제와 함께 살펴봅니다.'],
    ['예제', '기본형뿐 아니라 controlled 상태, 비활성 항목, 복합 구성, 실제 제품에 가까운 변형을 비교합니다.'],
    ['스타일과 모션', '공개된 part와 state 속성으로 원하는 CSS와 transition을 적용합니다.'],
    ['API', 'Props, events, slots, types와 패키지 API를 한 곳에서 정확하게 찾습니다.'],
  ],
  scopeTitle: '무엇을 찾고 있나요?',
  scopeBody: '저장소 구조를 알 필요 없이 지금 하려는 작업에서 시작할 수 있습니다.',
  scopes: [
    { label: '컴포넌트', description: '필요한 UI를 골라 여러 사용 예시를 확인합니다.', path: '/components/' },
    { label: '가이드', description: '상태 제어, 스타일, 위치, 폼, 날짜, 가상화, 표, 차트를 작업별로 봅니다.', path: '/guides/' },
    { label: 'API', description: '컴포넌트와 패키지의 공개 API를 빠르게 찾습니다.', path: '/api/' },
    { label: '시작하기', description: 'Vue나 DOM에서 설치하고 첫 결과를 만드는 가장 짧은 경로입니다.', path: '/getting-started/' },
  ],
  startTitle: '추천 시작점',
  starts: [
    { label: '시작하기', description: '설치부터 첫 컴포넌트와 스타일 적용까지 따라갑니다.', path: '/getting-started/' },
    { label: '컴포넌트', description: '실행 가능한 예시를 보면서 필요한 UI를 고릅니다.', path: '/components/' },
    { label: '가이드', description: '공통 작업과 패키지별 사용법을 목적에 따라 찾습니다.', path: '/guides/' },
  ],
  advancedTitle: '저수준 패키지는 필요할 때만',
  advancedBody: 'Core, Form, Temporal, Virtual, Tabular, Chart와 host API도 계속 제공됩니다. 일반적인 UI 사용 흐름 뒤에서 필요할 때 가이드와 API 레퍼런스로 접근할 수 있습니다.',
  advancedAction: '가이드 보기',
} : {
  heroTitle: 'Accessible UI that starts with working examples',
  heroBody: 'Sectile provides unstyled Vue components plus DOM and domain APIs. Pick the UI you need, copy a working example, then adapt its state, styling, and motion to your product.',
  learnAction: 'Get started',
  browseAction: 'Browse components',
  visibleTitle: 'Learn only what the task requires',
  visibleBody: 'Start from runnable examples. Move into guides when you need to change behavior, and use the API reference when you need an exact prop, event, slot, type, or package export.',
  visibleItems: [
    ['Components', 'Browse dialogs, selects, menus, tabs, calendars, inputs, and data UI with runnable examples.'],
    ['Examples', 'Compare controlled state, disabled items, compositions, and product-like variants instead of one minimal demo.'],
    ['Styling and motion', 'Use public parts and state attributes to apply your own CSS and transitions.'],
    ['API', 'Look up component and package reference from one predictable place.'],
  ],
  scopeTitle: 'What are you trying to do?',
  scopeBody: 'Start from the task in front of you instead of learning the repository or package architecture first.',
  scopes: [
    { label: 'Components', description: 'Choose a UI pattern and compare several usage examples.', path: '/components/' },
    { label: 'Guides', description: 'Find controlled state, styling, positioning, forms, dates, virtualization, tables, and charts by task.', path: '/guides/' },
    { label: 'API', description: 'Find exact component and package public API.', path: '/api/' },
    { label: 'Getting Started', description: 'Take the shortest path from install to a working Vue or DOM result.', path: '/getting-started/' },
  ],
  startTitle: 'Recommended starting points',
  starts: [
    { label: 'Getting Started', description: 'Install Sectile, render a first component, and apply your own styles.', path: '/getting-started/' },
    { label: 'Components', description: 'Browse runnable examples and choose the UI pattern you need.', path: '/components/' },
    { label: 'Guides', description: 'Find common tasks and package-specific usage without internal implementation detail.', path: '/guides/' },
  ],
  advancedTitle: 'Low-level packages stay available when you need them',
  advancedBody: 'Core, Form, Temporal, Virtual, Tabular, Chart, and host APIs remain available. Reach them through task guides and API reference after the ordinary UI path, not before it.',
  advancedAction: 'Browse guides',
});

const localizedPath = (path: string): string => withBase(isKorean.value ? `/ko${path}` : path);
</script>

<template>
  <main class="docs-home">
    <section class="docs-home__hero">
      <div class="docs-home__hero-copy">
        <h1>{{ copy.heroTitle }}</h1>
        <p class="docs-home__hero-body">{{ copy.heroBody }}</p>
        <div class="docs-home__actions">
          <DocsButton
            appearance="primary"
            class="docs-home__cta"
            :href="localizedPath('/getting-started/')"
            large
          >
            {{ copy.learnAction }}<ArrowRight :size="17" aria-hidden="true" />
          </DocsButton>
          <DocsButton class="docs-home__cta" :href="localizedPath('/components/')" large>
            {{ copy.browseAction }}
          </DocsButton>
        </div>
      </div>
    </section>

    <section class="docs-home__section docs-home__explicit">
      <header class="docs-home__section-heading">
        <h2>{{ copy.visibleTitle }}</h2>
        <p>{{ copy.visibleBody }}</p>
      </header>
      <dl class="explicit-list">
        <div v-for="item in copy.visibleItems" :key="item[0]">
          <dt>{{ item[0] }}</dt>
          <dd>{{ item[1] }}</dd>
        </div>
      </dl>
    </section>

    <section class="docs-home__section docs-home__scope">
      <header class="docs-home__section-heading">
        <h2>{{ copy.scopeTitle }}</h2>
        <p>{{ copy.scopeBody }}</p>
      </header>
      <div class="scope-list">
        <a v-for="scope in copy.scopes" :key="scope.label" :href="localizedPath(scope.path)">
          <strong>{{ scope.label }}</strong>
          <span>{{ scope.description }}</span>
          <ArrowRight :size="18" aria-hidden="true" />
        </a>
      </div>
    </section>

    <section class="docs-home__section docs-home__start">
      <h2>{{ copy.startTitle }}</h2>
      <div class="start-list">
        <a v-for="start in copy.starts" :key="start.label" :href="localizedPath(start.path)">
          <span><strong>{{ start.label }}</strong><small>{{ start.description }}</small></span>
          <ArrowRight :size="20" aria-hidden="true" />
        </a>
      </div>
    </section>

    <aside class="docs-home__advanced">
      <div>
        <h2>{{ copy.advancedTitle }}</h2>
        <p>{{ copy.advancedBody }}</p>
      </div>
      <a :href="localizedPath('/guides/')">{{ copy.advancedAction }}<ArrowRight :size="17" aria-hidden="true" /></a>
    </aside>
  </main>
</template>

<style scoped>
.docs-home {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  color: var(--vp-c-text-1);
}

.docs-home__hero,
.docs-home__section,
.docs-home__advanced {
  width: min(1180px, calc(100% - 48px));
  margin-inline: auto;
}

.docs-home__hero {
  padding: 96px 0 104px;
}

.docs-home__hero-copy {
  max-width: 900px;
}

.docs-home__hero-copy h1 {
  max-width: 720px;
  margin: 0;
  font-size: clamp(3.2rem, 6.4vw, 5.6rem);
  font-weight: 760;
  letter-spacing: -0.04em;
  line-height: 0.96;
  text-wrap: balance;
}

.docs-home__hero-body {
  max-width: 670px;
  margin: 30px 0 0;
  color: var(--vp-c-text-2);
  font-size: clamp(1.08rem, 1.7vw, 1.3rem);
  line-height: 1.65;
  text-wrap: pretty;
}

.docs-home__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 34px;
}

.scope-list a:focus-visible,
.start-list a:focus-visible,
.docs-home__advanced a:focus-visible {
  outline: 2px solid var(--sectile-focus-ring);
  outline-offset: 3px;
}

.docs-home__section {
  padding: 104px 0;
}

.docs-home__explicit {
  border-top: 1px solid var(--vp-c-divider);
}

.docs-home__section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
  gap: clamp(48px, 10vw, 140px);
  align-items: end;
}

.docs-home__section h2,
.docs-home__advanced h2 {
  margin: 0;
  font-size: clamp(2.2rem, 4.2vw, 3.65rem);
  letter-spacing: -0.035em;
  line-height: 1.05;
  text-wrap: balance;
}

.docs-home__section-heading > p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.7;
}

.explicit-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 64px 0 0;
  border-top: 1px solid var(--vp-c-border);
}

.explicit-list > div {
  display: grid;
  grid-template-columns: minmax(120px, 0.38fr) minmax(0, 1fr);
  gap: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 25px 0;
}

.explicit-list > div:nth-child(odd) {
  padding-right: 30px;
}

.explicit-list > div:nth-child(even) {
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 30px;
}

.explicit-list dt {
  font-size: 0.9rem;
  font-weight: 730;
}

.explicit-list dd {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.65;
}

.docs-home__scope {
  width: 100%;
  padding-inline: max(24px, calc((100% - 1180px) / 2));
  background: var(--vp-c-bg-alt);
}

.scope-list {
  display: grid;
  margin-top: 64px;
  border-top: 1px solid var(--vp-c-border);
}

.scope-list a {
  display: grid;
  grid-template-columns: minmax(210px, 0.42fr) minmax(0, 1fr) auto;
  gap: 32px;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 24px 2px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 160ms ease-out, transform 160ms ease-out;
}

.scope-list a:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(8px);
}

.scope-list strong {
  font-size: 1rem;
}

.scope-list span {
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
}

.docs-home__start {
  display: grid;
  grid-template-columns: minmax(260px, 0.58fr) minmax(0, 1fr);
  gap: clamp(48px, 10vw, 140px);
}

.start-list {
  border-top: 1px solid var(--vp-c-border);
}

.start-list a {
  display: flex;
  min-height: 112px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 22px 2px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 160ms ease-out, transform 160ms ease-out;
}

.start-list a:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(8px);
}

.start-list span {
  display: grid;
  gap: 7px;
}

.start-list strong {
  font-size: 1.05rem;
}

.start-list small {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.55;
}

.docs-home__advanced {
  display: flex;
  min-height: 176px;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  margin-bottom: 104px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 36px 42px;
  background: var(--vp-c-bg-soft);
}

.docs-home__advanced h2 {
  font-size: clamp(1.65rem, 3vw, 2.35rem);
}

.docs-home__advanced p {
  max-width: 680px;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.docs-home__advanced a {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-brand-1);
  font-size: 0.92rem;
  font-weight: 720;
  text-decoration: none;
}

@media (max-width: 940px) {
  .docs-home__hero {
    padding-top: 76px;
  }

  .docs-home__hero-copy {
    max-width: 760px;
  }

  .docs-home__section-heading,
  .docs-home__start {
    grid-template-columns: minmax(0, 1fr);
    gap: 34px;
  }
}

@media (max-width: 680px) {
  .docs-home__hero,
  .docs-home__section,
  .docs-home__advanced {
    width: min(100% - 40px, 1180px);
  }

  .docs-home__hero {
    gap: 46px;
    padding: 58px 0 72px;
  }

  .docs-home__hero-copy h1 {
    font-size: clamp(2.7rem, 13vw, 4rem);
  }

  .docs-home__hero-body {
    margin-top: 24px;
    font-size: 1rem;
  }

  .docs-home__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  .docs-home__cta {
    width: 100%;
  }

  .docs-home__section {
    padding: 76px 0;
  }

  .docs-home__scope {
    width: 100%;
    padding-inline: 20px;
  }

  .explicit-list {
    grid-template-columns: minmax(0, 1fr);
    margin-top: 44px;
  }

  .explicit-list > div {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
    padding: 20px 0 !important;
    border-left: 0 !important;
  }

  .scope-list {
    margin-top: 44px;
  }

  .scope-list a {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 20px;
  }

  .scope-list span {
    grid-column: 1;
  }

  .scope-list svg {
    grid-row: 1 / span 2;
    grid-column: 2;
  }

  .start-list a {
    min-height: 104px;
  }

  .docs-home__advanced {
    align-items: flex-start;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 72px;
    padding: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scope-list a,
  .start-list a {
    transition: none;
  }
}
</style>
