'use client';

import { useState } from 'react';
import { 
  getElectionFields, 
  getStateElectionData, 
  getEnhancedVoterIdRequirements,
  getAbsenteeBallotInfo,
  getVoteAmericaConfig,
  type FieldOption, 
  type StateData 
} from '@/lib/api/voteAmerica';

const VoteAmericaDemo = () => {
  const [selectedState, setSelectedState] = useState('CA');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [voterIdInfo, setVoterIdInfo] = useState<{
    required: boolean;
    acceptedForms: string[];
    details: string;
    source: 'voteamerica' | 'fallback';
    lastUpdated?: string;
  } | null>(null);
  const [absenteeInfo, setAbsenteeInfo] = useState<{
    methods: string[];
    deadline?: string;
    requirements: string;
    source: 'voteamerica' | 'fallback';
    lastUpdated?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = getVoteAmericaConfig();

  const states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
    { code: 'PA', name: 'Pennsylvania' },
  ];

  const handleFetchFields = async () => {
    setLoading(true);
    setError(null);
    try {
      const fieldData = await getElectionFields();
      setFields(fieldData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStateData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStateElectionData(selectedState);
      setStateData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch state data');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchVoterIdInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnhancedVoterIdRequirements(selectedState);
      setVoterIdInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch voter ID info');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAbsenteeInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAbsenteeBallotInfo(selectedState);
      setAbsenteeInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch absentee info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">VoteAmerica+ API Integration Demo</h2>
      
      {/* Configuration Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">API Configuration Status</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Configured:</span> 
            <span className={config.configured ? 'text-green-600' : 'text-red-600'}>
              {config.configured ? ' ✓ Yes' : ' ✗ No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Has API Key ID:</span>
            <span className={config.hasKeyId ? 'text-green-600' : 'text-red-600'}>
              {config.hasKeyId ? ' ✓ Yes' : ' ✗ No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Has API Key Secret:</span>
            <span className={config.hasKeySecret ? 'text-green-600' : 'text-red-600'}>
              {config.hasKeySecret ? ' ✓ Yes' : ' ✗ No'}
            </span>
          </div>
          <div className="col-span-2">
            <span className="font-medium">Base URL:</span> 
            <span className="text-gray-600"> {config.baseUrl}</span>
          </div>
        </div>
        {!config.configured && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Note:</strong> To test authenticated endpoints, add your VoteAmerica+ API keys to your environment variables.
          </div>
        )}
      </div>

      {/* State Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select State for Testing:
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {states.map(state => (
            <option key={state.code} value={state.code}>
              {state.name} ({state.code})
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={handleFetchFields}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Get Fields
        </button>
        <button
          onClick={handleFetchStateData}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Get State Data
        </button>
        <button
          onClick={handleFetchVoterIdInfo}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          Get Voter ID Info
        </button>
        <button
          onClick={handleFetchAbsenteeInfo}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          Get Absentee Info
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {/* Fields Data */}
        {fields.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Election Fields ({fields.length} fields)</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(fields.slice(0, 5), null, 2)}
                {fields.length > 5 && '\n... and ' + (fields.length - 5) + ' more fields'}
              </pre>
            </div>
          </div>
        )}

        {/* State Data */}
        {stateData && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              State Data for {stateData.name} ({stateData.code})
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify({
                  ...stateData,
                  state_information: stateData.state_information.slice(0, 3)
                }, null, 2)}
                {stateData.state_information.length > 3 && 
                  '\n... and ' + (stateData.state_information.length - 3) + ' more information fields'}
              </pre>
            </div>
          </div>
        )}

        {/* Voter ID Info */}
        {voterIdInfo && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Voter ID Requirements</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">ID Required:</span>
                  <span className={voterIdInfo.required ? 'text-red-600' : 'text-green-600'}>
                    {voterIdInfo.required ? ' Yes' : ' No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Data Source:</span>
                  <span className={voterIdInfo.source === 'voteamerica' ? 'text-green-600' : 'text-yellow-600'}>
                    {voterIdInfo.source === 'voteamerica' ? ' VoteAmerica+' : ' Fallback'}
                  </span>
                </div>
                {voterIdInfo.lastUpdated && (
                  <div className="col-span-2">
                    <span className="font-medium">Last Updated:</span>
                    <span className="text-gray-600"> {new Date(voterIdInfo.lastUpdated).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="font-medium">Accepted Forms:</span>
                  <ul className="list-disc list-inside mt-1 text-gray-600">
                    {voterIdInfo.acceptedForms.map((form: string, index: number) => (
                      <li key={index}>{form}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Details:</span>
                  <p className="text-gray-600 mt-1">{voterIdInfo.details}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Absentee Info */}
        {absenteeInfo && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Absentee Ballot Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Data Source:</span>
                  <span className={absenteeInfo.source === 'voteamerica' ? 'text-green-600' : 'text-yellow-600'}>
                    {absenteeInfo.source === 'voteamerica' ? ' VoteAmerica+' : ' Fallback'}
                  </span>
                </div>
                {absenteeInfo.deadline && (
                  <div>
                    <span className="font-medium">Request Deadline:</span>
                    <span className="text-gray-600"> {absenteeInfo.deadline}</span>
                  </div>
                )}
                {absenteeInfo.lastUpdated && (
                  <div className="col-span-2">
                    <span className="font-medium">Last Updated:</span>
                    <span className="text-gray-600"> {new Date(absenteeInfo.lastUpdated).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="font-medium">Request Methods:</span>
                  <ul className="list-disc list-inside mt-1 text-gray-600">
                    {absenteeInfo.methods.map((method: string, index: number) => (
                      <li key={index}>{method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ')}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Requirements:</span>
                  <p className="text-gray-600 mt-1">{absenteeInfo.requirements}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteAmericaDemo;