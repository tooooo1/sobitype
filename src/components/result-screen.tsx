"use client";

import { useEffect } from "react";
import ReceiptCard from "@/components/receipt-card";
import { CHARACTERS } from "@/lib/characters";
import { useShare } from "@/lib/use-share";
import { trackEvent } from "@/lib/utils";
import type { EIAxis, MainCode } from "@/types";

interface ResultScreenProps {
  mainCode: MainCode;
  subCode: EIAxis;
  refCode: MainCode | null;
  onRestart: () => void;
}

const ResultScreen = ({ mainCode, subCode, refCode, onRestart }: ResultScreenProps) => {
  const character = CHARACTERS[mainCode];
  const fullCode = `${mainCode}${subCode}`;

  const { feedbackId, saving, handleKakao, handleSaveImage, handleCopyLink } = useShare({
    mainCode,
    subCode,
    character,
    refCode,
  });

  useEffect(() => {
    trackEvent("result_view", {
      full_code: fullCode,
      main_code: mainCode,
      character_name: character.name,
      rarity: String(character.rarity),
    });

    if (refCode) {
      trackEvent("compat_auto", { my_code: mainCode, partner_code: refCode });
    }
  }, [mainCode, fullCode, character, refCode]);

  const handleWelfareClick = () => {
    trackEvent("click_welfare", {
      full_code: fullCode,
      character_name: character.name,
    });
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4 pt-8 pb-10">
      <ReceiptCard
        character={character}
        mainCode={mainCode}
        subCode={subCode}
        refCode={refCode}
        onWelfareClick={handleWelfareClick}
      />

      {/* CTA buttons */}
      <div className="flex flex-col gap-2.5 w-full max-w-[340px] mt-8 mb-6">
        <button
          type="button"
          onClick={handleKakao}
          className="w-full py-4 rounded-xlarge font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
        >
          궁합 도전장 보내기
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          disabled={saving}
          aria-live="polite"
          className="w-full py-3.5 rounded-xlarge bg-white/10 text-white/70 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:opacity-50"
        >
          {saving
            ? "저장 중..."
            : feedbackId === "save-failed"
              ? "저장 실패 - 다시 시도"
              : "이미지로 저장하기"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          aria-live="polite"
          className="w-full py-3.5 rounded-xlarge bg-white/8 text-white/50 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {feedbackId === "link-copied"
            ? "복사 완료!"
            : feedbackId === "link-failed"
              ? "복사 실패"
              : "링크 복사"}
        </button>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="text-xs text-white/20 hover:text-white/35 transition-colors"
      >
        다시 하기
      </button>
    </main>
  );
};

export default ResultScreen;
