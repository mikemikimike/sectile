<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Progress

작업 완료도를 정확히 보여 주고 진행량 미정 상태도 함께 나타냅니다.

## 용법

### 확정된 진행량

명시한 최댓값을 기준으로 확인된 완료량을 보여 줍니다.

<ComponentExample component="progress" scenario="determinate" title="확정된 진행량" description="명시한 최댓값을 기준으로 확인된 완료량을 보여 줍니다." :index="0" />

### 진행량 미정

완료량이 미정인 작업 상태를 나타냅니다.

<ComponentExample component="progress" scenario="indeterminate" title="진행량 미정" description="완료량이 미정인 작업 상태를 나타냅니다." :index="1" />

### 완료

현재 값이 최댓값에 도달한 완료 상태를 보여 줍니다.

<ComponentExample component="progress" scenario="complete" title="완료" description="현재 값이 최댓값에 도달한 완료 상태를 보여 줍니다." :index="2" />

### 정확한 소수

입력한 십진수 0.1을 정확한 값으로 유지합니다.

<ComponentExample component="progress" scenario="exact-decimal" title="정확한 소수" description="입력한 십진수 0.1을 정확한 값으로 유지합니다." :index="3" />

## 진행 상태 모션 예시

Determinate Progress는 `--sectile-progress-percentage`를 indicator에 제공합니다. 값 변경은 짧게 보간하고, indeterminate 상태는 별도 반복 모션으로 구분할 수 있습니다.

```css
[data-scope='progress'][data-part='indicator'] {
  inline-size: var(--sectile-progress-percentage, 0%);
  transition: inline-size 180ms linear;
}

[data-scope='progress'][data-part='indicator'][data-status='indeterminate'] {
  inline-size: 35%;
  animation: progress-indeterminate 1.1s ease-in-out infinite alternate;
}

@keyframes progress-indeterminate {
  from { transform: translateX(-15%); }
  to { transform: translateX(185%); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='progress'][data-part='indicator'] {
    animation: none;
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Progress API](/ko/api/components/progress)에서 확인합니다.

## 접근성

이름이 있는 진행 표시줄은 0과 최댓값을 노출하고 진행량 미정 상태에서는 현재 값과 값 텍스트를 생략합니다.
