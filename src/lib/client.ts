import { createThirdwebClient } from "thirdweb";

// Replace with your client ID from https://thirdweb.com/dashboard
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id";

export const client = createThirdwebClient({
  clientId: clientId,
});