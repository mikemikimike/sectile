<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Switch

설정 하나를 즉시 전환합니다.

## 용법

### 알림

배포 알림 설정을 한 번의 조작으로 즉시 전환합니다.

<ComponentExample component="switch" scenario="off" title="알림" description="배포 알림 설정을 한 번의 조작으로 즉시 전환합니다." :index="0" />

### 켜짐

켜진 상태에서 시작하며 같은 이름으로 현재 상태를 드러냅니다.

<ComponentExample component="switch" scenario="on" title="켜짐" description="켜진 상태에서 시작하며 같은 이름으로 현재 상태를 드러냅니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="switch" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Switch API](/ko/api/components/switch)에서 확인합니다.

## 접근성

루트는 스위치 의미를 제공하며 선택·비활성·읽기 전용 상태를 구분합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)에서 호스트 접근성 규칙을 확인할 수 있습니다.
