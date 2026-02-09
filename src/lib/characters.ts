import type { Character, MainCode, Question } from "@/types";

export const QUESTIONS: readonly [Question, Question, Question, Question] = [
  {
    id: "q1",
    axis: "SP",
    text: "로또 1등 당첨!\n어떻게 받을래?",
    a: { text: "일시불 30억(세후 15억)", emoji: "📊", value: "S" },
    b: { text: "매달 500만원 평생", emoji: "💸", value: "P" },
    ratio: { A: 52, B: 48 },
  },
  {
    id: "q2",
    axis: "EI",
    text: "친구가 투자해서\n2배 벌었대. 속마음은?",
    a: { text: "뭐 샀어? 나도 알려줘!", emoji: "📱", value: "E" },
    b: { text: "ㅊㅋ(나도 하는데 안 말해야지)", emoji: "🤫", value: "I" },
    ratio: { A: 38, B: 62 },
  },
  {
    id: "q3",
    axis: "NR",
    text: "신이 투자 기회를 줬다.\n뭘 고를래?",
    a: { text: "3년 뒤 확정 2배", emoji: "🎯", value: "R" },
    b: { text: "50% 확률 10배, 실패하면 0원", emoji: "🎲", value: "N" },
    ratio: { A: 45, B: 55 },
  },
  {
    id: "q4",
    axis: "FL",
    text: "신이 제안한다.\n뭘 고를래?",
    a: { text: "1년 세계여행, 복귀 후 현재 연봉", emoji: "✈️", value: "F" },
    b: { text: "1년 지옥 노동, 복귀 후 연봉 2배", emoji: "💰", value: "L" },
    ratio: { A: 58, B: 42 },
  },
];

export const CHARACTERS: Record<MainCode, Character> = {
  SNF: {
    emoji: "✨",
    name: "플렉스 전략가",
    title: "계획적으로 화려하게 쓴다",
    description:
      "예산 앱 깔아놓고 명품 사는 타입. 무계획하게 쓰는 게 아니라, 계획적으로 큰 걸 지른다. 주변에선 부자인 줄 알지만, 엑셀에는 빨간 셀이 좀 있다.",
    color: "#a362ff",
    cardBg: "#4401a5",
    rarity: 8.3,
    badge: "💎 RARE",
    badgeColor: "#c6a2ff",
    stats: { plan: 80, invest: 70, yolo: 90 },
    oneLiner: "엑셀로 예산 짜놓고 명품 지르는 타입",
    match: { best: "SRL", worst: "PRF" },
  },
  SNL: {
    emoji: "🏗️",
    name: "자산 설계자",
    title: "시스템으로 돈을 불린다",
    description:
      "자동이체 세팅해놓고 복리를 믿는 타입. 30대에 벌써 노후 계획이 있다. 친구들은 재미없다고 하지만, 10년 뒤에 웃는 건 너야.",
    color: "#49b0ff",
    cardBg: "#01599c",
    rarity: 5.1,
    badge: "💎 RARE",
    badgeColor: "#49b0ff",
    stats: { plan: 95, invest: 85, yolo: 20 },
    oneLiner: "자동이체 세팅하고 복리를 기다리는 타입",
    match: { best: "PRF", worst: "PNF" },
  },
  SRF: {
    emoji: "🎯",
    name: "똑똑한 향유자",
    title: "아끼면서도 인생을 즐긴다",
    description:
      '쿠폰 써서 호텔 가고, 마일리지로 비행기 타는 타입. 적게 쓰면서 많이 누리는 기술의 달인. "가성비 끝판왕"이라는 칭호가 어울린다.',
    color: "#5ed0a4",
    cardBg: "#27614b",
    rarity: 14.7,
    badge: "⭐ COMMON",
    badgeColor: "#b0f7cd",
    stats: { plan: 75, invest: 30, yolo: 65 },
    oneLiner: "쿠폰으로 호캉스 가는 가성비 끝판왕",
    match: { best: "PRL", worst: "SNF" },
  },
  SRL: {
    emoji: "🛡️",
    name: "철벽 수호자",
    title: "한 푼도 새어나가지 않는다",
    description:
      "가계부 앱 3개 동시 사용. 구독 서비스 하나 해지할 때도 손익 계산한다. 주변에선 짠돌이라 하지만, 너만큼 마음이 편한 사람도 없다.",
    color: "#90d5ff",
    cardBg: "#006ec3",
    rarity: 11.2,
    badge: "⭐ COMMON",
    badgeColor: "#90d5ff",
    stats: { plan: 100, invest: 40, yolo: 5 },
    oneLiner: "구독 해지할 때도 손익 계산하는 타입",
    match: { best: "SNF", worst: "PNF" },
  },
  PNF: {
    emoji: "🔥",
    name: "본능적 투자자",
    title: "감으로 사고 감으로 판다",
    description:
      '주식 알림 켜놓고 출근하고, 코인 차트 보면서 잠든다. 수익도 크지만 손실도 큰 롤러코스터 인생. "인생은 한 방"이 좌우명.',
    color: "#ff7472",
    cardBg: "#8f0000",
    rarity: 18.5,
    badge: "⭐ COMMON",
    badgeColor: "#ffd4d4",
    stats: { plan: 15, invest: 95, yolo: 85 },
    oneLiner: "코인 차트 보면서 잠드는 타입",
    match: { best: "SRL", worst: "PRL" },
  },
  PNL: {
    emoji: "🎰",
    name: "반전매력 재테커",
    title: "즉흥인 줄 알았지? 투자는 진지",
    description:
      "평소엔 대충 사는 것 같은데, 투자 얘기 나오면 눈이 반짝. 겉으론 자유로워 보이지만 통장은 의외로 체계적이다.",
    color: "#ff9b4f",
    cardBg: "#9f4501",
    rarity: 4.2,
    badge: "👑 EPIC",
    badgeColor: "#ff9b4f",
    stats: { plan: 30, invest: 80, yolo: 40 },
    oneLiner: "대충 사는 것 같은데 투자 포트폴리오는 완벽",
    match: { best: "SRF", worst: "SRL" },
  },
  PRF: {
    emoji: "🦋",
    name: "자유로운 영혼",
    title: "돈은 쓰라고 있는 거 아닌가요?",
    description:
      '통장 잔고? 안 본다. 카드값? 다음 달의 나에게 맡긴다. "지금 이 순간"을 사는 철학자. 걱정은 내일의 내가 하겠지.',
    color: "#ff7fca",
    cardBg: "#ad0065",
    rarity: 24.8,
    badge: "⭐ COMMON",
    badgeColor: "#ffb7e1",
    stats: { plan: 10, invest: 15, yolo: 100 },
    oneLiner: "카드값은 다음 달의 내가 처리해줄 거야",
    match: { best: "SNL", worst: "PNF" },
  },
  PRL: {
    emoji: "🐢",
    name: "느긋한 저축러",
    title: "급할 거 없다. 천천히 모으는 중",
    description:
      '적금 하나 들어놓고 잊고 사는 타입. 투자는 무섭고, 큰 소비도 안 한다. "안전이 제일"이라는 마인드인데, 물가는 기다려주지 않는다는 게 함정.',
    color: "#7be5d9",
    cardBg: "#2f716f",
    rarity: 13.2,
    badge: "⭐ COMMON",
    badgeColor: "#a5f1e7",
    stats: { plan: 25, invest: 10, yolo: 15 },
    oneLiner: "적금 하나 넣어놓고 존재를 잊는 타입",
    match: { best: "PNF", worst: "PRF" },
  },
};

export const SUB_TAGS: Record<"E" | "I", string> = {
  E: "돈얘기좋아하는",
  I: "조용히부자되는",
};

export const RANDOM_TAGS = ["후배밥잘사는", "정산철저한", "충동구매참는", "포인트적립러"] as const;

export const COMPAT_COMMENTS: Record<string, string> = {
  "SNF-SRL": "한 명이 지르면 한 명이 막는다. 환상의 밸런스 💕",
  "PRF-SNL": "설계자가 자유로운 영혼을 만나면? 의외로 찰떡 💕",
  "PNF-SNL": "시스템 vs 감각. 투자 토론 3시간 각오해 🔥",
  "PNF-SRL": "모험가와 철벽. 서로 미치겠지만 배울 게 많아 📚",
  "PNF-PRL": "모험가와 안전주의자. 서로 배울 게 많음 📚",
  "PRF-PRF": "둘 다 자유로운 영혼? 통장도 자유롭게 비겠다 😂",
  "SRL-SRL": "철벽 × 철벽. 부자 될 건데 인생이 좀 심심할 수도 🧊",
  "PRF-SNF": "둘 다 쓰는 거 좋아하면... 통장이 울고 있다 💸",
  "PRL-SRF": "둘 다 현명한 소비. 함께 가성비 맛집 투어 가자 🍜",
  "PNL-SRF": "반전 재테커와 향유자. 의외로 통하는 조합 ✨",
};

export const LOADING_TEXTS = [
  "소비 내역 조회 중...",
  "유형 매칭 중...",
  "명세서 발급 중... 🧾",
] as const;
