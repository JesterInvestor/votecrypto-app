'use client';

import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/get-started');
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Vote with <span className="text-blue-600">Crypto</span>,
            <br />
            Earn <span className="text-purple-600">Rewards</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect your wallet, access voter tools, and earn NFTs and tokens for civic engagement. 
            Making democracy more accessible through Web3 technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Wallet Auth</h3>
            <p className="text-gray-600">Connect with your crypto wallet for secure, decentralized authentication</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗳️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Voter Tools</h3>
            <p className="text-gray-600">Access registration, absentee ballots, and other voting services</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Crypto Rewards</h3>
            <p className="text-gray-600">Earn NFTs and tokens for participating in civic engagement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;