import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/app/globals.css";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const headingFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "CPD Manager",
    template: "%s | CPD Manager",
  },
  description: "Sistema de gestao interna do CPD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
