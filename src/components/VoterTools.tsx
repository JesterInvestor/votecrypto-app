'use client';

import { useState } from 'react';
import VoterToolCard from './VoterToolCard';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/client';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { base } from 'thirdweb/chains';

const voterTools = [
  {
    id: 'register',
    title: 'Register to Vote',
    description: 'Check your registration status and register to vote in upcoming elections via Vote.org.',
    icon: '📝',
    color: 'blue',
    features: ['Redirects to Vote.org registration', 'State-specific forms', 'Status verification']
  },
  {
    id: 'absentee',
    title: 'Absentee Ballot',
    description: 'Request and track your absentee ballot through Vote.org state resources.',
    icon: '📮',
    color: 'green',
    features: ['State-specific applications', 'Direct Vote.org integration', 'Secure processing']
  },
  {
    id: 'polling',
    title: 'Find Polling Place',
    description: 'Locate your polling station using Google Civic API and Vote.org resources.',
    icon: '📍',
    color: 'purple',
    features: ['Real polling locations', 'Hours & directions', 'Multiple data sources']
  },
  {
    id: 'early',
    title: 'Early Voting',
    description: 'Find early voting locations and schedules via Vote.org.',
    icon: '⏰',
    color: 'orange',
    features: ['Early vote locations', 'Current schedule info', 'State requirements']
  },
  {
    id: 'id',
    title: 'Voter ID Info',
    description: 'Learn about ID requirements and acceptable forms through Vote.org.',
    icon: '🆔',
    color: 'indigo',
    features: ['Current ID requirements', 'Acceptable forms list', 'State-specific rules']
  },
  {
    id: 'ballot',
    title: 'Sample Ballot',
    description: 'Preview your ballot and research candidates via Vote.org resources.',
    icon: '🗳️',
    color: 'pink',
    features: ['Official ballot previews', 'Candidate information', 'Issue details']
  }
];

const VoterTools = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [userState, setUserState] = useState<string>('');
  const [userZip, setUserZip] = useState<string>('');

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

  return (
  <section id="voter-tools" className="px-4 py-12 sm:py-16 sm:px-6 lg:px-8 scroll-mt-16" style={{ background: 'linear-gradient(to bottom, var(--brand-white), var(--brand-blue-50))' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Voter Tools & Services
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Access essential voting services powered by Vote.org integration. Complete actions to earn crypto rewards and NFTs.
          </p>
        </div>

        {/* User Location Input */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Location (Optional)</h3>
          <p className="text-sm text-gray-600 mb-3 sm:mb-4">
            Provide your state and ZIP code for more accurate Vote.org redirects.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="State (e.g., California)"
              value={userState}
              onChange={(e) => setUserState(e.target.value)}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={userZip}
              onChange={(e) => setUserZip(e.target.value)}
              className="sm:w-32 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {voterTools.map((tool) => (
            <VoterToolCard
              key={tool.id}
              tool={tool}
              isSelected={selectedTool === tool.id}
              onSelect={setSelectedTool}
              userState={userState}
              userZip={userZip}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base px-2">
              Connect your wallet to access voter tools and start earning crypto rewards for civic engagement.
            </p>
            <div className="max-w-xs mx-auto">
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
        </div>
      </div>
    </section>
  );
};

export default VoterTools;