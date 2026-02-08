import type { Character, MainCode, Question } from '@/types'

// ─── QUESTIONS ─────────────────────────────────────────────────────────────────

export const QUESTIONS: readonly [Question, Question, Question, Question] = [
  {
    id: 'q1',
    axis: 'SP',
    text: '로또 1등 당첨!\n어떻게 받을래?',
    a: { text: '일시불 30억(세후 15억) 💰', emoji: '💰', value: 'S' },
    b: { text: '매달 500만원 평생 💸', emoji: '💸', value: 'P' },
    ratio: { A: 52, B: 48 },
  },
  {
    id: 'q2',
    axis: 'EI',
    text: '친구가 투자해서\n2배 벌었대. 속마음은?',
    a: { text: '뭐 샀어? 나도 알려줘! 📱', emoji: '📱', value: 'E' },
    b: { text: 'ㅊㅋ(나도 하는데 안 말해야지) 🤫', emoji: '🤫', value: 'I' },
    ratio: { A: 38, B: 62 },
  },
  {
    id: 'q3',
    axis: 'NR',
    text: '신이 투자 기회를 줬다.\n뭘 고를래?',
    a: { text: '3년 뒤 확정 2배 🎯', emoji: '🎯', value: 'R' },
    b: { text: '50% 확률 10배, 실패하면 0원 🎲', emoji: '🎲', value: 'N' },
    ratio: { A: 55, B: 45 },
  },
  {
    id: 'q4',
    axis: 'FL',
    text: '신이 제안한다.\n뭘 고를래?',
    a: { text: '1년 세계여행, 복귀 후 현재 연봉 ✈️', emoji: '✈️', value: 'F' },
    b: { text: '1년 지옥 노동, 복귀 후 연봉 2배 🔥', emoji: '🔥', value: 'L' },
    ratio: { A: 58, B: 42 },
  },
]

// ─── CHARACTERS ────────────────────────────────────────────────────────────────
// id 제거 (맵 키와 중복), subVariants 제거 (전 캐릭터 동일 → SUB_TAGS로 분리)

export const CHARACTERS: Record<MainCode, Character> = {
  SNF: {
    emoji: '✨',
    name: '플렉스 전략가',
    title: '계획적으로 화려하게 쓴다',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed, #581c87)',
    rarity: 8.3,
    badge: '💎 RARE',
    badgeColor: '#a78bfa',
    description:
      '예산 앱 깔아놓고 명품 사는 타입. 무계획하게 쓰는 게 아니라, 계획적으로 큰 걸 지른다.',
    stats: { plan: 80, invest: 70, yolo: 90 },
    oneLiner: '엑셀로 예산 짜놓고 명품 지르는 타입',
    match: { best: 'SRL', worst: 'PRF' },
  },
  SNL: {
    emoji: '🏗️',
    name: '자산 설계자',
    title: '시스템으로 돈을 불린다',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #2563eb, #172554)',
    rarity: 5.1,
    badge: '💎 RARE',
    badgeColor: '#60a5fa',
    description:
      '자동이체 세팅해놓고 복리를 믿는 타입. 친구들은 재미없다고 하지만, 10년 뒤에 웃는 건 너야.',
    stats: { plan: 95, invest: 85, yolo: 20 },
    oneLiner: '자동이체 세팅하고 복리를 기다리는 타입',
    match: { best: 'PRF', worst: 'PNF' },
  },
  SRF: {
    emoji: '🎯',
    name: '똑똑한 향유자',
    title: '아끼면서도 인생을 즐긴다',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #022c22)',
    rarity: 14.7,
    badge: '⭐',
    badgeColor: '#6ee7b7',
    description:
      "쿠폰 써서 호텔 가고, 마일리지로 비행기 타는 타입. '가성비 끝판왕'이라는 칭호가 어울린다.",
    stats: { plan: 75, invest: 30, yolo: 65 },
    oneLiner: '쿠폰으로 호캉스 가는 가성비 끝판왕',
    match: { best: 'PRL', worst: 'SNF' },
  },
  SRL: {
    emoji: '🛡️',
    name: '철벽 수호자',
    title: '한 푼도 새어나가지 않는다',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #082f49)',
    rarity: 11.2,
    badge: '⭐',
    badgeColor: '#7dd3fc',
    description: '가계부 앱 3개 동시 사용. 구독 서비스 하나 해지할 때도 손익 계산한다.',
    stats: { plan: 100, invest: 40, yolo: 5 },
    oneLiner: '구독 해지할 때도 손익 계산하는 타입',
    match: { best: 'SNF', worst: 'PNF' },
  },
  PNF: {
    emoji: '🔥',
    name: '본능적 투자자',
    title: '감으로 사고 감으로 판다',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #450a0a)',
    rarity: 18.5,
    badge: '⭐',
    badgeColor: '#fca5a5',
    description: "주식 알림 켜놓고 출근하고, 코인 차트 보면서 잠든다. '인생은 한 방'이 좌우명.",
    stats: { plan: 15, invest: 95, yolo: 85 },
    oneLiner: '코인 차트 보면서 잠드는 타입',
    match: { best: 'SRL', worst: 'PRL' },
  },
  PNL: {
    emoji: '🎰',
    name: '반전매력 재테커',
    title: '즉흥인 줄 알았지? 투자는 진지',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #451a03)',
    rarity: 4.2,
    badge: '👑 EPIC',
    badgeColor: '#fcd34d',
    description: '평소엔 대충 사는 것 같은데, 투자 얘기 나오면 눈이 반짝. 통장은 의외로 체계적.',
    stats: { plan: 30, invest: 80, yolo: 40 },
    oneLiner: '대충 사는 것 같은데 투자 포트폴리오는 완벽',
    match: { best: 'SRF', worst: 'SRL' },
  },
  PRF: {
    emoji: '🦋',
    name: '자유로운 영혼',
    title: '돈은 쓰라고 있는 거 아닌가요?',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #500724)',
    rarity: 24.8,
    badge: '⭐',
    badgeColor: '#f9a8d4',
    description: '통장 잔고? 안 본다. 카드값? 다음 달의 나에게 맡긴다. 걱정은 내일의 내가 하겠지.',
    stats: { plan: 10, invest: 15, yolo: 100 },
    oneLiner: '카드값은 다음 달의 내가 처리해줄 거야',
    match: { best: 'SNL', worst: 'PNF' },
  },
  PRL: {
    emoji: '🐢',
    name: '느긋한 저축러',
    title: '급할 거 없다. 천천히 모으는 중',
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #042f2e)',
    rarity: 13.2,
    badge: '⭐',
    badgeColor: '#5eead4',
    description:
      "적금 하나 들어놓고 잊고 사는 타입. '안전이 제일'인데, 물가는 기다려주지 않는다는 게 함정.",
    stats: { plan: 25, invest: 10, yolo: 15 },
    oneLiner: '적금 하나 넣어놓고 존재를 잊는 타입',
    match: { best: 'PNF', worst: 'PRF' },
  },
}

// ─── SUB_TAGS ──────────────────────────────────────────────────────────────────
// 전 캐릭터 공통 E/I 서브 태그 (캐릭터별로 복사하던 것을 한곳으로)

export const SUB_TAGS: Record<'E' | 'I', string> = {
  E: '돈얘기좋아하는',
  I: '조용히부자되는',
}

// ─── RANDOM TAGS ───────────────────────────────────────────────────────────────

export const RANDOM_TAGS = ['후배밥잘사는', '정산철저한', '충동구매참는', '포인트적립러'] as const

// ─── COMPAT COMMENTS ───────────────────────────────────────────────────────────
// 정렬 키 사용으로 중복 제거 (이전: 'SNF-SRL' + 'SRL-SNF' 양방향 → 이제: 정렬된 한 방향)

export const COMPAT_COMMENTS: Record<string, string> = {
  'SNF-SRL': '한 명이 지르면 한 명이 막는다. 환상의 밸런스 💕',
  'PRF-SNL': '설계자가 자유로운 영혼을 만나면? 의외로 찰떡 💕',
  'PNF-SRL': '모험가와 철벽. 서로 미치겠지만 배울 게 많아 📚',
  'PNF-PRL': '투자 의견 충돌 확정. 둘 다 안 물러서 🔥',
  'PRF-PRF': '둘 다 자유로운 영혼? 통장도 자유롭게 비겠다 😂',
  'SRL-SRL': '철벽 × 철벽. 부자 될 건데 인생이 좀 심심할 수도 🧊',
  'PRF-SNF': '플렉스와 자유로운 영혼. 통장이 위험하다 💸',
  'PRL-SRF': '둘 다 현명한 소비. 함께 가성비 맛집 투어 가자 🍜',
  'PNL-SRF': '반전 재테커와 향유자. 의외로 통하는 조합 ✨',
}

// ─── LOADING TEXTS ─────────────────────────────────────────────────────────────

export const LOADING_TEXTS = [
  '소비 DNA 분석 중...',
  '유형 매칭 중...',
  '당신과 비슷한 유명인 찾는 중... 👀',
] as const
