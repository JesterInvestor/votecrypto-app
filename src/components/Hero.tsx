'use client';

import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/get-started');
  };

  const handleLearnMore = () => {
    router.push('/learn-more');
  };

  return (
    <section className="px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Vote with <span style={{ color: 'var(--brand-blue)' }}>Crypto</span>,
            <br />
            Earn <span style={{ color: 'var(--brand-red)' }}>Rewards</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            Connect your wallet, access voter tools, and earn NFTs and tokens for civic engagement. 
            Making democracy more accessible through Web3 technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <button 
              onClick={handleGetStarted}
              className="text-white px-6 sm:px-8 py-3 sm:py-3 rounded-lg font-semibold transition-colors min-h-[48px] text-base"
              style={{ backgroundColor: 'var(--brand-blue)' }}
            >
              Get Started
            </button>
            <button onClick={handleLearnMore} className="px-6 sm:px-8 py-3 sm:py-3 rounded-lg font-semibold transition-colors min-h-[48px] text-base border" style={{ borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' }}>
              Learn More
            </button>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl sm:text-3xl">🔐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Wallet Auth</h3>
            <p className="text-gray-600 text-sm sm:text-base">Connect with your crypto wallet for secure, decentralized authentication</p>
          </div>
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl sm:text-3xl">🗳️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Voter Tools</h3>
            <p className="text-gray-600 text-sm sm:text-base">Access registration, absentee ballots, and other voting services</p>
          </div>
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl sm:text-3xl">🎁</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Crypto Rewards</h3>
            <p className="text-gray-600 text-sm sm:text-base">Earn NFTs and tokens for participating in civic engagement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;