"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/utils";
import type { Question } from "@/types";

interface QuestionScreenProps {
  question: Question;
  index: number;
  total: number;
  onAnswer: (value: string) => void;
}

const QuestionScreen = ({ question, index, total, onAnswer }: QuestionScreenProps) => {
  const [selected, setSelected] = useState<"A" | "B" | null>(null);
  const [flashText, setFlashText] = useState("");

  const handleSelect = (choice: "A" | "B") => {
    if (selected) {
      return;
    }
    setSelected(choice);

    const pct = question.ratio[choice];
    const otherPct = question.ratio[choice === "A" ? "B" : "A"];
    setFlashText(pct >= otherPct ? `🔥 ${pct}%가 같은 선택!` : `💎 ${pct}%만 이걸 골랐어`);

    const option = choice === "A" ? question.a : question.b;
    trackEvent(`${question.id}_answer`, {
      question_id: question.id,
      choice,
      axis_value: option.value,
    });

    setTimeout(() => onAnswer(option.value), 900);
  };

  const renderCard = (choice: "A" | "B") => {
    const option = choice === "A" ? question.a : question.b;
    const isSelected = selected === choice;
    const isOther = selected !== null && selected !== choice;

    return (
      <button
        type="button"
        key={choice}
        onClick={() => handleSelect(choice)}
        disabled={selected !== null}
        className={`w-full p-7 rounded-xxlarge text-left motion-safe:transition-all motion-safe:duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60
          ${
            isSelected
              ? "bg-white/15 scale-[1.02] ring-2 ring-white/60"
              : isOther
                ? "bg-white/[0.03] opacity-30 scale-[0.97]"
                : "bg-white/[0.07] hover:bg-white/12"
          }`}
      >
        <div className="text-4xl mb-3">{option.emoji}</div>
        <div className="text-base font-semibold text-white/90 whitespace-pre-line">
          {option.text}
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-12">
      <p className="text-sm text-white/50 mb-6">💸 내 소비 캐릭터는?</p>

      <div
        className="w-full max-w-sm mb-8"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`${total}문항 중 ${index + 1}번째`}
      >
        <div className="flex gap-1.5 w-full">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={`step-${i}`}
              className={`h-2 flex-1 rounded-pill motion-safe:transition-all motion-safe:duration-300 ${
                i <= index ? "bg-white/70" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-10 whitespace-pre-line leading-relaxed">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3.5 w-full max-w-sm">
        {renderCard("A")}
        {renderCard("B")}
      </div>

      {flashText && (
        <p className="mt-8 px-5 py-2.5 rounded-pill bg-white/10 text-sm font-semibold text-white/80 animate-flash">
          {flashText}
        </p>
      )}
    </div>
  );
};

export default QuestionScreen;
