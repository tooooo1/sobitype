import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

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
  themeColor: "#06060f",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body
        className={`${notoSansKR.variable} antialiased`}
        style={{
          fontFamily: "Pretendard, var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
