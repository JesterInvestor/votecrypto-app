# VoteCrypto Deployment Guide

This guide covers deployment of the VoteCrypto app to various platforms and important configuration steps.

## Prerequisites

Before deploying, ensure you have:

1. A Thirdweb account and API key (Client ID)
2. Environment variables configured
3. Access to your deployment platform (Vercel, etc.)

## Thirdweb Configuration (CRITICAL)

### Why Domain Authorization is Required

VoteCrypto uses Thirdweb's embedded wallet feature (`inAppWallet`) which allows users to sign in with:
- Google
- Discord
- Email
- Telegram
- Farcaster
- X (Twitter)
- And other social providers

For security reasons, Thirdweb requires you to explicitly authorize the domains where your application will be hosted.

### How to Authorize Domains

1. **Go to Thirdweb Dashboard**
   - Visit: https://thirdweb.com/dashboard
   - Log in with your Thirdweb account

2. **Select Your API Key**
   - Navigate to **Settings** → **API Keys**
   - Click on the API key you're using for VoteCrypto
   - Or create a new API key if needed

3. **Add Allowed Domains**
   - Find the **Allowed Domains** section
   - Click **Add Domain**
   - Add each domain where your app will be hosted:

   **For Development:**
   ```
   localhost
   localhost:3000
   ```

   **For Vercel Deployments:**
   ```
   votecrypto-app.vercel.app
   *.vercel.app
   ```
   
   **For Production:**
   ```
   votecrypto.app
   www.votecrypto.app
   ```

4. **Save Changes**
   - Click **Save** or **Update**
   - Changes take effect immediately

### Common Domain Patterns

| Environment | Domain Pattern | Example |
|------------|----------------|---------|
| Local Development | `localhost`, `localhost:3000` | `localhost:3000` |
| Vercel Preview | `*-username.vercel.app` | `votecrypto-app-git-main.vercel.app` |
| Vercel Production | `your-project.vercel.app` | `votecrypto-app.vercel.app` |
| Custom Domain | Your domain name | `votecrypto.app` |

**Tip**: You can use wildcards for Vercel preview deployments: `*.vercel.app`

## Deployment Platforms

### Vercel (Recommended)

1. **Initial Setup**
   ```bash
   # Install Vercel CLI (optional)
   npm install -g vercel
   ```

2. **Deploy via GitHub Integration**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings (auto-detected for Next.js)

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the following:
     ```
     NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
     GOOGLE_CIVIC_API_KEY=your_google_api_key
     NEWS_API_KEY=your_news_api_key
     THIRDWEB_SECRET_KEY=your_secret_key
     THIRDWEB_ENGINE_URL=your_engine_url
     THIRDWEB_ENGINE_ACCESS_TOKEN=your_access_token
     ```

4. **Add Domain to Thirdweb**
   - After deployment, note your Vercel URL (e.g., `votecrypto-app.vercel.app`)
   - Add this domain to Thirdweb allowed domains (see above)

5. **Custom Domain Setup**
   - In Vercel, go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed
   - Add the custom domain to Thirdweb allowed domains

### Netlify

1. **Deploy**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Add the same environment variables as Vercel

3. **Domain Authorization**
   - Add Netlify domain to Thirdweb (e.g., `your-site.netlify.app`)

### Docker

1. **Build Image**
   ```bash
   docker build -t votecrypto-app .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_id \
     votecrypto-app
   ```

3. **Domain Authorization**
   - Add your Docker host domain to Thirdweb

## Post-Deployment Checklist

- [ ] Environment variables are configured
- [ ] Deployment domain is added to Thirdweb allowed domains
- [ ] Test wallet connection with embedded wallets (Google, Email, etc.)
- [ ] Test external wallet connections (MetaMask, Coinbase)
- [ ] Verify voter tools are accessible
- [ ] Check that API integrations are working
- [ ] Test on mobile devices

## Troubleshooting

### Error: "ORIGIN_UNAUTHORIZED"

**Full Error:**
```
{
  "message": "ORIGIN_UNAUTHORIZED - Invalid request: Unauthorized domain: your-domain.com",
  "code": "UNAUTHORIZED"
}
```

**Solution:**
1. Go to Thirdweb Dashboard
2. Add the domain to allowed domains
3. Wait a few seconds for changes to propagate
4. Try connecting wallet again

### Embedded Wallets Not Working

**Symptoms:**
- Social login buttons don't work
- Error when clicking "Sign in with Google/Email/etc."

**Solution:**
- Verify domain is in Thirdweb allowed domains
- Check that `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is set correctly
- Ensure you're using the correct API key
- Check browser console for specific error messages

### External Wallets Not Connecting

**Symptoms:**
- MetaMask/Coinbase wallets don't connect

**Solution:**
- Check that wallet extensions are installed
- Try a different browser
- Check browser console for errors
- Verify the chain ID is supported (Base chain: 8453)

## Environment-Specific Notes

### Development
- Use `localhost` or `localhost:3000` in allowed domains
- No HTTPS required
- Use `.env.local` for local environment variables

### Staging/Preview
- Each preview deployment gets a unique URL
- Consider using wildcard domains for Vercel: `*.vercel.app`
- Test thoroughly before promoting to production

### Production
- Always use HTTPS (automatic with Vercel/Netlify)
- Add both apex and www domains if applicable
- Monitor error logs for unauthorized domain errors
- Keep a list of all authorized domains

## Security Best Practices

1. **API Keys**
   - Never commit API keys to Git
   - Use environment variables
   - Rotate keys periodically

2. **Domain Authorization**
   - Only add domains you control
   - Remove old/unused domains
   - Use specific domains instead of wildcards when possible

3. **Client ID vs Secret Key**
   - `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`: Public, client-side
   - `THIRDWEB_SECRET_KEY`: Private, server-side only
   - Never expose secret keys in client code

## Support

If you encounter issues not covered in this guide:

1. Check Thirdweb documentation: https://portal.thirdweb.com
2. Review Thirdweb dashboard settings
3. Check application logs
4. Review GitHub issues

## Additional Resources

- [Thirdweb Documentation](https://portal.thirdweb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)
