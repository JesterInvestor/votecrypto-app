'use client';

import { useRouter } from 'next/navigation';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { client } from '@/lib/client';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { base } from 'thirdweb/chains';

const GetStartedPage = () => {
  const account = useActiveAccount();
  const isWalletConnected = !!account;
  const router = useRouter();

  const wallets = [
    inAppWallet({
      auth: {
        options: [
          'google',
          'discord',
          'telegram',
          'farcaster',
          'email',
          'x',
          'passkey',
          'phone',
          'github',
          'twitch',
          'tiktok',
          'coinbase',
          'steam',
          'apple',
          'facebook',
          'guest',
        ],
      },
    }),
    createWallet('io.metamask'),
    createWallet('com.coinbase.wallet'),
    createWallet('me.rainbow'),
    createWallet('io.rabby'),
    createWallet('io.zerion.wallet'),
  ];

  const handleContinueToRegistration = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl sm:text-4xl">🗳️</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Get Started with VoteCrypto
            </h1>
            
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
              Connect your wallet and register to vote to start earning crypto rewards for civic engagement!
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">What you&apos;ll get:</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="text-4xl">🗳️</div>
                </div>
                <p className="text-sm text-gray-600">
                  &quot;I&apos;m interested in voting!&quot; NFT - Your first step towards earning crypto rewards for civic engagement.
                </p>
              </div>

              {!isWalletConnected ? (
                <div className="w-full">
                  <ConnectButton
                    client={client}
                    chain={base}
                    wallets={wallets}
                    connectModal={{ size: 'compact' }}
                    theme="light"
                    connectButton={{
                      label: 'Connect Wallet to Continue',
                      className: '!w-full !bg-blue-600 !text-white hover:!bg-blue-700 !border-0 !rounded-lg !px-6 !py-3 !font-semibold !transition-colors !min-h-[48px] !text-base',
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="ml-2 text-green-800 font-medium">Wallet Connected</span>
                    </div>
                    <p className="text-xs text-gray-600 break-all">
                      {account?.address}
                    </p>
                  </div>

                  <button
                    onClick={handleContinueToRegistration}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue to Register to Vote
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStartedPage;