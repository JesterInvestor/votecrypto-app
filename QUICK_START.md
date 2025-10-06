# Quick Start Guide

Get VoteCrypto running locally in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Thirdweb account (free at https://thirdweb.com)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Thirdweb Client ID

1. Go to https://thirdweb.com/dashboard
2. Sign in or create a free account
3. Create a new API key or use an existing one
4. Copy your **Client ID** (starts with a long string of characters)

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Thirdweb Client ID:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_actual_client_id_here
```

### 4. Authorize localhost (CRITICAL STEP!)

**This step is required for embedded wallet sign-in to work!**

1. In the Thirdweb dashboard, click on your API key
2. Find the **Allowed Domains** section
3. Click **Add Domain**
4. Add: `localhost`
5. Add: `localhost:3000`
6. Click **Save**

**Why?** Embedded wallets (Google, Email, Discord sign-in) require domain authorization for security.

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Open the App

Open http://localhost:3000 in your browser.

### 7. Test Wallet Connection

1. Click "Connect Wallet" button
2. Try signing in with:
   - Google
   - Email
   - Discord
   - Or any wallet provider

**If you see an "ORIGIN_UNAUTHORIZED" error:**
- Double-check that you added `localhost` to Thirdweb allowed domains
- Wait 10 seconds and try again
- Clear your browser cache

## What's Next?

- **Deploying?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide
- **Configuring?** Check [README.md](./README.md) for all features and configuration
- **Issues?** See the Troubleshooting section in DEPLOYMENT.md

## Common Issues

### ❌ "ORIGIN_UNAUTHORIZED" Error

**Cause:** `localhost` or `localhost:3000` is not in Thirdweb allowed domains

**Fix:**
1. Go to Thirdweb dashboard
2. Add `localhost` and `localhost:3000` to allowed domains
3. Save and try again

### ❌ "Client ID not found"

**Cause:** Environment variable not set correctly

**Fix:**
1. Check `.env.local` exists
2. Verify `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is set
3. Restart dev server: `npm run dev`

### ❌ Build Errors

**Cause:** Dependencies not installed

**Fix:**
```bash
npm install
npm run dev
```

## Minimal Working Configuration

You only need **one** environment variable to get started:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
```

All other features (voter tools, news, etc.) will work with or without additional API keys, though some features may have limited functionality.

## Ready for Production?

When you're ready to deploy:

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Deploy to Vercel (recommended)
3. Add your deployment domain to Thirdweb allowed domains
4. Configure production environment variables

## Need Help?

- Check [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review Thirdweb docs: https://portal.thirdweb.com
