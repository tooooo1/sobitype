import { useState } from "react";
import { buildShareURL, trackEvent } from "@/lib/utils";
import type { Character, EIAxis, MainCode } from "@/types";

interface UseShareParams {
  mainCode: MainCode;
  subCode: EIAxis;
  character: Character;
  refCode: MainCode | null;
}

const copyToClipboard = async (text: string, onSuccess: () => void) => {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess();
  } catch {
    /* noop */
  }
};

export const useShare = ({ mainCode, subCode, character, refCode }: UseShareParams) => {
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
            title: "궁합 도전장이 왔어!",
            description: `${character.emoji} ${character.name} — 나랑 소비 궁합 확인해볼래?`,
            imageUrl: `${window.location.origin}/api/og?code=${mainCode}`,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: "궁합 확인하러 가기",
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
          title: "궁합 도전장이 왔어!",
          text: `${character.emoji} ${character.name} — 나랑 소비 궁합 확인해볼래?`,
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
    if (saving) {
      return;
    }

    setSaving(true);
    try {
      const params = new URLSearchParams({ code: mainCode, sub: subCode });
      if (refCode) {
        params.set("ref", refCode);
      }
      const res = await fetch(`/api/receipt?${params}`);
      if (!res.ok) {
        return;
      }
      const blob = await res.blob();

      const canShareFiles =
        typeof navigator.share === "function" && typeof navigator.canShare === "function";

      if (canShareFiles) {
        const file = new File([blob], "sobitype-result.png", {
          type: "image/png",
        });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file] });
            trackEvent("share_image", {
              channel: "share_api",
              full_code: fullCode,
            });
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
    const text = `${character.emoji} ${character.name} — 나랑 소비 궁합 확인해볼래? 👉 ${url}`;
    copyToClipboard(text, () => {
      setCopiedId("oneline");
      trackEvent("share_oneline", { channel: "oneline", full_code: fullCode });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleGroupCopy = () => {
    const url = buildShareURL(mainCode, subCode, "group");
    const text = `${character.emoji} 나 ${character.name} 나왔다ㅋㅋ 너희는 뭐 나오는지 해봐! 👉 ${url}`;
    copyToClipboard(text, () => {
      setCopiedId("group");
      trackEvent("share_group", { channel: "group", full_code: fullCode });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return {
    copiedId,
    saving,
    handleKakao,
    handleSaveImage,
    handleCopyLink,
    handleCopyOneline,
    handleGroupCopy,
  };
};
