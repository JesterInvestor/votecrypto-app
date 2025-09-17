'use client';

import { getVoteOrgToolUrl } from '@/lib/api/voteOrg';

interface VoterTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

interface VoterToolCardProps {
  tool: VoterTool;
  isSelected: boolean;
  onSelect: (id: string) => void;
  userState?: string;
  userZip?: string;
}

const VoterToolCard = ({ tool, isSelected, onSelect, userState, userZip }: VoterToolCardProps) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 hover:border-blue-300',
    green: 'border-green-200 bg-green-50 hover:border-green-300',
    purple: 'border-purple-200 bg-purple-50 hover:border-purple-300',
    orange: 'border-orange-200 bg-orange-50 hover:border-orange-300',
    indigo: 'border-indigo-200 bg-indigo-50 hover:border-indigo-300',
    pink: 'border-pink-200 bg-pink-50 hover:border-pink-300',
  };

  const buttonColorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    pink: 'bg-pink-600 hover:bg-pink-700',
  };

  const handleToolAccess = () => {
    // Map tool IDs to Vote.org tool names
    const toolMap = {
      'register': 'register',
      'absentee': 'absentee',
      'polling': 'polling',
      'early': 'early',
      'id': 'id',
      'ballot': 'ballot'
    };

    const voteOrgTool = toolMap[tool.id as keyof typeof toolMap];
    if (voteOrgTool) {
      const additionalParams: Record<string, string> = {};
      if (userZip) {
        additionalParams.zip = userZip;
      }

      const url = getVoteOrgToolUrl(voteOrgTool, userState, additionalParams);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback for unknown tools
      alert(`${tool.title} integration is being developed. Please visit Vote.org directly for now.`);
    }
  };

  return (
    <div 
      className={`
        border-2 rounded-lg p-4 sm:p-6 transition-all duration-200 cursor-pointer
        ${colorClasses[tool.color as keyof typeof colorClasses]}
        ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
      `}
      onClick={() => onSelect(tool.id)}
    >
      <div className="flex items-center mb-3 sm:mb-4">
        <span className="text-2xl sm:text-3xl mr-3">{tool.icon}</span>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{tool.title}</h3>
      </div>
      
      <p className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed">{tool.description}</p>
      
      <div className="space-y-2 mb-4 sm:mb-6">
        {tool.features.map((feature, index) => (
          <div key={index} className="flex items-start text-xs sm:text-sm text-gray-600">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
            <span className="leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>
      
      <button 
        className={`
          w-full text-white px-4 py-3 rounded-md font-medium text-sm transition-colors min-h-[44px]
          ${buttonColorClasses[tool.color as keyof typeof buttonColorClasses]}
        `}
        onClick={(e) => {
          e.stopPropagation();
          handleToolAccess();
        }}
      >
        Access Tool
      </button>
      
      <div className="mt-3 text-center">
        <span className="text-xs text-gray-500">
          🎁 Earn NFT reward upon completion
        </span>
      </div>
    </div>
  );
};

export default VoterToolCard;