'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mintRewardNFT } from '@/lib/rewards';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { client } from '@/lib/client';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { base } from 'thirdweb/chains';

const GetStartedPage = () => {
  const account = useActiveAccount();
  const isWalletConnected = !!account;
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const router = useRouter();

  const mockWalletAddress = account?.address || "0x1234567890123456789012345678901234567890"; // Use real address when connected

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

  const handleMintNFT = async () => {
    if (!isWalletConnected) return;

    setIsMinting(true);
    try {
      // Mint the "I'm interested in voting!" NFT
      const result = await mintRewardNFT(mockWalletAddress, 'interested_in_voting');
      
      if (result.success) {
        setMintSuccess(true);
        setTransactionHash(result.transactionHash || '');
      }
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleContinueToRegistration = () => {
    router.push('/register');
  };

  if (mintSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">NFT Minted Successfully!</h1>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="text-6xl mb-4">🗳️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              &quot;I&apos;m interested in voting!&quot; NFT
            </h2>
            <p className="text-gray-600 text-sm">
              Congratulations! You&apos;ve earned your first civic engagement NFT.
            </p>
          </div>
          {transactionHash && (
            <p className="text-xs text-gray-500 mb-6 break-all">
              Transaction: {transactionHash.substring(0, 20)}...
            </p>
          )}
          <button
            onClick={handleContinueToRegistration}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Register to Vote
          </button>
        </div>
      </div>
    );
  }

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
              Mint your first NFT to show you&apos;re interested in voting and start your civic engagement journey!
            </p>

            {!isWalletConnected ? (
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-green-600 text-xl">✓</span>
                    <span className="ml-2 text-green-800 font-medium">Wallet Connected</span>
                  </div>
                  <p className="text-xs text-gray-600 break-all">
                    {mockWalletAddress}
                  </p>
                </div>

                <button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMinting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Minting NFT...
                    </span>
                  ) : (
                    'Mint "I\'m interested in voting!" NFT'
                  )}
                </button>

                {isMinting && (
                  <p className="text-sm text-gray-500">
                    Please wait while we mint your NFT on the blockchain...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStartedPage;