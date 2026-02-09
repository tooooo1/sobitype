"use client";

import { useEffect, useState } from "react";
import { CHARACTERS, SUB_TAGS } from "@/lib/characters";
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
  const subTag = SUB_TAGS[subCode];
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
      {/* HERO — 이모지 + 이름 + 타이틀 */}
      <div className="text-7xl mb-3" role="img" aria-label={character.name}>
        {character.emoji}
      </div>
      <h1 className="text-[2rem] font-bold mb-1" style={{ color: character.color }}>
        {character.name}
      </h1>
      <p className="text-white/45 mb-4">{character.title}</p>

      <div className="flex gap-2 mb-6">
        <span className="px-3 py-1 rounded-pill bg-white/8 text-sm text-white/50">#{subTag}</span>
        <span className="px-3 py-1 rounded-pill bg-white/8 text-sm text-white/50">
          #{randomTag}
        </span>
      </div>

      {/* STATS + ONE-LINER — 하나의 카드로 묶기 */}
      <div className="w-full max-w-sm rounded-xlarge bg-white/[0.06] px-6 py-5 mb-6">
        <div className="flex flex-col gap-3 mb-4">
          {statBar("계획력", character.stats.plan)}
          {statBar("투자성향", character.stats.invest)}
          {statBar("YOLO", character.stats.yolo)}
        </div>
        <p className="text-white/45 text-sm text-center leading-relaxed pt-3 border-t border-white/8">
          &ldquo;{character.oneLiner}&rdquo;
        </p>
      </div>

      {/* RARITY */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm text-white/30">전국에서</span>
        <span className="text-2xl font-bold tabular-nums" style={{ color: character.color }}>
          {character.rarity}%
        </span>
        <span
          className="px-2.5 py-0.5 rounded-pill text-xs font-bold"
          style={{ backgroundColor: character.badgeColor, color: "#1a1a1a" }}
        >
          {character.badge}
        </span>
      </div>

      {/* SHARE */}
      <div className="flex flex-col gap-2.5 w-full max-w-sm mb-6">
        <button
          type="button"
          onClick={handleKakao}
          className="w-full py-3.5 rounded-xlarge font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
        >
          카카오톡 공유
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          aria-live="polite"
          className="w-full py-3.5 rounded-xlarge bg-white/8 text-white/60 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {copied ? "복사 완료!" : "링크 복사"}
        </button>
      </div>

      {/* COMPAT — referral */}
      {refCharacter && refCode && showCompat && (
        <section
          className="w-full max-w-sm rounded-xlarge bg-white/[0.06] px-6 py-5 mb-6"
          aria-label="궁합 결과"
        >
          <h2 className="text-center font-bold mb-5">너와 친구의 궁합</h2>
          <div className="flex items-center justify-center gap-10 mb-4">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-4xl" role="img" aria-label={character.name}>
                {character.emoji}
              </span>
              <span className="text-xs text-white/40">나</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-4xl" role="img" aria-label={refCharacter.name}>
                {refCharacter.emoji}
              </span>
              <span className="text-xs text-white/40">친구</span>
            </div>
          </div>
          <p className="text-white/50 text-sm text-center leading-relaxed mb-4">
            {getCompatComment(mainCode, refCode)}
          </p>
          <button
            type="button"
            onClick={handleCompatShare}
            className="w-full py-3 rounded-large bg-white/8 text-sm text-white/50 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            궁합 결과 공유하기
          </button>
        </section>
      )}

      {/* COMPAT — static */}
      {!refCharacter && (
        <section
          className="w-full max-w-sm rounded-xlarge bg-white/[0.06] px-6 py-5 mb-6"
          aria-label="궁합 정보"
        >
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label={bestMatch.name}>
                {bestMatch.emoji}
              </span>
              <div>
                <p className="text-xs text-white/35">찰떡궁합</p>
                <p className="text-sm font-semibold text-white/80">{bestMatch.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label={worstMatch.name}>
                {worstMatch.emoji}
              </span>
              <div>
                <p className="text-xs text-white/35">상극</p>
                <p className="text-sm font-semibold text-white/80">{worstMatch.name}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-3 rounded-large bg-white/8 text-sm text-white/50 font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            친구한테 보내서 궁합 확인하기
          </button>
        </section>
      )}

      <button
        type="button"
        onClick={handleRestart}
        className="text-sm text-white/25 hover:text-white/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
      >
        다시 하기
      </button>
    </main>
  );
};

export default ResultScreen;
