import { createThirdwebClient } from "thirdweb";

// Server-side Thirdweb client using a secret key. Never import this into client components.
// Provides access to server-only features (e.g., contract reads/writes via server, if needed).

const secretKey = process.env.THIRDWEB_SECRET_KEY;

if (!secretKey) {
  // We avoid throwing here to not break builds where server key isn't configured yet.
  // Consumers should handle missing key accordingly.
  console.warn("[thirdwebServer] Missing THIRDWEB_SECRET_KEY; server-side SDK features will be unavailable.");
}

export const serverClient = createThirdwebClient(
  secretKey
    ? { secretKey }
    : // Fallback to clientId if provided; still not recommended for server ops but avoids hard crash.
      { clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id" }
);
