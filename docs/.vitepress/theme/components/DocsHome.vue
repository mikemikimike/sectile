<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import { useDocsLocale } from '../locale.js';
import DocsButton from './DocsButton.vue';

const { isKorean } = useDocsLocale();

const copy = computed(() => isKorean.value ? {
  heroTitle: '화면 표현과 분리된 상호작용 규칙',
  heroBody: 'Sectile은 선택, 탐색, 편집, 폼과 같은 인터페이스 동작을 특정 렌더러와 분리해 정의합니다. 같은 상태와 전이 규칙을 Vue, DOM, 터미널 등 지원되는 실행 환경에서 일관되게 사용할 수 있습니다.',
  learnAction: '시작하기',
  browseAction: '컴포넌트 보기',
  visibleTitle: '문서에서 다루는 것',
  visibleBody: '컴포넌트 사용법과 공통 작업은 가이드에서 설명하고, 정확한 공개 표면은 API 레퍼런스에 모았습니다.',
  visibleItems: [
    ['컴포넌트', '대화상자, 선택 목록, 메뉴, 탭, 달력, 입력, 데이터 UI의 사용 예제를 확인합니다.'],
    ['예제', '기본 사용, 상태 제어, 비활성 항목, 복합 구성처럼 실제 구현에서 필요한 변형을 다룹니다.'],
    ['스타일과 모션', '공개 파트와 상태 속성을 기준으로 CSS와 전환 효과를 적용하는 방법을 설명합니다.'],
    ['API', '속성, 이벤트, 슬롯, 타입과 패키지 공개 API를 한 곳에서 찾을 수 있습니다.'],
  ],
  scopeTitle: '문서 둘러보기',
  scopeBody: '문서는 시작하기, 컴포넌트, 가이드, API로 나뉩니다.',
  scopes: [
    { label: '컴포넌트', description: 'UI 패턴별 사용 예제와 상태 변형을 확인합니다.', path: '/components/' },
    { label: '가이드', description: '스타일, 위치 지정, 상태 제어, 폼, 날짜, 가상 목록, 표와 차트 작업을 설명합니다.', path: '/guides/' },
    { label: 'API', description: '컴포넌트와 패키지의 공개 API를 참조합니다.', path: '/api/' },
    { label: '시작하기', description: '실행 환경 설치부터 첫 컴포넌트까지 이어지는 기본 흐름을 설명합니다.', path: '/getting-started/' },
  ],
  startTitle: '주요 문서',
  starts: [
    { label: '시작하기', description: '설치, 가져오기, 첫 예제와 기본 스타일 적용을 설명합니다.', path: '/getting-started/' },
    { label: '컴포넌트', description: '컴포넌트별 사용 예제와 공개 상태를 확인합니다.', path: '/components/' },
    { label: '가이드', description: '공통 작업과 패키지별 사용법을 주제별로 정리합니다.', path: '/guides/' },
  ],
  advancedTitle: '도메인과 실행 환경 API',
  advancedBody: 'Core, Form, Temporal, Virtual, Tabular, Chart와 실행 환경 API는 컴포넌트보다 낮은 수준에서 상태, 도메인 규칙, 실행 환경 연결을 직접 다룰 때 사용합니다.',
  advancedAction: '가이드 보기',
} : {
  heroTitle: 'Interaction semantics, independent of presentation',
  heroBody: 'Sectile defines interface behavior—selection, navigation, editing, forms, and more—separately from rendering. The same state and transition rules can be projected consistently across Vue, DOM, terminal, and other supported hosts.',
  learnAction: 'Get started',
  browseAction: 'Browse components',
  visibleTitle: 'What the documentation covers',
  visibleBody: 'Component usage and common tasks live in guides; exact public surfaces are collected in the API reference.',
  visibleItems: [
    ['Components', 'See usage examples for dialogs, selects, menus, tabs, calendars, inputs, and data UI.'],
    ['Examples', 'Cover practical variants such as controlled state, disabled items, and compound composition.'],
    ['Styling and motion', 'Apply CSS and transitions through public parts and state attributes.'],
    ['API', 'Find props, events, slots, types, and package exports in one reference area.'],
  ],
  scopeTitle: 'Browse the documentation',
  scopeBody: 'The documentation is organized into Getting Started, Components, Guides, and API.',
  scopes: [
    { label: 'Components', description: 'Review usage examples and state variants by UI pattern.', path: '/components/' },
    { label: 'Guides', description: 'Read about styling, positioning, controlled state, forms, dates, virtualization, tables, and charts.', path: '/guides/' },
    { label: 'API', description: 'Reference the public component and package APIs.', path: '/api/' },
    { label: 'Getting Started', description: 'Follow the basic path from host installation to a first component.', path: '/getting-started/' },
  ],
  startTitle: 'Core documentation',
  starts: [
    { label: 'Getting Started', description: 'Covers installation, imports, a first example, and basic styling.', path: '/getting-started/' },
    { label: 'Components', description: 'Shows component usage examples and public state.', path: '/components/' },
    { label: 'Guides', description: 'Organizes common tasks and package-specific usage by topic.', path: '/guides/' },
  ],
  advancedTitle: 'Domain and host APIs',
  advancedBody: 'Core, Form, Temporal, Virtual, Tabular, Chart, and host APIs are available when you need direct access to state, domain rules, or host integration below the component layer.',
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
