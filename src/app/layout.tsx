import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";

/**
 * IMPORTANT: Embedded Wallet Configuration
 * 
 * To enable embedded wallet sign-in (Google, Email, Discord, etc.), you MUST
 * authorize your deployment domains in the Thirdweb dashboard:
 * 
 * 1. Go to: https://thirdweb.com/dashboard
 * 2. Select your API key
 * 3. Add your domains under "Allowed Domains":
 *    - localhost:3000 (for development)
 *    - your-app.vercel.app (for Vercel)
 *    - your-custom-domain.com (for production)
 * 
 * See EMBEDDED_WALLET_SETUP.md for detailed instructions.
 */

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
