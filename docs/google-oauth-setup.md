# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the "Continue with Google" button.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Cropdot")
5. Click **"Create"**

### 2. Enable Google+ API (or Google Identity API)

1. In your project, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google Identity"** or **"Google+ API"**
3. Click on **"Google Identity API"** (or **"Google+ API"**)
4. Click **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: Cropdot (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On **"Scopes"** page, click **"Save and Continue"** (default scopes are fine)
7. On **"Test users"** page (if in testing mode), you can add test users or skip
8. Click **"Save and Continue"**
9. Review and click **"Back to Dashboard"**

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Select **"Web application"** as the application type
4. Give it a name (e.g., "Cropdot Web Client")
5. **Authorized JavaScript origins**:
   - Add: `http://localhost:3000` (for development)
   - Add: `https://yourdomain.com` (for production)
6. **Authorized redirect URIs**:
   - Add: `http://localhost:3000/api/auth/callback/google` (for development)
   - Add: `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click **"Create"**
8. **IMPORTANT**: Copy the **Client ID** and **Client Secret** - you'll need these!

### 5. Add Credentials to Your Project

1. Create or update `.env.local` file in your project root:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

2. Generate a secure `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

3. Replace the placeholders with your actual values:
   - `your-client-id-here` → Your Google Client ID
   - `your-client-secret-here` → Your Google Client Secret
   - `your-secret-here` → Generated secret from step 2

### 6. Restart Your Development Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing

1. Go to `http://localhost:3000`
2. Click **"Continue with Google"**
3. You should be redirected to Google's sign-in page
4. After signing in, you'll be redirected back to `/dashboard`

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes or typos

### Error: "invalid_client"
- Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure there are no extra spaces in `.env.local`

### Error: "access_denied"
- Check that the OAuth consent screen is properly configured
- If in testing mode, make sure your email is added as a test user

### Still Not Working?
- Check browser console for detailed error messages
- Verify environment variables are loaded: `console.log(process.env.GOOGLE_CLIENT_ID)` (server-side only)
- Make sure `.env.local` is in `.gitignore` (never commit credentials!)

## Production Setup

When deploying to production:

1. Update OAuth consent screen to **"Published"** (after review)
2. Add production URLs to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
3. Update `.env` or your hosting platform's environment variables:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   NEXTAUTH_SECRET=your-production-secret
   ```

## Security Notes

- **Never commit** `.env.local` to git
- Use different OAuth credentials for development and production
- Keep your `NEXTAUTH_SECRET` secure and rotate it periodically
- The `NEXTAUTH_SECRET` should be at least 32 characters long

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

