import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "编码解码工具",
  description: "支持 Base64、URL、Unicode、HTML 等多种编码解码",
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
