import { ImageResponse } from "next/og";
import { CHARACTERS } from "@/lib/characters";
import { isMainCode } from "@/lib/utils";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";

const loadFont = async (): Promise<ArrayBuffer | null> => {
  try {
    const res = await fetch(FONT_URL, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return null;
    }
    return res.arrayBuffer();
  } catch {
    return null;
  }
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const fontData = await loadFont();
  const fonts = fontData
    ? [{ name: "Pretendard", data: fontData, weight: 700 as const, style: "normal" as const }]
    : [];
  const fontFamily = fontData ? "Pretendard" : "sans-serif";

  if (!isMainCode(code)) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#141418",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 150, marginBottom: 20 }}>💰</div>
        <div
          style={{
            fontSize: 52,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.2em",
            fontWeight: 700,
          }}
        >
          SOBITYPE
        </div>
        {fontData && (
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
            내 소비 캐릭터는?
          </div>
        )}
      </div>,
      { width: 1200, height: 630, fonts },
    );
  }

  const character = CHARACTERS[code];

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: character.cardBg,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 180 }}>{character.emoji}</div>
      {fontData ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              color: "white",
              fontWeight: 700,
              marginTop: 20,
            }}
          >
            {character.name}
          </div>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255,255,255,0.65)",
              marginTop: 12,
            }}
          >
            {character.title}
          </div>
        </div>
      ) : null}
      <div
        style={{
          fontSize: 22,
          color: "rgba(255,255,255,0.3)",
          marginTop: 32,
          letterSpacing: "0.2em",
        }}
      >
        SOBITYPE
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
};
