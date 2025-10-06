import { createThirdwebClient } from "thirdweb";

/**
 * Thirdweb Client Configuration
 * 
 * Get your client ID from: https://thirdweb.com/dashboard
 * 
 * IMPORTANT: For embedded wallets (Google, Email, etc.) to work, you MUST
 * authorize your deployment domains in the Thirdweb dashboard:
 * - Settings → API Keys → [Your Key] → Allowed Domains
 * 
 * Add domains like:
 * - localhost:3000
 * - votecrypto-app.vercel.app
 * - votecrypto.app
 * 
 * Without this, users will see "ORIGIN_UNAUTHORIZED" errors.
 * See EMBEDDED_WALLET_SETUP.md for complete setup instructions.
 */
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id";

export const client = createThirdwebClient({
  clientId: clientId,
});