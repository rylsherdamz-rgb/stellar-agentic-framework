import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stellar Agentic Framework — Build Stellar dApps with AI Agents",
  description:
    "An eval-driven, multi-agent coding harness for building production Stellar dApps. Scaffold contracts, frontends, backends, and x402 payments — all from a single command.",
  keywords: [
    "stellar", "soroban", "smart contracts", "dapp", "ai agents",
    "claude code", "x402", "stellar wallets kit", "blockchain",
  ],
  openGraph: {
    title: "Stellar Agentic Framework",
    description: "Build Stellar dApps with AI agents that write, verify, and deploy code.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
