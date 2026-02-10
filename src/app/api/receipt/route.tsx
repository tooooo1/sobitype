import { ImageResponse } from "next/og";
import { CHARACTERS, SUB_TAGS } from "@/lib/characters";
import { formatDate, getCompatComment, getTotalScore, isEIAxis, isMainCode } from "@/lib/utils";

const FONT_BOLD_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";
const FONT_REGULAR_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Regular.otf";

const loadFonts = async (): Promise<{
  bold: ArrayBuffer;
  regular: ArrayBuffer;
} | null> => {
  try {
    const [boldRes, regularRes] = await Promise.all([
      fetch(FONT_BOLD_URL, { next: { revalidate: 86400 } }),
      fetch(FONT_REGULAR_URL, { next: { revalidate: 86400 } }),
    ]);
    if (!boldRes.ok || !regularRes.ok) {
      return null;
    }
    const [bold, regular] = await Promise.all([boldRes.arrayBuffer(), regularRes.arrayBuffer()]);
    return { bold, regular };
  } catch {
    return null;
  }
};

const W = 680;

const svgToBase64 = (svg: string): string => {
  const b64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
};

const zigzagTopSvg = (() => {
  let d = "M0,20";
  for (let x = 0; x < W; x += 20) {
    d += ` L${x + 10},0 L${x + 20},20`;
  }
  d += " Z";
  return svgToBase64(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="20" viewBox="0 0 ${W} 20"><path d="${d}" fill="#faf8f4"/></svg>`,
  );
})();

const zigzagBottomSvg = (() => {
  let d = "M0,0";
  for (let x = 0; x < W; x += 20) {
    d += ` L${x + 10},20 L${x + 20},0`;
  }
  d += " Z";
  return svgToBase64(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="20" viewBox="0 0 ${W} 20"><path d="${d}" fill="#faf8f4"/></svg>`,
  );
})();

const barcodeSvg = (() => {
  const bw = 476;
  let rects = "";
  const unit = 32;
  const count = Math.ceil(bw / unit);
  for (let i = 0; i < count; i++) {
    const base = i * unit;
    rects += `<rect x="${base}" y="0" width="4" height="72" fill="#2a2a2e"/>`;
    rects += `<rect x="${base + 8}" y="0" width="2" height="72" fill="#2a2a2e"/>`;
    rects += `<rect x="${base + 16}" y="0" width="6" height="72" fill="#2a2a2e"/>`;
    rects += `<rect x="${base + 26}" y="0" width="2" height="72" fill="#2a2a2e"/>`;
  }
  return {
    src: svgToBase64(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${bw}" height="72" viewBox="0 0 ${bw} 72">${rects}</svg>`,
    ),
    width: bw,
  };
})();

const dots = "..................................................";

const dividerStyle = {
  width: "100%" as const,
  borderTop: "2px dashed rgba(42,42,46,0.15)",
  margin: "28px 0",
};
const thickDividerStyle = {
  width: "100%" as const,
  borderTop: "4px solid rgba(42,42,46,0.2)",
  margin: "24px 0",
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const sub = searchParams.get("sub") ?? "";
  const ref = searchParams.get("ref");

  if (!isMainCode(code) || !isEIAxis(sub)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  const fontData = await loadFonts();
  const fonts = fontData
    ? [
        {
          name: "Pretendard",
          data: fontData.bold,
          weight: 700 as const,
          style: "normal" as const,
        },
        {
          name: "Pretendard",
          data: fontData.regular,
          weight: 400 as const,
          style: "normal" as const,
        },
      ]
    : [];
  const fontFamily = fontData ? "Pretendard" : "sans-serif";

  const character = CHARACTERS[code];
  const fullCode = `${code}${sub}`;
  const refCode = ref && isMainCode(ref) ? ref : null;
  const refCharacter = refCode ? CHARACTERS[refCode] : null;
  const bestMatch = CHARACTERS[character.match.best];
  const worstMatch = CHARACTERS[character.match.worst];
  const totalScore = getTotalScore(character.stats);

  const dateStr = formatDate();

  const H = refCode ? 2200 : 2100;

  const response = new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: W,
        height: H,
        backgroundColor: "#141418",
        paddingTop: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          width: W,
          height: 20,
          backgroundImage: `url("${zigzagTopSvg}")`,
          backgroundSize: `${W}px 20px`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: W,
          backgroundColor: "#faf8f4",
          padding: 48,
          fontFamily,
          color: "#2a2a2e",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#2a2a2e",
            }}
          >
            SOBITYPE 소비연구소
          </div>
          <div
            style={{
              width: "100%",
              borderTop: "4px solid rgba(42,42,46,0.2)",
              margin: "16px 0",
            }}
          />
          <div style={{ fontSize: 22, color: "rgba(42,42,46,0.5)" }}>소비 성향 명세서</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(42,42,46,0.5)",
            marginBottom: 8,
          }}
        >
          <span>날짜 {dateStr}</span>
          <span>No. #{fullCode}</span>
        </div>

        <div style={dividerStyle} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 0",
          }}
        >
          <div style={{ fontSize: 72, marginBottom: 16 }}>{character.emoji}</div>
          <div style={{ fontSize: 43, fontWeight: 700, color: "#2a2a2e" }}>{character.name}</div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(42,42,46,0.45)",
              marginTop: 8,
            }}
          >
            {`\u201C${character.title}\u201D`}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              padding: "4px 20px",
              borderRadius: 9999,
              fontSize: 20,
              fontWeight: 700,
              backgroundColor: "rgba(42,42,46,0.08)",
              color: "rgba(42,42,46,0.5)",
            }}
          >
            #{SUB_TAGS[sub]}
          </div>
        </div>

        <div style={dividerStyle} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#2a2a2e",
              marginBottom: 24,
            }}
          >
            ■ 소비 성향 분석
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "계획력", value: character.stats.plan },
              { label: "투자성향", value: character.stats.invest },
              { label: "YOLO", value: character.stats.yolo },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  fontSize: 22,
                  color: "#2a2a2e",
                }}
              >
                <span
                  style={{
                    width: 104,
                    flexShrink: 0,
                    color: "rgba(42,42,46,0.6)",
                  }}
                >
                  {label}
                </span>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: 20,
                    backgroundColor: "rgba(42,42,46,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${value}%`,
                      backgroundColor: "#2a2a2e",
                    }}
                  />
                </div>
                <span style={{ width: 56, textAlign: "right", fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={dividerStyle} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#2a2a2e",
              marginBottom: 24,
            }}
          >
            ■ 상세 진단
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(42,42,46,0.7)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {character.oneLiner}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {character.traits.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 22,
                  color: "#2a2a2e",
                }}
              >
                <span style={{ flexShrink: 0, color: "rgba(42,42,46,0.55)" }}>{label}</span>
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    color: "rgba(42,42,46,0.2)",
                    margin: "0 4px",
                  }}
                >
                  {dots}
                </span>
                <span style={{ flexShrink: 0, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={dividerStyle} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#2a2a2e",
              marginBottom: 24,
            }}
          >
            ■ 희귀도
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: "#2a2a2e",
            }}
          >
            <span style={{ color: "rgba(42,42,46,0.5)" }}>100명 중</span>
            <span style={{ fontWeight: 700 }}>{character.rarity}명</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: "#2a2a2e",
              marginTop: 8,
            }}
          >
            <span style={{ color: "rgba(42,42,46,0.5)" }}>등급</span>
            <span style={{ fontWeight: 700 }}>[{character.badge}]</span>
          </div>
        </div>

        <div style={dividerStyle} />

        {refCharacter && refCode ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px 0",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#2a2a2e",
                marginBottom: 24,
              }}
            >
              ■ 우리 궁합
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 48,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 48 }}>{character.emoji}</span>
                <span style={{ fontSize: 20, color: "rgba(42,42,46,0.4)" }}>나</span>
              </div>
              <span style={{ color: "rgba(42,42,46,0.25)", fontSize: 36 }}>{"\u00D7"}</span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 48 }}>{refCharacter.emoji}</span>
                <span style={{ fontSize: 20, color: "rgba(42,42,46,0.4)" }}>친구</span>
              </div>
            </div>
            <div
              style={{
                fontSize: 22,
                color: "rgba(42,42,46,0.55)",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {getCompatComment(code, refCode)}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px 0",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#2a2a2e",
                marginBottom: 24,
              }}
            >
              ■ 궁합
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 24,
                color: "#2a2a2e",
              }}
            >
              <span style={{ color: "rgba(42,42,46,0.5)" }}>찰떡</span>
              <span>
                {bestMatch.emoji} {bestMatch.name}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 24,
                color: "#2a2a2e",
                marginTop: 8,
              }}
            >
              <span style={{ color: "rgba(42,42,46,0.5)" }}>상극</span>
              <span>
                {worstMatch.emoji} {worstMatch.name}
              </span>
            </div>
          </div>
        )}

        <div style={thickDividerStyle} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "rgba(42,42,46,0.5)",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            합계 — 총 소비력
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                height: 24,
                backgroundColor: "rgba(42,42,46,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${totalScore}%`,
                  backgroundColor: "#2a2a2e",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#2a2a2e",
                width: 56,
                textAlign: "right",
              }}
            >
              {totalScore}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 40,
            opacity: 0.7,
          }}
        >
          <div
            style={{
              display: "flex",
              width: barcodeSvg.width,
              height: 36,
              backgroundImage: `url("${barcodeSvg.src}")`,
              backgroundSize: `${barcodeSvg.width}px 36px`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: W,
          height: 20,
          backgroundImage: `url("${zigzagBottomSvg}")`,
          backgroundSize: `${W}px 20px`,
        }}
      />
    </div>,
    {
      width: W,
      height: H,
      fonts,
    },
  );

  response.headers.set("Cache-Control", "public, max-age=86400");
  return response;
};
