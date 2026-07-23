import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://project-tynx5.vercel.app";

export const metadata: Metadata = {
  title: "데이트픽",
  description: "지역과 취향으로 데이트 코스를 추천해주는 서비스",
  openGraph: {
    title: "데이트픽 | 우리 데이트, 어디 갈까요?",
    description: "지역과 취향만 고르면 오늘의 데이트 코스를 추천해드릴게요.",
    url: siteUrl,
    siteName: "데이트픽",
    images: [
      {
        url: `${siteUrl}/og/datepick-og.png`,
        width: 1200,
        height: 630,
        alt: "데이트픽 데이트 코스 추천 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "데이트픽 | 우리 데이트, 어디 갈까요?",
    description: "지역과 취향만 고르면 오늘의 데이트 코스를 추천해드릴게요.",
    images: [`${siteUrl}/og/datepick-og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff7f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}