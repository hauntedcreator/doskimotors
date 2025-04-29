import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

// Twitter OAuth 2.0 configuration
const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/twitter/callback` : 'http://localhost:3000/api/auth/twitter/callback';
const SCOPE = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'].join(' ');

export async function GET(req: NextRequest) {
  try {
    console.log('Twitter OAuth initialization started');
    console.log('Environment check:', {
      hasClientId: !!CLIENT_ID,
      hasClientSecret: !!CLIENT_SECRET,
      redirectUri: REDIRECT_URI,
      scope: SCOPE,
      nextAuthUrl: process.env.NEXTAUTH_URL
    });

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Missing Twitter OAuth credentials');
      throw new Error('Twitter OAuth credentials not configured. Please check your environment variables.');
    }

    let client;
    try {
      client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });
    } catch (clientError) {
      console.error('Failed to initialize Twitter client:', clientError);
      throw new Error('Failed to initialize Twitter client. Please check your credentials.');
    }

    try {
      console.log('Generating OAuth2 auth link...');
      const { url, codeVerifier, state } = await client.generateOAuth2AuthLink(
        REDIRECT_URI,
        { scope: SCOPE }
      );
      console.log('Generated OAuth2 URL:', url);

      // Store the code verifier and state in cookies for verification during callback
      const response = NextResponse.redirect(url);
      
      // Set cookies with more permissive settings for local development
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'lax' : 'none') as 'lax' | 'none',
        maxAge: 60 * 10 // 10 minutes
      };

      response.cookies.set('twitter_oauth_state', state, cookieOptions);
      response.cookies.set('twitter_oauth_verifier', codeVerifier, cookieOptions);

      console.log('OAuth state cookies set, redirecting to Twitter...');
      return response;
    } catch (oauthError) {
      console.error('Failed to generate OAuth link:', oauthError);
      throw new Error('Failed to generate Twitter authorization link. Please try again.');
    }
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Detailed error:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });

    // Return an error page that works with popups
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Twitter OAuth Error</title>
          <meta charset="utf-8">
        </head>
        <body>
          <script>
            const error = ${JSON.stringify(errorMessage)};
            if (window.opener) {
              window.opener.location.href = '/vehicle/new?twitter_error=' + encodeURIComponent(error);
              window.close();
            } else {
              window.location.href = '/vehicle/new?twitter_error=' + encodeURIComponent(error);
            }
          </script>
        </body>
      </html>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
} 