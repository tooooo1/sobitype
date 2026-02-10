import { CHARACTERS, COMPAT_COMMENTS } from "@/lib/characters";
import type { CharacterStats, EIAxis, GAEventName, MainCode } from "@/types";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: Record<string, string>) => void;
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: { mobileWebUrl: string; webUrl: string };
          };
          buttons: Array<{
            title: string;
            link: { mobileWebUrl: string; webUrl: string };
          }>;
        }) => void;
      };
    };
  }
}

export const getTotalScore = (stats: CharacterStats): number => {
  return Math.round((stats.plan + stats.invest + stats.yolo) / 3);
};

export const formatDate = (): string => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

export const isMainCode = (code: string): code is MainCode => {
  return code in CHARACTERS;
};

export const isEIAxis = (code: string): code is EIAxis => {
  return code === "E" || code === "I";
};

export const deriveResult = (answers: string[]): { mainCode: MainCode; subCode: EIAxis } => {
  const mainCode = `${answers[0]}${answers[2]}${answers[3]}`;
  const subCode = answers[1];
  if (!isMainCode(mainCode) || !isEIAxis(subCode)) {
    throw new Error(`Invalid result: ${mainCode}${subCode}`);
  }

  return { mainCode, subCode };
};

export const parseRefCode = (ref: string): MainCode | null => {
  const code = ref.slice(0, 3);
  if (!isMainCode(code)) {
    return null;
  }

  return code;
};

export const getCompatComment = (a: MainCode, b: MainCode): string => {
  const key = [a, b].sort().join("-");
  return (
    COMPAT_COMMENTS[key] ??
    (a === b
      ? "완벽한 이해자. 근데 약점도 같아서 위험할 수도"
      : "서로 다른 매력. 대화가 끊이지 않을 조합")
  );
};

export const trackEvent = (name: GAEventName, params?: Record<string, string>): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[GA] ${name}`, params ?? "");
  }
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
};

export const buildShareURL = (mainCode: MainCode, subCode: EIAxis, channel: string): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}?ref=${mainCode}${subCode}&ch=${channel}`;
};
