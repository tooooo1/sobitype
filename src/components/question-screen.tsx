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
        className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300
          ${
            isSelected
              ? "border-white/60 bg-white/15 scale-[1.02]"
              : isOther
                ? "border-white/10 bg-white/5 opacity-40 scale-[0.98]"
                : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
          }`}
      >
        <div className="text-3xl mb-2">{option.emoji}</div>
        <div className="text-sm text-white/90 whitespace-pre-line">{option.text}</div>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-10">
      <p className="text-sm text-white/40 mb-6">💸 내 소비 캐릭터는?</p>

      <div className="w-full max-w-sm mb-8">
        <div className="flex gap-1.5 w-full">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={`step-${i}`}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= index ? "bg-white/80" : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-8 whitespace-pre-line leading-relaxed">
        {question.text}
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {renderCard("A")}
        {renderCard("B")}
      </div>

      {flashText && <p className="mt-6 text-sm text-white/70 animate-flash">{flashText}</p>}
    </div>
  );
};

export default QuestionScreen;
