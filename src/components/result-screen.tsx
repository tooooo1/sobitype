"use client";

import { useEffect, useState } from "react";
import { CHARACTERS } from "@/lib/characters";
import { buildShareURL, getCompatComment, trackEvent } from "@/lib/utils";
import type { EIAxis, MainCode } from "@/types";

interface ResultScreenProps {
  mainCode: MainCode;
  subCode: EIAxis;
  randomTag: string;
  refCode: MainCode | null;
}

const ResultScreen = ({ mainCode, subCode, randomTag, refCode }: ResultScreenProps) => {
  const [copied, setCopied] = useState(false);
  const [showCompat, setShowCompat] = useState(false);

  const character = CHARACTERS[mainCode];
  const fullCode = `${mainCode}${subCode}`;
  const bestMatch = CHARACTERS[character.match.best];
  const worstMatch = CHARACTERS[character.match.worst];
  const refCharacter = refCode ? CHARACTERS[refCode] : null;

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

  const copyToClipboard = async (text: string, onSuccess: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess();
    } catch {
      /* noop */
    }
  };

  const handleCopyLink = () => {
    copyToClipboard(buildShareURL(mainCode, subCode, "link"), () => {
      setCopied(true);
      trackEvent("share_link", { channel: "link", full_code: fullCode });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleKakao = () => {
    trackEvent("share_kakao", { channel: "kakao", full_code: fullCode });
    alert("카카오톡 공유 기능은 곧 추가됩니다!");
  };

  const handleRestart = () => {
    trackEvent("restart");
    window.location.href = window.location.origin;
  };

  const handleCompatShare = () => {
    if (!refCode) {
      return;
    }
    copyToClipboard(buildShareURL(mainCode, subCode, "compat"), () => {
      trackEvent("compat_share", { my_code: mainCode, partner_code: refCode });
    });
  };

  const statBar = (label: string, value: number) => {
    return (
      <div className="flex items-center gap-3">
        <span className="w-16 text-sm text-white/40">{label}</span>
        <div className="flex-1 h-1.5 rounded-pill bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-pill motion-safe:transition-all motion-safe:duration-1000 ease-out"
            style={{ width: `${value}%`, backgroundColor: character.color }}
          />
        </div>
        <span
          className="w-8 text-sm text-right font-bold tabular-nums"
          style={{ color: character.color }}
        >
          {value}
        </span>
      </div>
    );
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-6 pt-12 pb-10">
      {/* IDENTITY — 스크린샷 영역 */}
      <div className="text-8xl mb-2" role="img" aria-label={character.name}>
        {character.emoji}
      </div>
      <h1 className="text-[2.25rem] font-bold" style={{ color: character.color }}>
        {character.name}
      </h1>
      <p className="text-white/50 text-center leading-relaxed mt-2 max-w-[280px]">
        {character.oneLiner}
      </p>

      {/* RARITY — 히어로 스탯 */}
      <div className="flex flex-col items-center mt-8 mb-8">
        <span className="text-xs text-white/30 mb-1">전국에서</span>
        <div className="flex items-baseline gap-1">
          <span
            className="text-[3rem] font-bold leading-none tabular-nums"
            style={{ color: character.color }}
          >
            {character.rarity}
          </span>
          <span className="text-xl font-bold" style={{ color: character.color }}>
            %
          </span>
        </div>
        <span
          className="mt-2 px-3 py-0.5 rounded-pill text-xs font-bold"
          style={{ backgroundColor: character.badgeColor, color: "#1a1a1a" }}
        >
          {character.badge}
        </span>
      </div>

      {/* STATS */}
      <div className="w-full max-w-sm flex flex-col gap-3 mb-8">
        {statBar("계획력", character.stats.plan)}
        {statBar("투자성향", character.stats.invest)}
        {statBar("YOLO", character.stats.yolo)}
      </div>

      {/* COMPAT — referral */}
      {refCharacter && refCode && showCompat && (
        <section className="w-full max-w-sm mb-6" aria-label="궁합 결과">
          <div className="w-10 mx-auto border-t border-white/8 mb-6" />
          <div className="flex items-center justify-center gap-8 mb-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{character.emoji}</span>
              <span className="text-xs text-white/30">나</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{refCharacter.emoji}</span>
              <span className="text-xs text-white/30">친구</span>
            </div>
          </div>
          <p className="text-white/45 text-sm text-center leading-relaxed mb-4">
            {getCompatComment(mainCode, refCode)}
          </p>
        </section>
      )}

      {/* COMPAT — static */}
      {!refCharacter && (
        <section className="w-full max-w-sm mb-6" aria-label="궁합 정보">
          <div className="w-10 mx-auto border-t border-white/8 mb-6" />
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{bestMatch.emoji}</span>
              <div>
                <p className="text-[10px] text-white/30">찰떡궁합</p>
                <p className="text-sm font-semibold text-white/60">{bestMatch.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{worstMatch.emoji}</span>
              <div>
                <p className="text-[10px] text-white/30">상극</p>
                <p className="text-sm font-semibold text-white/60">{worstMatch.name}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA — 하단 버튼 모음 */}
      <div className="flex flex-col gap-2.5 w-full max-w-sm mb-6">
        <button
          type="button"
          onClick={handleKakao}
          className="w-full py-4 rounded-xlarge font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
        >
          카카오톡으로 자랑하기
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          aria-live="polite"
          className="w-full py-3.5 rounded-xlarge bg-white/8 text-white/50 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {copied ? "복사 완료!" : "링크 복사"}
        </button>
        {refCharacter && refCode && showCompat && (
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
