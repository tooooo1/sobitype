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
  const [onelineCopied, setOnelineCopied] = useState(false);
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
  }, [mainCode, subCode, fullCode, character, refCode]);

  const copyToClipboard = async (text: string, onSuccess: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess();
    } catch {
      /* noop */
    }
  };

  const handleCopyOneliner = () => {
    const text = `나의 소비 캐릭터는 "${character.name}" ${character.emoji}\n💬 ${character.oneLiner}\n\n나도 테스트하기 → ${buildShareURL(mainCode, subCode, "oneline")}`;
    copyToClipboard(text, () => {
      setOnelineCopied(true);
      trackEvent("share_oneline", { channel: "oneline", full_code: fullCode });
      setTimeout(() => setOnelineCopied(false), 2000);
    });
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
      <div className="flex items-center gap-2">
        <span className="w-16 text-xs text-white/70">{label}</span>
        <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${value}%`,
              background: `linear-gradient(to right, ${character.color}80, ${character.color})`,
            }}
          />
        </div>
        <span className="w-8 text-xs text-right text-white/70">{value}%</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 gap-6">
      {/* CHARACTER CARD */}
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 overflow-hidden"
        style={{ background: character.gradient }}
      >
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: character.badgeColor, color: "#fff" }}
        >
          {character.badge}
        </div>

        <p className="text-xs text-white/50 mb-4">내 소비 캐릭터</p>

        <div className="flex flex-col items-center text-center mb-4">
          <div className="text-6xl mb-3">{character.emoji}</div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: character.color }}>
            {character.name}
          </h2>
          <p className="text-white/60 text-sm">{character.title}</p>
        </div>

        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
            전국에서 {character.rarity}%만 이 유형
          </span>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
            #{subTag}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
            #{randomTag}
          </span>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {statBar("계획력", character.stats.plan)}
          {statBar("투자성향", character.stats.invest)}
          {statBar("YOLO", character.stats.yolo)}
        </div>

        <div className="bg-black/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-white/80 text-center">💬 &ldquo;{character.oneLiner}&rdquo;</p>
        </div>

        <p className="text-center text-xs text-white/30">📸 스크린샷 찍어서 공유해도 👍</p>
      </div>

      {/* SHARE */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          type="button"
          onClick={handleKakao}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-transform active:scale-95"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
        >
          카카오톡 공유
        </button>

        <button
          type="button"
          onClick={handleCopyOneliner}
          className="w-full py-3.5 rounded-xl bg-white/10 text-white text-sm font-semibold transition-transform active:scale-95"
        >
          {onelineCopied ? "복사 완료!" : "📋 한 줄 복사 (단톡방용)"}
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full py-3.5 rounded-xl bg-white/10 text-white text-sm font-semibold transition-transform active:scale-95"
        >
          {copied ? "복사 완료!" : "🔗 링크 복사"}
        </button>
      </div>

      {/* COMPAT — referral */}
      {refCharacter && refCode && showCompat && (
        <div
          className="w-full max-w-sm rounded-2xl p-6"
          style={{
            background: `linear-gradient(135deg, ${character.color}33, ${refCharacter.color}33)`,
          }}
        >
          <h3 className="text-center text-lg font-bold mb-5">🔮 너와 친구의 궁합</h3>

          <div className="flex items-center justify-center gap-6 mb-5">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{character.emoji}</span>
              <span className="text-xs text-white/50">나</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{refCharacter.emoji}</span>
              <span className="text-xs text-white/50">친구</span>
            </div>
          </div>

          <p className="text-sm text-white/80 text-center leading-relaxed">
            {getCompatComment(mainCode, refCode)}
          </p>

          <button
            type="button"
            onClick={handleCompatShare}
            className="mt-4 w-full py-2.5 rounded-xl bg-white/10 text-xs text-white/60 transition-transform active:scale-95"
          >
            궁합 결과 공유하기
          </button>
        </div>
      )}

      {/* COMPAT — static */}
      {!refCharacter && (
        <div className="w-full max-w-sm rounded-2xl bg-white/5 p-6">
          <div className="flex flex-col gap-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{bestMatch.emoji}</span>
              <div>
                <p className="text-xs text-white/40">💕 찰떡궁합</p>
                <p className="text-sm font-semibold">{bestMatch.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{worstMatch.emoji}</span>
              <div>
                <p className="text-xs text-white/40">💥 상극</p>
                <p className="text-sm font-semibold">{worstMatch.name}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl bg-white/10 text-xs text-white/60 transition-transform active:scale-95"
          >
            친구한테 보내서 궁합 확인하기 →
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleRestart}
        className="mt-2 mb-8 text-sm text-white/40 hover:text-white/60 transition-colors"
      >
        🔄 다시 하기
      </button>
    </div>
  );
};

export default ResultScreen;
