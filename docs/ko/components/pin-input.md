<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Pin Input

여러 한 글자 입력 칸을 연결해 짧은 인증 번호를 입력합니다.

## 용법

### 인증 번호

짧은 숫자 인증 번호를 한 칸씩 입력합니다.

<ComponentExample component="pin-input" scenario="verification-code" title="인증 번호" description="짧은 숫자 인증 번호를 한 칸씩 입력합니다." :index="0" />

### 입력 칸 수 설정

서비스에서 요구하는 번호 형식에 맞게 입력 칸 수를 설정합니다.

<ComponentExample component="pin-input" scenario="custom-length" title="입력 칸 수 설정" description="서비스에서 요구하는 번호 형식에 맞게 입력 칸 수를 설정합니다." :index="1" />

### 입력값 가리기

입력한 번호가 화면에 계속 보이면 안 될 때 문자를 가립니다.

<ComponentExample component="pin-input" scenario="masked" title="입력값 가리기" description="입력한 번호가 화면에 계속 보이면 안 될 때 문자를 가립니다." :index="2" />

### 입력 칸 자리표시자

자리표시자를 입력값과 분리해 각 입력 칸에 전달합니다.

<ComponentExample component="pin-input" scenario="placeholders" title="입력 칸 자리표시자" description="자리표시자를 입력값과 분리해 각 입력 칸에 전달합니다." :index="3" />

### OTP 자동 완성

입력값이 실제 일회용 인증 번호일 때만 OTP 자동 완성을 명시적으로 켭니다.

<ComponentExample component="pin-input" scenario="otp" title="OTP 자동 완성" description="입력값이 실제 일회용 인증 번호일 때만 OTP 자동 완성을 명시적으로 켭니다." :index="4" />

### 읽기 전용

포커스로 값을 확인하고 모든 변경 요청을 읽기 전용 상태로 처리합니다.

<ComponentExample component="pin-input" scenario="readonly" title="읽기 전용" description="포커스로 값을 확인하고 모든 변경 요청을 읽기 전용 상태로 처리합니다." :index="5" />

### 비활성 항목

비활성 상태에서 키보드와 포인터 입력을 차단합니다.

<ComponentExample component="pin-input" scenario="disabled" title="비활성 항목" description="비활성 상태에서 키보드와 포인터 입력을 차단합니다." :index="6" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="pin-input" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="7" />

## 입력 피드백 스타일 예시

입력값 자체의 이동을 애니메이션하기보다 root의 `:focus-within`을 짧게 전환하면 caret과 IME 동작을 방해하지 않고 현재 편집 위치를 보여줄 수 있습니다.

```css
[data-scope='pin-input'][data-part='root'] {
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

[data-scope='pin-input'][data-part='root']:focus-within {
  background: color-mix(in srgb, currentColor 5%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='pin-input'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Pin Input API](/ko/api/components/pin-input)에서 확인합니다.

## 접근성

각 숫자 입력에 독립적인 이름을 제공하고 예측 가능한 포커스 순서를 유지합니다.
