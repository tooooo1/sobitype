"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loading-screen";
import QuestionScreen from "@/components/question-screen";
import RefPreview from "@/components/ref-preview";
import ResultScreen from "@/components/result-screen";
import { CHARACTERS, QUESTIONS } from "@/lib/characters";
import { deriveResult, trackEvent } from "@/lib/utils";
import type { AppState, MainCode } from "@/types";

const LOADING_DURATION = 2100;

const SpendingTest = ({ refCode }: { refCode: MainCode | null }) => {
  const [state, setState] = useState<AppState>(() => {
    if (refCode) {
      return { phase: "ref-preview", refCode };
    }
    return { phase: "question", qi: 0, answers: [], refCode: null };
  });

  useEffect(() => {
    if (refCode) {
      trackEvent("ref_landing", { referrer_code: refCode });
    }
  }, [refCode]);

  const handleRefStart = () => {
    if (state.phase !== "ref-preview") {
      return;
    }
    setState({ phase: "question", qi: 0, answers: [], refCode: state.refCode });
  };

  const handleAnswer = (value: string) => {
    if (state.phase !== "question") {
      return;
    }

    const { qi, answers, refCode } = state;
    const nextAnswers = [...answers, value];

    if (qi < QUESTIONS.length - 1) {
      setState({ phase: "question", qi: qi + 1, answers: nextAnswers, refCode });
    } else {
      const { mainCode, subCode } = deriveResult(nextAnswers);
      setState({ phase: "loading", mainCode, subCode, refCode });

      setTimeout(() => {
        setState({ phase: "result", mainCode, subCode, refCode });
      }, LOADING_DURATION);
    }
  };

  if (state.phase === "ref-preview") {
    return <RefPreview refCharacter={CHARACTERS[state.refCode]} onStart={handleRefStart} />;
  }

  const content = (() => {
    if (state.phase === "question") {
      return (
        <QuestionScreen
          key={state.qi}
          question={QUESTIONS[state.qi]}
          index={state.qi}
          total={QUESTIONS.length}
          onAnswer={handleAnswer}
        />
      );
    }
    if (state.phase === "loading") {
      return <LoadingScreen />;
    }
    if (state.phase === "result") {
      return (
        <ResultScreen mainCode={state.mainCode} subCode={state.subCode} refCode={state.refCode} />
      );
    }
    return null;
  })();

  if (!content) {
    return null;
  }

  return <div className="min-h-screen text-white bg-background">{content}</div>;
};

export default SpendingTest;
