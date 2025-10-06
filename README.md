# votecrypto-app

**Name**: VoteCrypto  
**Domain**: votecrypto.app  
**Tech Stack**:
• Framework: Next.js  
• Web3 Integration: Thirdweb  
• Social Integration: Farcaster  
• APIs: Vote.org API for voter services  
• Incentives: Crypto rewards like NFTs and tokens

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Web3 Authentication**: Connect your crypto wallet using Thirdweb
- **Voter Tools**: Access various voting services through Vote.org API
- **Crypto Incentives**: Earn NFTs and tokens for civic engagement

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure the following:

```bash
# Required: Thirdweb Client ID
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here

# Optional: Other API keys
GOOGLE_CIVIC_API_KEY=your_google_civic_api_key_here
NEWS_API_KEY=your_news_api_key_here
```

### Thirdweb Domain Authorization (IMPORTANT)

To use embedded wallet sign-in (Google, Discord, Email, etc.), you **MUST** authorize your deployment domains in the Thirdweb dashboard:

1. Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Select your project/API key
3. Navigate to **Settings** → **Allowed Domains**
4. Add the following domains:
   - `localhost:3000` (for local development)
   - `votecrypto-app.vercel.app` (for Vercel preview deployments)
   - `votecrypto.app` (for production domain)
   - Any other deployment domains you plan to use

**Note**: Without proper domain authorization, users will see an `ORIGIN_UNAUTHORIZED` error when attempting to sign in with embedded wallets.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. **Important**: After deployment, add your Vercel domain (e.g., `your-app.vercel.app`) to the Thirdweb allowed domains list

### Domain Setup

When deploying to custom domains:
- Add each domain to Thirdweb allowed domains
- Include both apex domain (`example.com`) and www subdomain (`www.example.com`) if applicable
- Update environment variables if needed

## Development

This is a Next.js project with TypeScript and Tailwind CSS for styling.

### Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - React components
- `/src/lib` - Utility functions and API integrations
- `/public` - Static assets

### Troubleshooting

#### "ORIGIN_UNAUTHORIZED" Error

If you see an error like:
```
ORIGIN_UNAUTHORIZED - Invalid request: Unauthorized domain: your-domain.com
```

**Solution**: Add your domain to the Thirdweb dashboard allowed domains list (see Configuration section above).
