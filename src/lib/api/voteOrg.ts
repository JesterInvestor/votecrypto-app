// Vote.org integration
// Since Vote.org doesn't provide a traditional API, we use their web services
// and redirect patterns for voter registration and tools

const VOTE_ORG_BASE_URL = 'https://www.vote.org';
const GOOGLE_CIVIC_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CIVIC_API_KEY || '';

// Google Civic Information API types
interface CivicApiLocation {
  address: {
    locationName?: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  pollingHours?: string;
}

interface CivicApiResponse {
  pollingLocations?: CivicApiLocation[];
}
const STATE_CODES = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH',
  'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
  'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA',
  'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN',
  'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
  'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
};

export interface VoterRegistrationData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface AbsenteeBallotRequest {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  reason: string;
}

export interface PollingLocation {
  name: string;
  address: string;
  hours: string;
  waitTime?: number;
  id?: string;
}

export interface VoteOrgRedirectResult {
  redirectUrl: string;
  method: 'redirect' | 'iframe' | 'popup';
  message: string;
}

// Vote.org integration functions
export async function checkVoterRegistration(address: string, state: string): Promise<{ isRegistered: boolean; status: string; redirectUrl?: string }> {
  try {
    // Vote.org uses state-specific lookup, redirect to their verification tool
    const stateCode = STATE_CODES[state as keyof typeof STATE_CODES] || state.toUpperCase();
    const redirectUrl = `${VOTE_ORG_BASE_URL}/am-i-registered-to-vote/?state=${stateCode}`;
    
    return {
      isRegistered: false, // Can't check automatically, user needs to verify on Vote.org
      status: 'Verification Required',
      redirectUrl
    };
  } catch (error) {
    console.error('Error checking voter registration:', error);
    return {
      isRegistered: false,
      status: 'Error',
      redirectUrl: `${VOTE_ORG_BASE_URL}/am-i-registered-to-vote/`
    };
  }
}

export async function registerToVote(data: VoterRegistrationData): Promise<VoteOrgRedirectResult> {
  try {
    // Build Vote.org registration URL with pre-filled data
    const stateCode = STATE_CODES[data.state as keyof typeof STATE_CODES] || data.state.toUpperCase();
    const params = new URLSearchParams({
      state: stateCode,
      zip: data.zipCode,
      email: data.email,
      ...(data.firstName && { first_name: data.firstName }),
      ...(data.lastName && { last_name: data.lastName }),
      ...(data.phone && { phone: data.phone }),
    });

    const redirectUrl = `${VOTE_ORG_BASE_URL}/register-to-vote/?${params.toString()}`;
    
    return {
      redirectUrl,
      method: 'redirect',
      message: `You'll be redirected to Vote.org to complete your voter registration for ${data.state}.`
    };
  } catch (error) {
    console.error('Error preparing voter registration:', error);
    return {
      redirectUrl: `${VOTE_ORG_BASE_URL}/register-to-vote/`,
      method: 'redirect',
      message: 'You\'ll be redirected to Vote.org to register to vote.'
    };
  }
}

export async function requestAbsenteeBallot(data: AbsenteeBallotRequest): Promise<VoteOrgRedirectResult> {
  try {
    // Build Vote.org absentee ballot URL
    const stateCode = STATE_CODES[data.state as keyof typeof STATE_CODES] || data.state.toUpperCase();
    const params = new URLSearchParams({
      state: stateCode,
      zip: data.zipCode,
      email: data.email,
    });

    const redirectUrl = `${VOTE_ORG_BASE_URL}/absentee-ballot/?${params.toString()}`;
    
    return {
      redirectUrl,
      method: 'redirect',
      message: `You'll be redirected to Vote.org to request your absentee ballot for ${data.state}.`
    };
  } catch (error) {
    console.error('Error preparing absentee ballot request:', error);
    return {
      redirectUrl: `${VOTE_ORG_BASE_URL}/absentee-ballot/`,
      method: 'redirect',
      message: 'You\'ll be redirected to Vote.org to request an absentee ballot.'
    };
  }
}

export async function findPollingLocation(address: string, state: string): Promise<PollingLocation[]> {
  try {
    // Try to use Google Civic Information API if available
    if (GOOGLE_CIVIC_API_KEY) {
      const response = await fetch(
        `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${GOOGLE_CIVIC_API_KEY}&address=${encodeURIComponent(address)}&electionId=2000`
      );
      
      if (response.ok) {
        const data: CivicApiResponse = await response.json();
        if (data.pollingLocations) {
          return data.pollingLocations.map((location: CivicApiLocation, index: number) => ({
            id: `poll-${index}`,
            name: location.address.locationName || 'Polling Location',
            address: `${location.address.line1}, ${location.address.city}, ${location.address.state} ${location.address.zip}`,
            hours: location.pollingHours || 'Check with local election office',
            waitTime: undefined
          }));
        }
      }
    }

    // Fallback: redirect to Vote.org's polling place locator
    const fallbackLocation: PollingLocation = {
      name: 'Find Your Polling Place',
      address: `Visit Vote.org to find polling locations in ${state}`,
      hours: 'Varies by location',
      id: 'vote-org-redirect'
    };

    return [fallbackLocation];
  } catch (error) {
    console.error('Error finding polling locations:', error);
    
    // Error fallback
    return [{
      name: 'Polling Location Lookup',
      address: 'Visit Vote.org or contact your local election office',
      hours: 'Contact local election office for hours',
      id: 'error-fallback'
    }];
  }
}

export async function getEarlyVotingInfo(state: string): Promise<{ locations: PollingLocation[]; dates: string[]; redirectUrl: string }> {
  try {
    const stateCode = STATE_CODES[state as keyof typeof STATE_CODES] || state.toUpperCase();
    const redirectUrl = `${VOTE_ORG_BASE_URL}/early-voting/?state=${stateCode}`;
    
    // Return redirect info since Vote.org handles early voting information
    return {
      locations: [{
        name: 'Early Voting Information',
        address: `Visit Vote.org for early voting locations in ${state}`,
        hours: 'Varies by location and date',
        id: 'early-voting-info'
      }],
      dates: ['Check Vote.org for specific early voting dates in your area'],
      redirectUrl
    };
  } catch (error) {
    console.error('Error getting early voting info:', error);
    return {
      locations: [{
        name: 'Early Voting Information',
        address: 'Contact your local election office',
        hours: 'Contact local election office',
        id: 'error-fallback'
      }],
      dates: ['Contact local election office for dates'],
      redirectUrl: `${VOTE_ORG_BASE_URL}/early-voting/`
    };
  }
}

export async function getVoterIdRequirements(state: string): Promise<{ required: boolean; acceptedForms: string[]; redirectUrl: string; details: string }> {
  try {
    const stateCode = STATE_CODES[state as keyof typeof STATE_CODES] || state.toUpperCase();
    const redirectUrl = `${VOTE_ORG_BASE_URL}/voter-id-laws/?state=${stateCode}`;
    
    // Basic ID requirements data (this could be enhanced with a static database)
    const strictIdStates = ['GA', 'IN', 'KS', 'MS', 'MO', 'TN', 'TX', 'WI'];
    const photoIdStates = ['AL', 'AZ', 'AR', 'FL', 'ID', 'LA', 'MI', 'MT', 'ND', 'OH', 'RI', 'SC', 'SD', 'UT', 'WV'];
    
    const required = strictIdStates.includes(stateCode) || photoIdStates.includes(stateCode);
    
    return {
      required,
      acceptedForms: [
        'Driver\'s License',
        'State ID Card',
        'Passport',
        'Military ID',
        'Tribal ID',
        ...(strictIdStates.includes(stateCode) ? [] : ['Voter Registration Card', 'Bank Statement', 'Utility Bill'])
      ],
      redirectUrl,
      details: `Visit Vote.org for detailed voter ID requirements in ${state}`
    };
  } catch (error) {
    console.error('Error getting voter ID requirements:', error);
    return {
      required: true, // Default to safe assumption
      acceptedForms: [
        'Driver\'s License',
        'State ID Card',
        'Passport',
        'Military ID'
      ],
      redirectUrl: `${VOTE_ORG_BASE_URL}/voter-id-laws/`,
      details: 'Visit Vote.org for detailed voter ID requirements in your state'
    };
  }
}

// Helper function to get Vote.org URL for a specific tool
export function getVoteOrgToolUrl(tool: string, state?: string, additionalParams?: Record<string, string>): string {
  const baseUrls = {
    'register': '/register-to-vote/',
    'check': '/am-i-registered-to-vote/',
    'absentee': '/absentee-ballot/',
    'polling': '/polling-place-locator/',
    'early': '/early-voting/',
    'id': '/voter-id-laws/',
    'ballot': '/ballot/'
  };

  const url = `${VOTE_ORG_BASE_URL}${baseUrls[tool as keyof typeof baseUrls] || '/'}`;
  const params = new URLSearchParams();
  
  if (state) {
    const stateCode = STATE_CODES[state as keyof typeof STATE_CODES] || state.toUpperCase();
    params.append('state', stateCode);
  }
  
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.append(key, value);
    });
  }
  
  return params.toString() ? `${url}?${params.toString()}` : url;
}