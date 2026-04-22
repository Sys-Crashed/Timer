import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "计时器工具",
  description: "支持倒计时和秒表功能",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
