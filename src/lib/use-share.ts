import { useState } from "react";
import { buildShareURL, trackEvent } from "@/lib/utils";
import type { Character, EIAxis, MainCode } from "@/types";

interface UseShareParams {
  mainCode: MainCode;
  subCode: EIAxis;
  character: Character;
  refCode: MainCode | null;
}

const FEEDBACK_DURATION = 2000;

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const useShare = ({ mainCode, subCode, character, refCode }: UseShareParams) => {
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fullCode = `${mainCode}${subCode}`;

  const showFeedback = (id: string) => {
    setFeedbackId(id);
    setTimeout(() => setFeedbackId(null), FEEDBACK_DURATION);
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

    copyToClipboard(shareUrl).then((ok) => {
      showFeedback(ok ? "link-copied" : "link-failed");
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
        showFeedback("save-failed");
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
            return;
          } catch {
            /* fall through to download */
          }
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "sobitype-result.png";
      link.href = url;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      trackEvent("share_image", { channel: "download", full_code: fullCode });
      showFeedback("save-success");
    } catch {
      showFeedback("save-failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(buildShareURL(mainCode, subCode, "link"));
    if (ok) {
      trackEvent("share_link", { channel: "link", full_code: fullCode });
    }
    showFeedback(ok ? "link-copied" : "link-failed");
  };

  return {
    feedbackId,
    saving,
    handleKakao,
    handleSaveImage,
    handleCopyLink,
  };
};
