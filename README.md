# 소비타입

4문항 밸런스게임으로 알아보는 소비 캐릭터 테스트.

## 시작하기

```bash
bun install
bun dev
```

## 작동 방식

```
URL 진입 → 바로 Q1 (인트로 없음)
→ 4문항 2지선다 (~10초)
→ 로딩 시퀀스 (2초)
→ 결과: 캐릭터 카드 + 공유 버튼
→ 공유 → 친구가 테스트 → 자동 궁합 → 재공유
```

## 8캐릭터

| 코드 | 캐릭터 | 비율 | 뱃지 |
|------|--------|------|------|
| SNF | 플렉스 전략가 | 8.3% | RARE |
| SNL | 자산 설계자 | 5.1% | RARE |
| SRF | 똑똑한 향유자 | 14.7% | COMMON |
| SRL | 철벽 수호자 | 11.2% | COMMON |
| PNF | 본능적 투자자 | 18.5% | COMMON |
| PNL | 반전매력 재테커 | 4.2% | EPIC |
| PRF | 자유로운 영혼 | 24.8% | COMMON |
| PRL | 느긋한 저축러 | 13.2% | COMMON |

## 기술 스택

Next.js 16 (App Router, React Compiler) + React 19 + TypeScript strict + Tailwind v4 + Biome 2 + Bun
