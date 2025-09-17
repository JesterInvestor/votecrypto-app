import WalletConnection from '@/components/WalletConnection';
import VoterTools from '@/components/VoterTools';
import Hero from '@/components/Hero';
import VoteAmericaDemo from '@/components/VoteAmericaDemo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">VoteCrypto</h1>
              <span className="ml-2 text-xs sm:text-sm text-gray-500">.app</span>
            </div>
            <WalletConnection />
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <VoterTools />
        
        {/* VoteAmerica+ API Demo Section */}
        <section className="px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <VoteAmericaDemo />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">VoteCrypto</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Empowering civic engagement through Web3 technology and crypto incentives.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li>Wallet-based Authentication</li>
                <li>Voter Registration Tools</li>
                <li>Absentee Ballot Services</li>
                <li>Crypto Rewards & NFTs</li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Powered By</h4>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li>Next.js Framework</li>
                <li>Thirdweb Web3 SDK</li>
                <li>Vote.org API</li>
                <li>VoteAmerica+ Civic Data API</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>&copy; 2024 VoteCrypto. Building the future of civic engagement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
