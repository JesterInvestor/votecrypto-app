# Embedded Wallet Sign-In Setup Guide

## Issue Overview

When users try to sign in using embedded wallets (Google, Email, Discord, etc.) on deployed domains, they may encounter this error:

```json
{
  "message": "ORIGIN_UNAUTHORIZED - Invalid request: Unauthorized domain: votecrypto-app.vercel.app. You can view the restrictions on this API key at https://thirdweb.com/create-api-key",
  "code": "UNAUTHORIZED"
}
```

## Why This Happens

Thirdweb's embedded wallet feature requires domain authorization for security. This means you must explicitly whitelist each domain where your application will run in the Thirdweb dashboard.

## Solution: Authorize Your Domains

### Step 1: Access Thirdweb Dashboard

1. Navigate to: https://thirdweb.com/dashboard
2. Sign in with your Thirdweb account
3. Click on **Settings** or **API Keys** in the sidebar

### Step 2: Select Your API Key

1. Find the API key you're using (the one matching `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`)
2. Click on it to open the settings page
3. Look for the **Allowed Domains** or **Allowed Origins** section

### Step 3: Add Required Domains

Add the following domains based on your deployment:

#### For Local Development
```
localhost
localhost:3000
```

#### For Vercel Deployments

**Preview/Staging Deployments:**
```
votecrypto-app-git-*.vercel.app
*.vercel.app
```

**Production Deployment:**
```
votecrypto-app.vercel.app
```

#### For Custom Domains
```
votecrypto.app
www.votecrypto.app
```

### Step 4: Save Changes

1. Click **Save**, **Update**, or **Add Domain** (button name varies)
2. Wait 5-10 seconds for changes to propagate
3. Test the wallet connection again

## Verification

After adding domains, verify the setup:

1. Visit your deployed application
2. Click "Connect Wallet"
3. Try signing in with an embedded wallet option:
   - Sign in with Google
   - Sign in with Email
   - Sign in with Discord
4. You should now be able to authenticate successfully

## Domain Configuration Examples

### Example 1: Development Only
```
localhost
localhost:3000
```

### Example 2: Development + Vercel Production
```
localhost
localhost:3000
votecrypto-app.vercel.app
```

### Example 3: Full Setup (Recommended)
```
localhost
localhost:3000
*.vercel.app
votecrypto-app.vercel.app
votecrypto.app
www.votecrypto.app
```

## Wildcard Support

Thirdweb supports wildcards for subdomains:

- `*.vercel.app` - Matches all Vercel preview deployments
- `*.votecrypto.app` - Matches all subdomains of your custom domain

**Note:** Only use wildcards if you control all subdomains. For production, specific domains are more secure.

## Troubleshooting

### Error Still Occurs After Adding Domain

**Possible causes:**
1. Domain typo (check for extra spaces, http://, or trailing slashes)
2. Wrong API key (verify CLIENT_ID matches the dashboard)
3. Cache issues (wait 30 seconds, clear browser cache)
4. Wrong domain format (use `domain.com` not `https://domain.com`)

**Solutions:**
1. Double-check the exact domain from the error message
2. Verify `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` environment variable
3. Try in incognito/private browsing mode
4. Redeploy your application

### Cannot Find Allowed Domains Section

**Locations to check:**
1. Dashboard → API Keys → [Your Key] → Settings
2. Dashboard → Settings → Security → Allowed Domains
3. Dashboard → Project Settings → Allowed Origins

**If still not found:**
- Ensure you're using a paid or free tier that supports this feature
- Contact Thirdweb support if the option is missing

### Multiple Environments Not Working

If you have multiple environments (dev, staging, prod):

1. Create a separate API key for each environment (recommended)
2. OR add all domains to a single API key
3. Use environment-specific CLIENT_IDs in your deployment config

**Example setup:**
```
Development:   CLIENT_ID_DEV   → localhost
Staging:       CLIENT_ID_STAGE → staging.votecrypto.app
Production:    CLIENT_ID_PROD  → votecrypto.app
```

## Security Best Practices

1. **Only add domains you control**
   - Never add domains you don't own
   - Remove old/unused domains regularly

2. **Use specific domains in production**
   - Avoid wildcards for production if possible
   - `votecrypto.app` is better than `*.app`

3. **Separate API keys for environments**
   - Different keys for dev/staging/prod
   - Easier to manage and revoke access

4. **Monitor unauthorized access attempts**
   - Check Thirdweb dashboard analytics
   - Set up alerts for suspicious activity

## Quick Reference

| Environment | Domain to Add | Priority |
|------------|---------------|----------|
| Local Dev | `localhost`, `localhost:3000` | Required |
| Vercel Preview | `*.vercel.app` | Recommended |
| Vercel Production | `votecrypto-app.vercel.app` | Required |
| Custom Domain | `votecrypto.app` | Required |
| Custom WWW | `www.votecrypto.app` | If used |

## Additional Resources

- [Thirdweb Dashboard](https://thirdweb.com/dashboard)
- [Thirdweb Documentation - Embedded Wallets](https://portal.thirdweb.com/wallet/embedded-wallet)
- [VoteCrypto Deployment Guide](./DEPLOYMENT.md)
- [VoteCrypto Quick Start](./QUICK_START.md)

## Still Need Help?

If you're still experiencing issues:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review Thirdweb's documentation
3. Check browser console for detailed error messages
4. Verify network requests in browser dev tools
5. Contact Thirdweb support with:
   - Your CLIENT_ID (safe to share)
   - The exact error message
   - The domain you're trying to access from
   - Screenshots of your allowed domains configuration

---

**Summary:** To enable embedded wallet sign-in, you MUST add your deployment domains to the Thirdweb dashboard's allowed domains list. This is a required security feature and cannot be bypassed through code changes.
