# VoteAmerica+ Civic Data API Integration

This document describes the VoteAmerica+ Civic Data API integration implemented in the VoteCrypto application.

## Overview

The VoteAmerica+ Civic Data API provides comprehensive state-specific election data that powers VoteAmerica tools. This integration adds rich election information capabilities to complement the existing Vote.org integration.

## API Endpoints Implemented

### GET /election/field/
- **Authentication:** None required
- **Purpose:** Get all available election field information
- **Returns:** Array of field definitions with descriptions and formats

### GET /election/data/state/{state}/
- **Authentication:** Basic auth required
- **Purpose:** Get comprehensive election data for a specific state
- **Parameters:** 2-letter state postal code (e.g., "CA", "NY")
- **Returns:** State election information including all field values

### GET /election/override/
- **Authentication:** Basic auth required  
- **Purpose:** Get regional overrides where county/city data overrides state data
- **Returns:** Array of regional overrides

## Configuration

### Environment Variables

Add the following to your `.env.local` file:

```bash
# VoteAmerica+ Civic Data API
VOTE_AMERICA_API_KEY_ID=your_api_key_id_here
VOTE_AMERICA_API_KEY_SECRET=your_api_key_secret_here
```

### Getting API Keys

API keys are only available to VoteAmerica+ customers. Contact sales@voteamerica.org to learn more about accessing the Civic Data API.

## Usage Examples

### Basic Field Information (No Auth)
```typescript
import { getElectionFields } from '@/lib/api/voteAmerica';

const fields = await getElectionFields();
console.log(fields); // Array of field definitions
```

### State Election Data (Requires Auth)
```typescript
import { getStateElectionData } from '@/lib/api/voteAmerica';

const stateData = await getStateElectionData('CA');
console.log(stateData.state_information); // Array of state election info
```

### Enhanced Voter ID Requirements (With Fallback)
```typescript
import { getEnhancedVoterIdRequirements } from '@/lib/api/voteAmerica';

const idInfo = await getEnhancedVoterIdRequirements('CA');
console.log(idInfo.source); // 'voteamerica' or 'fallback'
console.log(idInfo.required); // boolean
console.log(idInfo.acceptedForms); // string array
```

### Absentee Ballot Information (With Fallback)
```typescript
import { getAbsenteeBallotInfo } from '@/lib/api/voteAmerica';

const absenteeInfo = await getAbsenteeBallotInfo('CA');
console.log(absenteeInfo.methods); // ['mail', 'online', etc.]
console.log(absenteeInfo.deadline); // deadline information
```

## Error Handling

The integration includes comprehensive error handling:

1. **API Unavailable:** Falls back to static data when VoteAmerica+ API is unreachable
2. **Missing Credentials:** Gracefully handles missing API keys with fallback functionality
3. **Network Errors:** Provides user-friendly error messages
4. **Invalid State Codes:** Validates state input and provides helpful error messages

## Fallback Behavior

When VoteAmerica+ API is not available or not configured:

- **Voter ID Info:** Uses static state-based logic for basic ID requirements
- **Absentee Info:** Provides generic absentee ballot information
- **State Data:** API calls fail gracefully with error messages
- **Field Data:** API calls fail gracefully with error messages

## Interactive Demo

A live demo component is available at the bottom of the home page that allows testing all API endpoints and shows the configuration status. The demo includes:

- Configuration status display
- State selection for testing
- Buttons to test each API endpoint
- Results display with formatted data
- Error handling demonstration

## Integration with Existing Features

The VoteAmerica+ integration enhances existing features:

- **Voter Tools:** Can now provide more detailed state-specific information
- **NFT Rewards:** Enhanced data can trigger more specific reward conditions
- **User Experience:** Richer information leads to better user guidance

## Production Deployment

1. **Environment Setup:** Add API keys to production environment variables
2. **Error Monitoring:** Monitor API calls for failures and fallback usage
3. **Rate Limiting:** Be aware of any API rate limits (check with VoteAmerica+)
4. **Caching:** Consider implementing caching for frequently accessed data

## Development Testing

Without API keys, you can still test:
- Code compilation and TypeScript types
- Error handling and fallback mechanisms  
- UI components and user interactions
- Integration with existing Vote.org functionality

With API keys, you can test:
- Full API functionality
- Real election data retrieval
- Authentication handling
- Regional override capabilities

## API Documentation

For complete API documentation, visit: https://api.voteamerica.org/docs/api/v2