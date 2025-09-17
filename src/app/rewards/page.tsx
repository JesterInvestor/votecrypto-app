'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRewards, type UserRewards } from '@/lib/rewards';

const RewardsPage = () => {
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const mockWalletAddress = "0x1234567890123456789012345678901234567890";

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewards = await getUserRewards(mockWalletAddress);
        setUserRewards(rewards);
      } catch (error) {
        console.error('Failed to fetch rewards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your rewards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Rewards</h1>
          <p className="text-xl text-gray-600">
            Track your civic engagement NFTs and token rewards
          </p>
        </div>

        {userRewards && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {userRewards.nfts.filter(nft => nft.earned).length}
              </h3>
              <p className="text-gray-600">NFTs Earned</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {userRewards.tokens}
              </h3>
              <p className="text-gray-600">Tokens Earned</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {userRewards.totalActions}
              </h3>
              <p className="text-gray-600">Civic Actions</p>
            </div>
          </div>
        )}

        {/* NFT Collection */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your NFT Collection</h2>
          
          {userRewards && userRewards.nfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRewards.nfts.map((nft) => (
                <div 
                  key={nft.id} 
                  className={`border-2 rounded-lg p-6 text-center transition-all ${
                    nft.earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-4">{nft.image}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{nft.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{nft.description}</p>
                  
                  {nft.earned ? (
                    <div className="flex items-center justify-center text-green-600">
                      <span className="text-sm font-medium">✓ Earned</span>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Not yet earned
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No NFTs Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start participating in civic activities to earn your first NFTs!
              </p>
              <button
                onClick={() => router.push('/get-started')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
          >
            Back to Voter Tools
          </button>
        </div>
      </main>
    </div>
  );
};

export default RewardsPage;