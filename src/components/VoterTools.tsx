'use client';

import { useState } from 'react';
import VoterToolCard from './VoterToolCard';

const voterTools = [
  {
    id: 'register',
    title: 'Register to Vote',
    description: 'Check your registration status and register to vote in upcoming elections.',
    icon: '📝',
    color: 'blue',
    features: ['Online registration', 'Status verification', 'Deadline reminders']
  },
  {
    id: 'absentee',
    title: 'Absentee Ballot',
    description: 'Request and track your absentee ballot for convenient remote voting.',
    icon: '📮',
    color: 'green',
    features: ['Ballot request', 'Status tracking', 'Return verification']
  },
  {
    id: 'polling',
    title: 'Find Polling Place',
    description: 'Locate your polling station and get directions for election day.',
    icon: '📍',
    color: 'purple',
    features: ['Location finder', 'Hours & directions', 'Wait time updates']
  },
  {
    id: 'early',
    title: 'Early Voting',
    description: 'Find early voting locations and hours in your area.',
    icon: '⏰',
    color: 'orange',
    features: ['Early vote locations', 'Schedule info', 'Eligibility check']
  },
  {
    id: 'id',
    title: 'Voter ID Info',
    description: 'Learn about ID requirements and acceptable forms of identification.',
    icon: '🆔',
    color: 'indigo',
    features: ['ID requirements', 'Acceptable forms', 'How to obtain']
  },
  {
    id: 'ballot',
    title: 'Sample Ballot',
    description: 'Preview your ballot and research candidates before election day.',
    icon: '🗳️',
    color: 'pink',
    features: ['Ballot preview', 'Candidate info', 'Issue details']
  }
];

const VoterTools = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Voter Tools & Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access essential voting services powered by Vote.org API. Complete actions to earn crypto rewards and NFTs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voterTools.map((tool) => (
            <VoterToolCard
              key={tool.id}
              tool={tool}
              isSelected={selectedTool === tool.id}
              onSelect={setSelectedTool}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your wallet to access voter tools and start earning crypto rewards for civic engagement.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Connect Wallet to Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoterTools;