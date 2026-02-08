'use client'

import { useCallback, useEffect, useState } from 'react'
import LoadingScreen from '@/components/loading-screen'
import QuestionScreen from '@/components/question-screen'
import RefPreview from '@/components/ref-preview'
import ResultScreen from '@/components/result-screen'
import { CHARACTERS, QUESTIONS } from '@/lib/characters'
import { deriveResult, getRandomTag, getRefFromURL, parseRefCode, trackEvent } from '@/lib/utils'
import type { AppState, GAEventName } from '@/types'

const INIT: AppState = { phase: 'init' }

const SpendingTest = () => {
  const [state, setState] = useState<AppState>(INIT)

  useEffect(() => {
    const ref = getRefFromURL()
    if (ref) {
      const refCode = parseRefCode(ref)
      if (refCode) {
        trackEvent('ref_landing', { referrer_code: refCode })
        setState({ phase: 'ref-preview', refCode })
        return
      }
    }
    setState({ phase: 'question', qi: 0, answers: [], refCode: null })
  }, [])

  const handleRefStart = useCallback(() => {
    if (state.phase !== 'ref-preview') return
    setState({ phase: 'question', qi: 0, answers: [], refCode: state.refCode })
  }, [state])

  const handleAnswer = useCallback(
    (value: string) => {
      if (state.phase !== 'question') return

      const { qi, answers, refCode } = state
      const question = QUESTIONS[qi]
      const choice = question.a.value === value ? 'A' : 'B'

      trackEvent(`${question.id}_answer` as GAEventName, {
        question_id: question.id,
        choice,
        axis_value: value,
      })

      const nextAnswers = [...answers, value]

      if (qi < QUESTIONS.length - 1) {
        setState({ phase: 'question', qi: qi + 1, answers: nextAnswers, refCode })
      } else {
        const { mainCode, subCode } = deriveResult(nextAnswers)
        const randomTag = getRandomTag()
        setState({ phase: 'loading', mainCode, subCode, randomTag, refCode })

        setTimeout(() => {
          setState({ phase: 'result', mainCode, subCode, randomTag, refCode })
        }, 2100)
      }
    },
    [state],
  )

  // ref-preview는 전체 레이아웃이 다름 (래퍼 없이 센터 정렬)
  if (state.phase === 'ref-preview') {
    return <RefPreview refCharacter={CHARACTERS[state.refCode]} onStart={handleRefStart} />
  }

  // 공통 셸 — question, loading, result 모두 같은 배경
  const content = (() => {
    if (state.phase === 'question') {
      return (
        <QuestionScreen
          key={state.qi}
          question={QUESTIONS[state.qi]}
          index={state.qi}
          total={QUESTIONS.length}
          onAnswer={handleAnswer}
        />
      )
    }
    if (state.phase === 'loading') return <LoadingScreen />
    if (state.phase === 'result') {
      return (
        <ResultScreen
          mainCode={state.mainCode}
          subCode={state.subCode}
          randomTag={state.randomTag}
          refCode={state.refCode}
        />
      )
    }
    return null // init
  })()

  if (!content) return null

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(to bottom, #0f0f1a, #1a1025, #0f0f1a)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {content}
    </div>
  )
}

export default SpendingTest
