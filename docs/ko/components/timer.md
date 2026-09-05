<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Timer

시작·일시 정지·초기화 동작으로 경과 시간이나 남은 시간을 잽니다.

## 용법

### 스톱워치

현재 상태에 맞는 시작, 일시 정지, 계속, 초기화 동작으로 경과 시간을 잽니다.

<ComponentExample component="timer" scenario="stopwatch" title="스톱워치" description="현재 상태에 맞는 시작, 일시 정지, 계속, 초기화 동작으로 경과 시간을 잽니다." :index="0" />

### 남은 시간

시간을 설정하고 남은 시간과 완료 피드백을 확인합니다.

<ComponentExample component="timer" scenario="countdown" title="남은 시간" description="시간을 설정하고 남은 시간과 완료 피드백을 확인합니다." :index="1" />

### 목표 시간

경과 시간 목표를 설정하고 완료될 때까지 진행 상태를 확인합니다.

<ComponentExample component="timer" scenario="target" title="목표 시간" description="경과 시간 목표를 설정하고 완료될 때까지 진행 상태를 확인합니다." :index="2" />

## 완료 상태 피드백 예시

Timer root는 `idle`, `running`, `complete` 상태를 공개합니다. 완료 순간에 색과 크기를 한 번 바꾸면 반복 애니메이션 없이도 상태 전환을 확인할 수 있습니다.

```css
[data-scope='timer'][data-part='root'] {
  transition: color 140ms ease, transform 140ms ease;
}

[data-scope='timer'][data-part='root'][data-state='complete'] {
  color: var(--status-success, currentColor);
  transform: scale(1.03);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='timer'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Timer API](/ko/api/components/timer)에서 확인합니다.

## 접근성

형식화된 시간 조각을 하나의 값으로 묶고 시작·일시 정지·초기화·재시작을 이름이 있는 작업으로 유지합니다.
