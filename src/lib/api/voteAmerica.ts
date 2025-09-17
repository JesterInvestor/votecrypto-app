// VoteAmerica+ Civic Data API integration
// Provides comprehensive state-specific election data
// API docs: https://api.voteamerica.org/docs/api/v2

const VOTE_AMERICA_BASE_URL = 'https://api.voteamerica.org/v2';
const VOTE_AMERICA_API_KEY_ID = process.env.VOTE_AMERICA_API_KEY_ID || '';
const VOTE_AMERICA_API_KEY_SECRET = process.env.VOTE_AMERICA_API_KEY_SECRET || '';

// API Response Types
export interface FieldOption {
  slug: string;
  description: string;
  field_format: string;
  options?: string[];
}

export interface StateInformationField {
  field_type: string;
  text: string;
  bool_value?: boolean;
  multiselect_value?: string[];
  footnotes?: string;
  modified_at: string;
}

export interface StateData {
  code: string;
  name: string;
  state_information: StateInformationField[];
}

export interface RegionalOverride {
  state: string;
  region: {
    name: string;
  };
  field: {
    slug: string;
  };
  value: string;
}

// Helper function to create authentication headers
function createAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add basic auth if API keys are available
  if (VOTE_AMERICA_API_KEY_ID && VOTE_AMERICA_API_KEY_SECRET) {
    const credentials = btoa(`${VOTE_AMERICA_API_KEY_ID}:${VOTE_AMERICA_API_KEY_SECRET}`);
    headers['Authorization'] = `Basic ${credentials}`;
  }

  return headers;
}

// Helper function for API requests
async function voteAmericaRequest<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
  const url = `${VOTE_AMERICA_BASE_URL}${endpoint}`;
  
  try {
    const headers = requiresAuth ? createAuthHeaders() : { 'Content-Type': 'application/json' };
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && requiresAuth) {
        throw new Error('VoteAmerica+ API authentication failed. Please check your API keys.');
      }
      throw new Error(`VoteAmerica+ API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`VoteAmerica+ API error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get all available election field information
 * No authentication required
 */
export async function getElectionFields(): Promise<FieldOption[]> {
  try {
    return await voteAmericaRequest<FieldOption[]>('/election/field/', false);
  } catch (error) {
    console.error('Error fetching election fields:', error);
    throw new Error('Failed to fetch election field information');
  }
}

/**
 * Get comprehensive election data for a specific state
 * Requires API authentication
 * @param state - 2-letter state postal code (uppercase)
 */
export async function getStateElectionData(state: string): Promise<StateData> {
  if (!state || state.length !== 2) {
    throw new Error('State must be a 2-letter postal abbreviation (e.g., "CA", "NY")');
  }

  const stateCode = state.toUpperCase();
  
  try {
    return await voteAmericaRequest<StateData>(`/election/data/state/${stateCode}/`, true);
  } catch (error) {
    console.error(`Error fetching state data for ${stateCode}:`, error);
    throw new Error(`Failed to fetch election data for ${stateCode}`);
  }
}

/**
 * Get regional overrides for election data
 * Returns cases where county/city data overrides state data
 * Requires API authentication
 */
export async function getRegionalOverrides(): Promise<RegionalOverride[]> {
  try {
    return await voteAmericaRequest<RegionalOverride[]>('/election/override/', true);
  } catch (error) {
    console.error('Error fetching regional overrides:', error);
    throw new Error('Failed to fetch regional override information');
  }
}

/**
 * Get specific field value for a state
 * Convenience function that extracts a specific field from state data
 */
export async function getStateFieldValue(state: string, fieldSlug: string): Promise<StateInformationField | null> {
  try {
    const stateData = await getStateElectionData(state);
    const field = stateData.state_information.find(info => info.field_type === fieldSlug);
    return field || null;
  } catch (error) {
    console.error(`Error fetching field ${fieldSlug} for state ${state}:`, error);
    return null;
  }
}

/**
 * Check if VoteAmerica+ API is properly configured
 */
export function isVoteAmericaConfigured(): boolean {
  return !!(VOTE_AMERICA_API_KEY_ID && VOTE_AMERICA_API_KEY_SECRET);
}

/**
 * Get configuration status for debugging
 */
export function getVoteAmericaConfig(): {
  configured: boolean;
  hasKeyId: boolean;
  hasKeySecret: boolean;
  baseUrl: string;
} {
  return {
    configured: isVoteAmericaConfigured(),
    hasKeyId: !!VOTE_AMERICA_API_KEY_ID,
    hasKeySecret: !!VOTE_AMERICA_API_KEY_SECRET,
    baseUrl: VOTE_AMERICA_BASE_URL,
  };
}

/**
 * Enhanced integration functions that combine VoteAmerica+ data with existing functionality
 */

/**
 * Get comprehensive voter ID requirements using VoteAmerica+ data
 */
export async function getEnhancedVoterIdRequirements(state: string): Promise<{
  required: boolean;
  acceptedForms: string[];
  details: string;
  source: 'voteamerica' | 'fallback';
  lastUpdated?: string;
}> {
  try {
    const idField = await getStateFieldValue(state, 'voter_id_required');
    if (idField) {
      const required = idField.bool_value ?? false;
      const details = idField.text || 'Voter ID requirements vary by state';
      
      return {
        required,
        acceptedForms: required ? [
          "Driver's License",
          "State ID Card",
          "Passport",
          "Military ID",
          "Tribal ID"
        ] : [],
        details,
        source: 'voteamerica',
        lastUpdated: idField.modified_at,
      };
    }
  } catch (error) {
    console.error('VoteAmerica+ voter ID lookup failed, using fallback:', error);
  }

  // Fallback to basic state-based logic
  const stateCode = state.toUpperCase();
  const strictIdStates = ['GA', 'IN', 'KS', 'MS', 'MO', 'TN', 'TX', 'WI'];
  const photoIdStates = ['AL', 'AZ', 'AR', 'FL', 'ID', 'LA', 'MI', 'MT', 'ND', 'OH', 'RI', 'SC', 'SD', 'UT', 'WV'];
  const required = strictIdStates.includes(stateCode) || photoIdStates.includes(stateCode);

  return {
    required,
    acceptedForms: required ? [
      "Driver's License",
      "State ID Card", 
      "Passport",
      "Military ID"
    ] : [],
    details: `Visit your state's election website for detailed voter ID requirements in ${state}`,
    source: 'fallback',
  };
}

/**
 * Get absentee ballot request information using VoteAmerica+ data
 */
export async function getAbsenteeBallotInfo(state: string): Promise<{
  methods: string[];
  deadline?: string;
  requirements: string;
  source: 'voteamerica' | 'fallback';
  lastUpdated?: string;
}> {
  try {
    const methodsField = await getStateFieldValue(state, 'absentee_request_methods');
    const deadlineField = await getStateFieldValue(state, 'absentee_request_deadline');
    
    if (methodsField) {
      return {
        methods: methodsField.multiselect_value || ['mail'],
        deadline: deadlineField?.text,
        requirements: methodsField.footnotes || 'Check your state\'s specific requirements',
        source: 'voteamerica',
        lastUpdated: methodsField.modified_at,
      };
    }
  } catch (error) {
    console.error('VoteAmerica+ absentee lookup failed, using fallback:', error);
  }

  return {
    methods: ['mail', 'in_person'],
    requirements: 'Contact your local election office for specific requirements',
    source: 'fallback',
  };
}