# Vote.org Integration Documentation

## Overview

Since Vote.org does not provide a traditional REST API, this application integrates with Vote.org through their web-based services and redirect patterns. The integration provides seamless access to voter tools while maintaining the user experience within the VoteCrypto app.

## Integration Approach

### URL-Based Redirects
- **Voter Registration**: Redirects to Vote.org's registration forms with pre-filled user data
- **Absentee Ballot**: Links to state-specific absentee ballot request forms
- **Voter ID Information**: Provides access to state-specific voter ID requirements
- **Early Voting**: Links to early voting location and schedule information

### Alternative Data Sources
- **Polling Locations**: Uses Google Civic Information API when available, falls back to Vote.org links
- **Ballot Information**: Redirects to Vote.org's ballot preview tools

## API Functions

### `registerToVote(data: VoterRegistrationData)`
Creates a Vote.org registration URL with pre-filled user information.

```typescript
const result = await registerToVote({
  address: "123 Main St",
  city: "Los Angeles", 
  state: "California",
  zipCode: "90210",
  email: "user@example.com"
});
// Returns: { redirectUrl: "https://www.vote.org/register-to-vote/?state=CA&zip=90210...", method: "redirect", message: "..." }
```

### `checkVoterRegistration(address: string, state: string)`
Provides a redirect URL to Vote.org's voter registration verification tool.

### `requestAbsenteeBallot(data: AbsenteeBallotRequest)`
Creates a redirect to Vote.org's absentee ballot request system.

### `findPollingLocation(address: string, state: string)`
- Primary: Uses Google Civic Information API if configured
- Fallback: Returns Vote.org polling location finder information

### `getEarlyVotingInfo(state: string)`
Returns early voting information and Vote.org redirect URL for the specified state.

### `getVoterIdRequirements(state: string)`
Provides basic voter ID requirements with fallback to Vote.org's detailed information.

## State Code Mapping

The integration includes a comprehensive mapping of state names to postal codes for accurate Vote.org redirects:

```typescript
const STATE_CODES = {
  'California': 'CA',
  'New York': 'NY',
  // ... all 50 states and DC
};
```

## Configuration

### Required Environment Variables
None - basic Vote.org integration works without API keys.

### Optional Environment Variables
- `NEXT_PUBLIC_GOOGLE_CIVIC_API_KEY`: Enables enhanced polling location lookup

## Error Handling

All functions include comprehensive error handling with fallback mechanisms:
1. Try primary data source (Google Civic API, etc.)
2. Fall back to Vote.org redirect URLs
3. Provide generic fallback messages if all else fails

## User Experience

The integration provides:
1. **Location Input**: Optional state/ZIP fields for more accurate redirects
2. **Seamless Redirects**: Opens Vote.org tools in new tabs/windows
3. **Clear Messaging**: Explains what will happen when users click buttons
4. **Progressive Enhancement**: Works without JavaScript/API keys

## Testing

Test the integration by:
1. Entering different states in the location inputs
2. Clicking each voter tool button
3. Verifying that correct Vote.org URLs are generated
4. Testing error scenarios (invalid states, network issues)

## Future Enhancements

Potential improvements:
- Add iframe embedding for seamless UX where possible
- Implement webhook endpoints for completion tracking
- Add more sophisticated state-specific routing
- Integrate with additional civic data APIs