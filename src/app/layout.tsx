import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "VoteCrypto - Web3 Voting Platform",
  description: "Connect your wallet, access voter tools, and earn crypto rewards for civic engagement.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThirdwebProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
