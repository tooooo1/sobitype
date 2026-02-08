# Sobitype

바이럴 소비 캐릭터 테스트. 4문항 -> 8캐릭터 -> 공유 루프.

## 스택

Next.js 16 + React 19 + TypeScript strict + Tailwind v4 + Biome 2 + Bun

React Compiler ON. useCallback/useMemo 쓰지 않는다.

## 구조

```
src/
  app/layout.tsx        # 루트 레이아웃 (ko, Pretendard)
  app/page.tsx          # 서버 컴포넌트. searchParams에서 ?ref= 파싱
  app/globals.css       # 다크 테마, 애니메이션, 접근성
  components/
    spending-test.tsx   # 상태머신 (ref-preview → question → loading → result)
    question-screen.tsx # 밸런스게임 UI
    result-screen.tsx   # 캐릭터 카드 + 공유 + 궁합
    loading-screen.tsx  # 로딩 시퀀스
    ref-preview.tsx     # 친구 캐릭터 미리보기
  lib/
    characters.ts       # 캐릭터 8종, 질문 4개, 궁합 코멘트, 로딩 텍스트
    utils.ts            # GA4, 공유 URL, 타입가드
  types/index.ts        # 모든 타입 정의
```

## 명령어

- `bun dev` — 개발 서버
- `bun run build` — 프로덕션 빌드
- `bun run lint` — Biome 검사
- `bun run lint:fix` — Biome 자동 수정

## 규칙

- `page.tsx`는 서버 컴포넌트. 나머지 컴포넌트는 `"use client"`
- 외부 상태관리 없음. `useState`만 사용
- 타입 단언(`as`) 금지. 타입가드 사용
- 화살표 함수만. `"` 쌍따옴표, `;` 세미콜론, `if` 중괄호 필수
- 한국어 텍스트, 영어 코드/주석
- 다크 모드 전용, 모바일 퍼스트 (max-width: 420px)
