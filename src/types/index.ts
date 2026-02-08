// 소비 캐릭터 코드: 3글자 (SP축 × NR축 × FL축 = 8가지)
export type MainCode = 'SNF' | 'SNL' | 'SRF' | 'SRL' | 'PNF' | 'PNL' | 'PRF' | 'PRL'

// E/I 서브 변형 (개방성 축)
export type EIAxis = 'E' | 'I'

// 질문 선택지
export interface ChoiceOption {
  readonly text: string
  readonly emoji: string
  readonly value: string
}

// 질문
export interface Question {
  readonly id: string
  readonly axis: string
  readonly text: string
  readonly a: ChoiceOption
  readonly b: ChoiceOption
  readonly ratio: { readonly A: number; readonly B: number }
}

// 캐릭터 능력치
export interface CharacterStats {
  readonly plan: number
  readonly invest: number
  readonly yolo: number
}

// 캐릭터
export interface Character {
  readonly emoji: string
  readonly name: string
  readonly title: string
  readonly color: string
  readonly gradient: string
  readonly rarity: number
  readonly badge: string
  readonly badgeColor: string
  readonly description: string
  readonly stats: CharacterStats
  readonly oneLiner: string
  readonly match: { readonly best: MainCode; readonly worst: MainCode }
}

// GA4 이벤트 이름
export type GAEventName =
  | 'q1_answer'
  | 'q2_answer'
  | 'q3_answer'
  | 'q4_answer'
  | 'result_view'
  | 'share_image_save'
  | 'share_kakao'
  | 'share_oneline'
  | 'share_link'
  | 'compat_auto'
  | 'compat_share'
  | 'ref_landing'
  | 'view_tips'
  | 'click_donation'
  | 'restart'

// 앱 상태 — 판별 유니온 (불법 상태 불가)
export type AppState =
  | { phase: 'init' }
  | { phase: 'ref-preview'; refCode: MainCode }
  | { phase: 'question'; qi: number; answers: string[]; refCode: MainCode | null }
  | {
      phase: 'loading'
      mainCode: MainCode
      subCode: EIAxis
      randomTag: string
      refCode: MainCode | null
    }
  | {
      phase: 'result'
      mainCode: MainCode
      subCode: EIAxis
      randomTag: string
      refCode: MainCode | null
    }
