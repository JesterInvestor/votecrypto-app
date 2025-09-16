import WalletConnection from '@/components/WalletConnection';
import VoterTools from '@/components/VoterTools';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">VoteCrypto</h1>
              <span className="ml-2 text-sm text-gray-500">.app</span>
            </div>
            <WalletConnection />
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <VoterTools />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">VoteCrypto</h3>
              <p className="text-gray-600">
                Empowering civic engagement through Web3 technology and crypto incentives.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Wallet-based Authentication</li>
                <li>Voter Registration Tools</li>
                <li>Absentee Ballot Services</li>
                <li>Crypto Rewards & NFTs</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Powered By</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Next.js Framework</li>
                <li>Thirdweb Web3 SDK</li>
                <li>Vote.org API</li>
                <li>Farcaster Integration</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2024 VoteCrypto. Building the future of civic engagement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
