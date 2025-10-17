# Google OAuth Setup Guide

## Problems
1. **"Google OAuth not configured"** - Occurs when required Google OAuth environment variables are not set
2. **Redirecting to localhost after consent** - Occurs when `FRONTEND_BASE_URL` is not set in production

## Required Environment Variables

You need to set the following environment variables in your production environment:

### Backend Environment Variables
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://your-backend-domain.com/auth/google/callback"
GOOGLE_REDIRECT_URL="https://your-backend-domain.com/auth/google/callback"  # Alternative name

# Frontend Configuration
FRONTEND_BASE_URL="https://your-frontend-domain.com"
FRONTEND_URL="https://your-frontend-domain.com"  # Alternative name

# Other required variables
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret-key"
NODE_ENV="production"
```

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL="https://your-backend-domain.com"
```

## How to Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Create a new project or select an existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"

5. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill in the required information
   - Add your domain to authorized domains

6. **Set Authorized Redirect URIs**
   - In your OAuth 2.0 Client ID settings
   - Add your callback URL: `https://your-backend-domain.com/auth/google/callback`

## Production Deployment

### For Vercel (Frontend)
1. Go to your Vercel project dashboard
2. Go to "Settings" > "Environment Variables"
3. Add: `NEXT_PUBLIC_API_URL=https://your-backend-domain.com`

### For Backend (Railway, Heroku, etc.)
1. Go to your backend deployment platform
2. Add environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `FRONTEND_BASE_URL`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

## Testing

After setting up the environment variables:

1. **Test the OAuth flow**:
   - Visit: `https://your-backend-domain.com/auth/google/start`
   - Should redirect to Google OAuth consent screen

2. **Check logs**:
   - Look for OAuth-related logs in your backend console
   - The improved error handling will show exactly which variables are missing

## Common Issues

1. **"Google OAuth not configured"**
   - Check that all required environment variables are set
   - Verify the variable names match exactly (case-sensitive)

2. **"Redirecting to localhost after consent screen"**
   - **CRITICAL**: Set `FRONTEND_BASE_URL` environment variable in production
   - Should be: `FRONTEND_BASE_URL=https://your-frontend-domain.com`
   - Without this, OAuth will redirect to localhost instead of your production frontend

3. **"Invalid redirect URI"**
   - Ensure the redirect URI in Google Console matches your `GOOGLE_REDIRECT_URI`
   - Must be exactly: `https://your-backend-domain.com/auth/google/callback`

4. **"Invalid client"**
   - Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
   - Check that the OAuth consent screen is properly configured

5. **"Frontend URL not configured"**
   - Set `FRONTEND_BASE_URL` environment variable in your backend deployment
   - This is required for OAuth callback redirects to work properly

## Security Notes

- Never commit environment variables to version control
- Use strong, unique values for `JWT_SECRET`
- Regularly rotate your Google OAuth credentials
- Ensure your production domains are added to Google OAuth authorized domains
