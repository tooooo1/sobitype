import type { RefObject } from "react";
import { useState } from "react";
import { buildShareURL, trackEvent } from "@/lib/utils";
import type { Character, EIAxis, MainCode } from "@/types";

interface UseShareParams {
  mainCode: MainCode;
  subCode: EIAxis;
  character: Character;
  refCode: MainCode | null;
  receiptRef: RefObject<HTMLDivElement | null>;
}

const copyToClipboard = async (text: string, onSuccess: () => void) => {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess();
  } catch {
    /* noop */
  }
};

export const useShare = ({ mainCode, subCode, character, refCode, receiptRef }: UseShareParams) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fullCode = `${mainCode}${subCode}`;

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
      setCopiedId("link");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSaveImage = async () => {
    if (!receiptRef.current || saving) {
      return;
    }

    setSaving(true);
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(receiptRef.current, {
        backgroundColor: "#141418",
        pixelRatio: 2,
      });
      if (!blob) {
        return;
      }

      const canShareFiles =
        typeof navigator.share === "function" && typeof navigator.canShare === "function";

      if (canShareFiles) {
        const file = new File([blob], "sobitype-result.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file] });
            trackEvent("share_image", { channel: "share_api", full_code: fullCode });
          } catch {
            /* user cancelled share */
          }
          return;
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "sobitype-result.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      trackEvent("share_image", { channel: "download", full_code: fullCode });
    } catch {
      /* noop */
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    copyToClipboard(buildShareURL(mainCode, subCode, "link"), () => {
      setCopiedId("link");
      trackEvent("share_link", { channel: "link", full_code: fullCode });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCopyOneline = () => {
    const url = buildShareURL(mainCode, subCode, "oneline");
    const text = `${character.emoji} ${character.name} (전국 ${character.rarity}%) — ${character.oneLiner} 👉 ${url}`;
    copyToClipboard(text, () => {
      setCopiedId("oneline");
      trackEvent("share_oneline", { channel: "oneline", full_code: fullCode });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCompatShare = () => {
    if (!refCode) {
      return;
    }
    copyToClipboard(buildShareURL(mainCode, subCode, "compat"), () => {
      trackEvent("compat_share", { my_code: mainCode, partner_code: refCode });
    });
  };

  return {
    copiedId,
    saving,
    handleKakao,
    handleSaveImage,
    handleCopyLink,
    handleCopyOneline,
    handleCompatShare,
  };
};
