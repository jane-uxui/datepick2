import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "데이트픽",
  description: "지역과 취향으로 데이트 코스를 추천해주는 서비스",
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
