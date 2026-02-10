"use client";

import { useEffect, useRef, useState } from "react";
import { CHARACTERS } from "@/lib/characters";
import { buildShareURL, getCompatComment, trackEvent } from "@/lib/utils";
import type { EIAxis, MainCode } from "@/types";

interface ResultScreenProps {
  mainCode: MainCode;
  subCode: EIAxis;
  randomTag: string;
  refCode: MainCode | null;
}

const ResultScreen = ({ mainCode, subCode, randomTag: _randomTag, refCode }: ResultScreenProps) => {
  const [copied, setCopied] = useState(false);
  const [showCompat, setShowCompat] = useState(false);
  const [saving, setSaving] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const character = CHARACTERS[mainCode];
  const fullCode = `${mainCode}${subCode}`;
  const bestMatch = CHARACTERS[character.match.best];
  const worstMatch = CHARACTERS[character.match.worst];
  const refCharacter = refCode ? CHARACTERS[refCode] : null;

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  const totalScore = Math.round(
    (character.stats.plan + character.stats.invest + character.stats.yolo) / 3,
  );

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

  const handleKakao = () => {
    trackEvent("share_kakao", { channel: "kakao", full_code: fullCode });
    const shareUrl = buildShareURL(mainCode, subCode, "kakao");

    if (typeof window !== "undefined" && window.Kakao?.Share) {
      if (!window.Kakao.isInitialized()) {
        const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
        if (key) {
          window.Kakao.init(key);
        }
      }

      if (window.Kakao.isInitialized()) {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `${character.emoji} ${character.name}`,
            description: `${character.title} — 너는 어떤 소비 캐릭터야?`,
            imageUrl: `${window.location.origin}/api/og?code=${mainCode}`,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: "나도 테스트하기",
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        return;
      }
    }

    // Fallback: Web Share API
    if (typeof navigator.share === "function") {
      navigator
        .share({
          title: `${character.emoji} ${character.name}`,
          text: `${character.title} — 너는 어떤 소비 캐릭터야?`,
          url: shareUrl,
        })
        .catch(() => {
          /* user cancelled */
        });
      return;
    }

    // Final fallback: clipboard
    copyToClipboard(shareUrl, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveImage = async () => {
    if (!receiptRef.current || saving) {
      return;
    }

    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#141418",
        scale: 2,
      });

      const canShareFiles =
        typeof navigator.share === "function" && typeof navigator.canShare === "function";

      if (canShareFiles) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        if (blob) {
          const file = new File([blob], "sobitype-result.png", { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
            trackEvent("share_image", { channel: "share_api", full_code: fullCode });
            return;
          }
        }
      }

      // Fallback: download
      const link = document.createElement("a");
      link.download = "sobitype-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      trackEvent("share_image", { channel: "download", full_code: fullCode });
    } catch {
      /* noop */
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    copyToClipboard(buildShareURL(mainCode, subCode, "link"), () => {
      setCopied(true);
      trackEvent("share_link", { channel: "link", full_code: fullCode });
      setTimeout(() => setCopied(false), 2000);
    });
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

  const StatBar = ({ value }: { value: number }) => (
    <div className="flex-1 h-[10px] bg-[#2a2a2e]/10 overflow-hidden">
      <div className="h-full bg-[#2a2a2e]" style={{ width: `${value}%` }} />
    </div>
  );

  return (
    <main className="flex flex-col items-center min-h-screen px-4 pt-8 pb-10">
      {/* Receipt card */}
      <div ref={receiptRef} className="w-full max-w-[340px] animate-receipt-print">
        {/* Top zigzag edge */}
        <div className="receipt-edge-top w-full h-[10px]" />

        {/* Receipt body */}
        <div className="receipt-body px-6 py-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-[13px] font-bold tracking-[0.2em] text-[#2a2a2e]">
              SOBITYPE 소비연구소
            </h2>
            <div className="receipt-divider-thick my-2" />
            <p className="text-[11px] text-[#2a2a2e]/50">소비 성향 명세서</p>
          </div>

          {/* Meta info */}
          <div className="flex justify-between text-[11px] text-[#2a2a2e]/50 mb-1">
            <span>
              날짜 <span className="font-mono ml-1">{dateStr}</span>
            </span>
            <span>
              No. <span className="font-mono ml-1">#{fullCode}</span>
            </span>
          </div>

          <div className="receipt-divider" />

          {/* Character identity */}
          <div className="text-center py-2">
            <div className="text-4xl mb-2" role="img" aria-label={character.name}>
              {character.emoji}
            </div>
            <h1 className="text-[1.35rem] font-bold text-[#2a2a2e]">{character.name}</h1>
            <p className="text-[12px] text-[#2a2a2e]/45 mt-1">&ldquo;{character.title}&rdquo;</p>
          </div>

          <div className="receipt-divider" />

          {/* Stats */}
          <div className="py-1">
            <h3 className="text-[12px] font-bold text-[#2a2a2e] mb-3">■ 소비 성향 분석</h3>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "계획력", value: character.stats.plan },
                { label: "투자성향", value: character.stats.invest },
                { label: "YOLO", value: character.stats.yolo },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2 text-[11px] text-[#2a2a2e]">
                  <span className="w-[52px] shrink-0 text-[#2a2a2e]/60">{label}</span>
                  <StatBar value={value} />
                  <span className="font-mono w-[28px] text-right font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Detail */}
          <div className="py-1">
            <h3 className="text-[12px] font-bold text-[#2a2a2e] mb-3">■ 상세 진단</h3>
            <p className="text-[12px] text-[#2a2a2e]/70 leading-relaxed mb-3">
              {character.oneLiner}
            </p>
            <div className="flex flex-col gap-1.5">
              {character.traits.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-baseline text-[11px] font-mono text-[#2a2a2e]"
                >
                  <span className="shrink-0 text-[#2a2a2e]/55">{label}</span>
                  <span
                    className="flex-1 overflow-hidden whitespace-nowrap text-[#2a2a2e]/20 mx-0.5"
                    aria-hidden="true"
                  >
                    {".................................................."}
                  </span>
                  <span className="shrink-0 font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Rarity */}
          <div className="py-1">
            <h3 className="text-[12px] font-bold text-[#2a2a2e] mb-3">■ 희귀도</h3>
            <div className="flex justify-between text-[12px] text-[#2a2a2e]">
              <span className="text-[#2a2a2e]/50">100명 중</span>
              <span className="font-mono font-bold">{character.rarity}명</span>
            </div>
            <div className="flex justify-between text-[12px] text-[#2a2a2e] mt-1">
              <span className="text-[#2a2a2e]/50">등급</span>
              <span className="font-mono font-bold">[{character.badge}]</span>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Compat */}
          {refCharacter && refCode && showCompat ? (
            <div className="py-1">
              <h3 className="text-[12px] font-bold text-[#2a2a2e] mb-3">■ 우리 궁합</h3>
              <div className="flex items-center justify-center gap-6 mb-3">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl">{character.emoji}</span>
                  <span className="text-[10px] text-[#2a2a2e]/40">나</span>
                </div>
                <span className="text-[#2a2a2e]/25 text-lg">&times;</span>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl">{refCharacter.emoji}</span>
                  <span className="text-[10px] text-[#2a2a2e]/40">친구</span>
                </div>
              </div>
              <p className="text-[11px] text-[#2a2a2e]/55 text-center leading-relaxed">
                {getCompatComment(mainCode, refCode)}
              </p>
            </div>
          ) : (
            <div className="py-1">
              <h3 className="text-[12px] font-bold text-[#2a2a2e] mb-3">■ 궁합</h3>
              <div className="flex justify-between text-[12px] text-[#2a2a2e]">
                <span className="text-[#2a2a2e]/50">찰떡</span>
                <span>
                  {bestMatch.emoji} {bestMatch.name}
                </span>
              </div>
              <div className="flex justify-between text-[12px] text-[#2a2a2e] mt-1">
                <span className="text-[#2a2a2e]/50">상극</span>
                <span>
                  {worstMatch.emoji} {worstMatch.name}
                </span>
              </div>
            </div>
          )}

          {/* Total separator */}
          <div className="receipt-divider-thick my-3" />

          {/* Total */}
          <div className="py-1">
            <p className="text-[11px] text-[#2a2a2e]/50 mb-2 text-center">합계 — 당신의 소비력</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[12px] bg-[#2a2a2e]/10 overflow-hidden">
                <div className="h-full bg-[#2a2a2e]" style={{ width: `${totalScore}%` }} />
              </div>
              <span className="font-mono text-[15px] font-bold text-[#2a2a2e] w-[28px] text-right">
                {totalScore}
              </span>
            </div>
          </div>

          {/* Barcode */}
          <div className="receipt-barcode mt-5 mx-auto" />
        </div>

        {/* Bottom zigzag edge */}
        <div className="receipt-edge-bottom w-full h-[10px]" />
      </div>

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
