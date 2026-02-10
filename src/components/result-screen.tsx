"use client";

import { useEffect, useState } from "react";
import ReceiptCard from "@/components/receipt-card";
import { CHARACTERS } from "@/lib/characters";
import { useShare } from "@/lib/use-share";
import { trackEvent } from "@/lib/utils";
import type { EIAxis, MainCode } from "@/types";

interface ResultScreenProps {
  mainCode: MainCode;
  subCode: EIAxis;
  refCode: MainCode | null;
}

const ResultScreen = ({ mainCode, subCode, refCode }: ResultScreenProps) => {
  const [showCompat, setShowCompat] = useState(false);
  const character = CHARACTERS[mainCode];
  const fullCode = `${mainCode}${subCode}`;

  const {
    copiedId,
    saving,
    handleKakao,
    handleSaveImage,
    handleCopyLink,
    handleCopyOneline,
    handleCompatShare,
  } = useShare({ mainCode, subCode, character, refCode });

  useEffect(() => {
    trackEvent("result_view", {
      full_code: fullCode,
      main_code: mainCode,
      character_name: character.name,
      rarity: String(character.rarity),
    });

    if (refCode) {
      const timer = setTimeout(() => {
        setShowCompat(true);
        trackEvent("compat_auto", { my_code: mainCode, partner_code: refCode });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mainCode, fullCode, character, refCode]);

  const handleWelfareClick = () => {
    trackEvent("click_welfare", {
      full_code: fullCode,
      character_name: character.name,
    });
  };

  const handleRestart = () => {
    trackEvent("restart");
    window.location.href = window.location.origin;
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4 pt-8 pb-10">
      <ReceiptCard
        character={character}
        mainCode={mainCode}
        subCode={subCode}
        refCode={refCode}
        showCompat={showCompat}
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
          카카오톡으로 공유하기
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          disabled={saving}
          className="w-full py-3.5 rounded-xlarge bg-white/10 text-white/70 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:opacity-50"
        >
          {saving ? "저장 중..." : "이미지로 저장하기"}
        </button>
        <button
          type="button"
          onClick={handleCopyOneline}
          aria-live="polite"
          className="w-full py-3.5 rounded-xlarge bg-white/10 text-white/60 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {copiedId === "oneline" ? "복사 완료!" : "한 줄 복사"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          aria-live="polite"
          className="w-full py-3.5 rounded-xlarge bg-white/8 text-white/50 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {copiedId === "link" ? "복사 완료!" : "링크 복사"}
        </button>
        {refCode && showCompat && (
          <button
            type="button"
            onClick={handleCompatShare}
            className="w-full py-3 rounded-xlarge bg-white/8 text-sm text-white/40 font-semibold transition-transform active:scale-[0.97]"
          >
            궁합 결과 공유하기
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleRestart}
        className="text-xs text-white/20 hover:text-white/35 transition-colors"
      >
        다시 하기
      </button>
    </main>
  );
};

export default ResultScreen;
