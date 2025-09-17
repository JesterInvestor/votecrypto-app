'use client';

import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
        "github",
        "twitch",
        "tiktok",
        "coinbase",
        "steam",
        "apple",
        "facebook",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const WalletConnection = () => {
  return (
    <div className="flex items-center">
      <ConnectButton
        client={client}
        connectModal={{ size: "compact" }}
        wallets={wallets}
        theme="light"
        connectButton={{
          label: "Connect Wallet",
          className: "!bg-blue-600 !text-white hover:!bg-blue-700 !border-0 !rounded-lg !px-4 !py-2 sm:!px-6 !font-semibold !transition-colors !text-sm sm:!text-base !min-h-[44px]"
        }}
      />
    </div>
  );
};

export default WalletConnection;