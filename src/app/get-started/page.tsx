'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton, useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { client } from '@/lib/client';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { base } from 'thirdweb/chains';
import { getContract, sendTransaction } from 'thirdweb';
import { claimTo } from 'thirdweb/extensions/erc1155';

const GetStartedPage = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const isWalletConnected = !!account;
  const isOnBase = !!activeChain && activeChain.id === base.id;
  const router = useRouter();
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [mintError, setMintError] = useState<string>('');

  const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_MINT_CONTRACT_ADDRESS || '0xb26C41D72fe12cDdfA8547C85F4Fdf486FFB9a8b') as `0x${string}`;
  const INTERESTED_TOKEN_ID = BigInt(0); // ERC-1155 token id 0 for "interested in voting" NFT

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

  const handleClaimNFT = async () => {
    if (!isWalletConnected || !account?.address || !isOnBase) {
      return;
    }

    setIsMintingNFT(true);
    setMintError('');

    try {
      const contract = getContract({ client, chain: base, address: CONTRACT_ADDRESS });
      const transaction = claimTo({
        contract,
        to: account.address,
        tokenId: INTERESTED_TOKEN_ID,
        quantity: BigInt(1),
      });
      
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      
      setTransactionHash(transactionHash);
      setHasClaimedNFT(true);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      setMintError('Failed to claim NFT. Please try again.');
    } finally {
      setIsMintingNFT(false);
    }
  };

  const handleContinueToVoterTools = () => {
    router.push('/#voter-tools');
  };

  // Show success state after claiming NFT
  if (hasClaimedNFT) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to VoteCrypto!
          </h1>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="text-4xl mb-2">🗳️</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              NFT Claimed Successfully!
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              You&apos;ve earned the &quot;I&apos;m interested in voting!&quot; NFT
            </p>
            {transactionHash && (
              <p className="text-xs text-gray-500 break-all">
                Transaction: <a className="text-blue-600 underline" href={`https://basescan.org/tx/${transactionHash}`} target="_blank" rel="noreferrer">{transactionHash.substring(0, 20)}...</a>
              </p>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              🎯 Next Steps: Explore Voter Tools
            </h3>
            <p className="text-sm text-gray-600">
              Now that you&apos;re set up, explore our voter tools to register, request absentee ballots, find polling places, and earn more rewards!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinueToVoterTools}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Voter Tools
            </button>
            
            <button
              onClick={() => router.push('/rewards')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View My Rewards
            </button>
          </div>
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
              Connect your wallet and claim your first NFT to start earning crypto rewards for civic engagement!
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

                  {!isOnBase && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Please switch to Base network to claim your NFT
                      </p>
                    </div>
                  )}

                  {mintError && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-red-800">{mintError}</p>
                    </div>
                  )}

                  {isMintingNFT && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-yellow-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-yellow-800">Claiming your NFT...</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleClaimNFT}
                    disabled={isMintingNFT || !isOnBase}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMintingNFT ? 'Claiming NFT...' : 'Claim Your NFT'}
                  </button>

                  <button
                    onClick={handleContinueToVoterTools}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Skip & Explore Voter Tools
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