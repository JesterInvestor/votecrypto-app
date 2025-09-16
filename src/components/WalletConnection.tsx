'use client';

import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";

const WalletConnection = () => {
  return (
    <div className="flex items-center">
      <ConnectButton
        client={client}
        theme="light"
        connectButton={{
          label: "Connect Wallet",
          className: "!bg-blue-600 !text-white hover:!bg-blue-700 !border-0 !rounded-lg !px-6 !py-2 !font-semibold !transition-colors"
        }}
        connectModal={{
          title: "Connect to VoteCrypto",
          titleIcon: "🗳️",
          showThirdwebBranding: false,
        }}
      />
    </div>
  );
};

export default WalletConnection;