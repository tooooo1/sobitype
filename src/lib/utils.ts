import { CHARACTERS, COMPAT_COMMENTS, RANDOM_TAGS } from '@/lib/characters'
import type { EIAxis, GAEventName, MainCode } from '@/types'

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params?: Record<string, string>) => void
  }
}

// 4개 응답값 배열 → mainCode + subCode 산출
// answers[0]=SP, answers[1]=EI, answers[2]=NR, answers[3]=FL
export const deriveResult = (answers: string[]): { mainCode: MainCode; subCode: EIAxis } => {
  const mainCode = `${answers[0]}${answers[2]}${answers[3]}` as MainCode
  const subCode = answers[1] as EIAxis
  return { mainCode, subCode }
}

// URL에서 ref 쿼리 파라미터 추출
export const getRefFromURL = (): string | null => {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('ref')
}

// ref 코드 문자열 → MainCode 검증
export const parseRefCode = (ref: string): MainCode | null => {
  const code = ref.slice(0, 3) as MainCode
  return CHARACTERS[code] ? code : null
}

// 궁합 코멘트 조회 (정렬 키로 중복 제거)
export const getCompatComment = (a: MainCode, b: MainCode): string => {
  const key = [a, b].sort().join('-')
  if (COMPAT_COMMENTS[key]) return COMPAT_COMMENTS[key]
  if (a === b) return '완벽한 이해자. 근데 약점도 같아서 위험할 수도 👀'
  return '서로 다른 매력. 대화가 끊이지 않을 조합 💬'
}

// GA4 이벤트 전송
export const trackEvent = (name: GAEventName, params?: Record<string, string>): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[GA] ${name}`, params ?? '')
  }
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}

// 공유 URL 생성
export const buildShareURL = (mainCode: MainCode, subCode: EIAxis, channel: string): string => {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}?ref=${mainCode}${subCode}&ch=${channel}`
}

// 랜덤 태그
export const getRandomTag = (): string => {
  return RANDOM_TAGS[Math.floor(Math.random() * RANDOM_TAGS.length)]
}
