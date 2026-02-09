import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 소비 캐릭터는? | 소비 유형 테스트",
  description:
    "4문항으로 알아보는 내 소비 캐릭터. 전국에서 나 같은 유형은 몇 %? 친구와 궁합도 확인하기",
  openGraph: { type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#141418",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
