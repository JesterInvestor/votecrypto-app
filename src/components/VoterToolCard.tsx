'use client';

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
}

const VoterToolCard = ({ tool, isSelected, onSelect }: VoterToolCardProps) => {
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

  return (
    <div 
      className={`
        border-2 rounded-lg p-6 transition-all duration-200 cursor-pointer
        ${colorClasses[tool.color as keyof typeof colorClasses]}
        ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
      `}
      onClick={() => onSelect(tool.id)}
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{tool.icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
      
      <div className="space-y-2 mb-6">
        {tool.features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm text-gray-600">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
            {feature}
          </div>
        ))}
      </div>
      
      <button 
        className={`
          w-full text-white px-4 py-2 rounded-md font-medium text-sm transition-colors
          ${buttonColorClasses[tool.color as keyof typeof buttonColorClasses]}
        `}
        onClick={(e) => {
          e.stopPropagation();
          // TODO: Integrate with Vote.org API
          alert(`${tool.title} feature coming soon! This will integrate with Vote.org API.`);
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